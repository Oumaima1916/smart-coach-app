const WorkoutLog = require('../models/WorkoutLog');
const Program = require('../models/Program');

// ─── helpers ──────────────────────────────────────────────────────────────────

// MET (metabolic equivalent) lookup by difficulty — standard exercise science values
const MET_BY_DIFFICULTY = {
  Beginner:     4.0,
  Intermediate: 6.0,
  Advanced:     8.5,
};

// calories = MET × weight(kg) × duration(hours)
// we default to 75 kg when no user profile is attached yet
function estimateCalories(activeSec, difficulty, weightKg = 75) {
  const met = MET_BY_DIFFICULTY[difficulty] ?? 5.0;
  const hours = activeSec / 3600;
  return Math.round(met * weightKg * hours);
}

// unified guard — returns the log or sends a 404 and returns null
async function getLogOrFail(logId, res) {
  const log = await WorkoutLog.findLogById(logId);
  if (!log) {
    res.status(404).json({ message: 'Workout session not found.' });
    return null;
  }
  return log;
}

// ─── POST /api/workouts/start ─────────────────────────────────────────────────
// creates a new session row; the client timer starts the moment it gets the response
async function startWorkoutSession(req, res) {
  const { planId, planTitle } = req.body;
  const userId = req.user?.id ?? null; // null until auth middleware is wired

  if (!planTitle) {
    return res.status(400).json({ message: 'planTitle is required.' });
  }

  const log = await WorkoutLog.createLog({ userId, planId, planTitle });

  return res.status(201).json({
    message: 'Workout session started.',
    session: {
      logId:     log.id,
      status:    log.status,
      startedAt: log.started_at,
    },
  });
}

// ─── POST /api/workouts/:logId/pause ─────────────────────────────────────────
// opens a pause event row; the client freezes its local timer on the same tick
async function pauseWorkoutSession(req, res) {
  const { logId } = req.params;
  const log = await getLogOrFail(logId, res);
  if (!log) return;

  if (log.status !== 'active') {
    return res.status(409).json({ message: `Session is already ${log.status}.` });
  }

  // open the pause event and flip the status atomically
  const [event, updated] = await Promise.all([
    WorkoutLog.openPauseEvent(logId),
    WorkoutLog.setStatus(logId, 'paused'),
  ]);

  return res.json({
    message: 'Session paused.',
    session: {
      logId:    updated.id,
      status:   updated.status,
      pausedAt: event.paused_at,
    },
  });
}

// ─── POST /api/workouts/:logId/resume ────────────────────────────────────────
// closes the pause event, recalculates total paused time, and sets status back to active
async function resumeWorkoutSession(req, res) {
  const { logId } = req.params;
  const log = await getLogOrFail(logId, res);
  if (!log) return;

  if (log.status !== 'paused') {
    return res.status(409).json({ message: 'Session is not currently paused.' });
  }

  // close the open pause event and get the gap we just accumulated
  const gapSec = await WorkoutLog.closePauseEvent(logId);

  // re-sum everything from the DB so the cache stays consistent
  const totalPausedSec = await WorkoutLog.sumPausedSeconds(logId);

  const updated = await WorkoutLog.setStatus(logId, 'active');

  return res.json({
    message: 'Session resumed.',
    session: {
      logId:              updated.id,
      status:             updated.status,
      lastPauseDurationSec: gapSec,
      totalPausedSec,
    },
  });
}

// ─── POST /api/workouts/:logId/finish ────────────────────────────────────────
// computes real active time and dynamic calorie burn, then marks the session done
async function finishWorkoutSession(req, res) {
  const { logId } = req.params;
  const log = await getLogOrFail(logId, res);
  if (!log) return;

  if (log.status === 'completed') {
    return res.status(409).json({ message: 'Session is already completed.' });
  }

  // close any dangling pause in case the user finishes while technically "paused"
  if (log.status === 'paused') {
    await WorkoutLog.closePauseEvent(logId);
  }

  const totalPausedSec = await WorkoutLog.sumPausedSeconds(logId);
  const wallClockSec   = Math.round((Date.now() - new Date(log.started_at)) / 1000);
  const activeSec      = Math.max(0, wallClockSec - totalPausedSec);

  // pull difficulty from the linked plan so calorie maths stays accurate
  let difficulty = 'Intermediate';
  if (log.plan_id) {
    const plan = await Program.findById(log.plan_id);
    if (plan) difficulty = plan.difficulty;
  }

  // allow the client to pass the user's real weight if it has it
  const weightKg     = Number(req.body?.weightKg) || 75;
  const caloriesBurned = estimateCalories(activeSec, difficulty, weightKg);

  const finalLog = await WorkoutLog.finaliseLog(logId, {
    activeDurationSec: activeSec,
    caloriesBurned,
    totalPausedSec,
  });

  return res.json({
    message: 'Workout completed!',
    session: {
      logId:          finalLog.id,
      status:         finalLog.status,
      startedAt:      finalLog.started_at,
      endedAt:        finalLog.ended_at,
      activeDurationSec: finalLog.active_duration_sec,
      totalPausedSec: finalLog.total_paused_seconds,
      caloriesBurned: finalLog.calories_burned,
    },
  });
}

// ─── GET /api/workouts/history ────────────────────────────────────────────────
// returns the last N sessions for the authenticated user (progress page)
async function getWorkoutHistory(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const logs = await WorkoutLog.findLogsByUser(userId, limit);
  return res.json({ logs });
}

// ─── GET /api/workouts/summary ────────────────────────────────────────────────
// returns dashboard summary metrics for the authenticated user
async function getWorkoutSummary(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const summary = await WorkoutLog.getSummaryByUser(userId);
  return res.json({ summary });
}

// ─── GET /api/workouts/:logId ─────────────────────────────────────────────────
// lets the client re-hydrate Redux state after a reload mid-session
async function getSessionById(req, res) {
  const log = await getLogOrFail(req.params.logId, res);
  if (!log) return;
  return res.json({ session: log });
}


module.exports = {
  startWorkoutSession,
  pauseWorkoutSession,
  resumeWorkoutSession,
  finishWorkoutSession,
  getWorkoutHistory,
  getWorkoutSummary,
  getSessionById,
};
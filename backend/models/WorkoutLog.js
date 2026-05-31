const pool = require('../db/pool');

// create a fresh session row the moment the user hits "Start Workout"
async function createLog({ userId, planId, planTitle }) {
  const { rows } = await pool.query(
    `INSERT INTO workout_logs (user_id, plan_id, plan_title, status, started_at)
     VALUES ($1, $2, $3, 'active', NOW())
     RETURNING *`,
    [userId ?? null, planId ?? null, planTitle ?? null]
  );
  return rows[0];
}

async function findLogById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM workout_logs WHERE id = $1',
    [id]
  );
  return rows[0] ?? null;
}

// open a pause event — resumedAt stays NULL until the user hits resume
async function openPauseEvent(logId) {
  const { rows } = await pool.query(
    `INSERT INTO workout_pause_events (log_id, paused_at)
     VALUES ($1, NOW()) RETURNING *`,
    [logId]
  );
  return rows[0];
}

// close the most recent open pause event and return the gap in seconds
async function closePauseEvent(logId) {
  // find the latest unresolved pause for this session
  const { rows: open } = await pool.query(
    `SELECT id, paused_at FROM workout_pause_events
     WHERE log_id = $1 AND resumed_at IS NULL
     ORDER BY paused_at DESC LIMIT 1`,
    [logId]
  );

  if (!open.length) return 0;

  const { rows: closed } = await pool.query(
    `UPDATE workout_pause_events
     SET resumed_at = NOW()
     WHERE id = $1
     RETURNING paused_at, resumed_at`,
    [open[0].id]
  );

  const { paused_at, resumed_at } = closed[0];
  const gapSec = Math.round((new Date(resumed_at) - new Date(paused_at)) / 1000);
  return gapSec;
}

// sum all closed pause gaps for the session (used on resume to keep the cache fresh)
async function sumPausedSeconds(logId) {
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(
       EXTRACT(EPOCH FROM (resumed_at - paused_at))
     ), 0)::INTEGER AS total
     FROM workout_pause_events
     WHERE log_id = $1 AND resumed_at IS NOT NULL`,
    [logId]
  );
  return rows[0].total;
}

async function setStatus(logId, status) {
  const { rows } = await pool.query(
    `UPDATE workout_logs
     SET status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING *`,
    [status, logId]
  );
  return rows[0] ?? null;
}

// write the final totals when the session is completed
async function finaliseLog(logId, { activeDurationSec, caloriesBurned, totalPausedSec }) {
  const { rows } = await pool.query(
    `UPDATE workout_logs
     SET status              = 'completed',
         ended_at            = NOW(),
         total_paused_seconds = $1,
         active_duration_sec = $2,
         calories_burned     = $3,
         updated_at          = NOW()
     WHERE id = $4
     RETURNING *`,
    [totalPausedSec, activeDurationSec, caloriesBurned, logId]
  );
  return rows[0] ?? null;
}

// mark individual exercise steps as done (called from the step-tracker UI)
async function markStepCompleted(logId, stepOrder) {
  // upsert pattern — safe to call multiple times for the same step
  const { rows } = await pool.query(
    `INSERT INTO workout_log_exercises (log_id, step_order, name, completed, completed_at)
     VALUES ($1, $2, '', TRUE, NOW())
     ON CONFLICT (log_id, step_order)
     DO UPDATE SET completed = TRUE, completed_at = NOW()
     RETURNING *`,
    [logId, stepOrder]
  );
  return rows[0];
}

// pull the full history for a user (dashboard / progress page later)
async function findLogsByUser(userId, limit = 20) {
  const { rows } = await pool.query(
    `SELECT * FROM workout_logs
     WHERE user_id = $1
     ORDER BY started_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return rows;
}

async function getSummaryByUser(userId) {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*)::INT AS total_workouts,
       COALESCE(SUM(calories_burned), 0)::INT AS total_calories,
       COALESCE(AVG(active_duration_sec), 0)::INT AS avg_duration_sec,
       COUNT(DISTINCT DATE(started_at))::INT AS active_days
     FROM workout_logs
     WHERE user_id = $1
       AND status = 'completed'`,
    [userId]
  );

  return rows[0] || {
    total_workouts: 0,
    total_calories: 0,
    avg_duration_sec: 0,
    active_days: 0,
  };
}

module.exports = {
  createLog,
  findLogById,
  openPauseEvent,
  closePauseEvent,
  sumPausedSeconds,
  setStatus,
  finaliseLog,
  markStepCompleted,
  findLogsByUser,
  getSummaryByUser,
};
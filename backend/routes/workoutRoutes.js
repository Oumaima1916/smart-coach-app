const { Router } = require('express');
const {
  startWorkoutSession,
  pauseWorkoutSession,
  resumeWorkoutSession,
  finishWorkoutSession,
  getWorkoutHistory,
  getSessionById,
} = require('../controllers/workoutController');

const asyncHandler = require('../middleware/asyncHandler');

const router = Router();

// ── session lifecycle ─────────────────────────────────────────────────────────

// fires when the user presses "Start Workout" in WorkoutDetails.jsx
router.post('/start', asyncHandler(startWorkoutSession));

// the client calls these as the user taps pause/resume in the active tracker
router.post('/:logId/pause',  asyncHandler(pauseWorkoutSession));
router.post('/:logId/resume', asyncHandler(resumeWorkoutSession));
router.post('/:logId/finish', asyncHandler(finishWorkoutSession));

// ── read endpoints ────────────────────────────────────────────────────────────

// re-hydrate Redux session state after a hard reload mid-workout
router.get('/:logId', asyncHandler(getSessionById));

// progress / history dashboard (requires auth)
router.get('/', asyncHandler(getWorkoutHistory));

module.exports = router;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  Object.assign(process.env, dotenv.parse(fs.readFileSync(envPath)));
}

const express      = require('express');
const cors         = require('cors');
const authRoutes   = require('./routes/authRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const programRoutes = require('./routes/programRoutes');
const errorHandler  = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── middleware ────────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// ── routes ────────────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({ message: 'Smart Coach API is UP! 🚀' });
});

// authentication + profile endpoints
app.use('/api/auth', authRoutes);

// plan catalogue — powers the Workout.jsx grid
app.use('/api/programs', programRoutes);

// live session tracking — powers WorkoutDetails.jsx start/pause/resume/finish flow
app.use('/api/workouts', workoutRoutes);

// ── error handler (must be last) ──────────────────────────────────────────────

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
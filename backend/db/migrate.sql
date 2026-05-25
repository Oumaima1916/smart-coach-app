-- run this once to initialise the schema
-- psql -U postgres -d smart_coach_db -f backend/db/migrate.sql

CREATE TABLE IF NOT EXISTS exercises (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150)    NOT NULL,
  muscle_group  VARCHAR(100),
  equipment     VARCHAR(100),
  description   TEXT,
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- workout_plans holds the static catalogue shown in Workout.jsx
CREATE TABLE IF NOT EXISTS workout_plans (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(200)  NOT NULL,
  difficulty      VARCHAR(50)   NOT NULL CHECK (difficulty IN ('Beginner','Intermediate','Advanced')),
  duration_min    INTEGER       NOT NULL,
  calories_est    INTEGER       NOT NULL,
  description     TEXT,
  image_url       TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- each row inside a plan maps to one exercise step shown in WorkoutDetails.jsx
CREATE TABLE IF NOT EXISTS workout_plan_exercises (
  id              SERIAL PRIMARY KEY,
  plan_id         INTEGER       NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  exercise_id     INTEGER       REFERENCES exercises(id) ON DELETE SET NULL,
  step_order      INTEGER       NOT NULL,
  name            VARCHAR(150)  NOT NULL,   -- denormalised for quick reads
  duration_label  VARCHAR(50),              -- "5 min", "3 sets"
  sets_label      VARCHAR(100)
);

-- one row per "Start Workout" press — the heart of session tracking
CREATE TABLE IF NOT EXISTS workout_logs (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER,            -- nullable until auth is wired up
  plan_id               INTEGER             REFERENCES workout_plans(id) ON DELETE SET NULL,
  plan_title            VARCHAR(200),       -- snapshot so log survives plan edits
  status                VARCHAR(20)   NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active','paused','completed','abandoned')),
  started_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  ended_at              TIMESTAMPTZ,
  -- every pause writes a row in workout_pause_events; we cache the sum here
  total_paused_seconds  INTEGER       NOT NULL DEFAULT 0,
  active_duration_sec   INTEGER,            -- computed on finish
  calories_burned       INTEGER,            -- computed on finish
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- append-only log of every pause/resume so the maths is auditable
CREATE TABLE IF NOT EXISTS workout_pause_events (
  id          SERIAL PRIMARY KEY,
  log_id      INTEGER       NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,
  paused_at   TIMESTAMPTZ   NOT NULL,
  resumed_at  TIMESTAMPTZ               -- NULL while still paused
);

-- step-level granularity: which exercises the user actually completed
CREATE TABLE IF NOT EXISTS workout_log_exercises (
  id              SERIAL PRIMARY KEY,
  log_id          INTEGER       NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,
  step_order      INTEGER       NOT NULL,
  name            VARCHAR(150)  NOT NULL,
  completed       BOOLEAN       NOT NULL DEFAULT FALSE,
  completed_at    TIMESTAMPTZ
);
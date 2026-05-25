const pool = require('../db/pool');

async function findAll({ difficulty } = {}) {
  const values = [];
  let where = '';

  if (difficulty && difficulty !== 'All') {
    where = 'WHERE difficulty = $1';
    values.push(difficulty);
  }

  const { rows } = await pool.query(
    `SELECT * FROM workout_plans ${where} ORDER BY id ASC`,
    values
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM workout_plans WHERE id = $1',
    [id]
  );
  if (!rows.length) return null;

  // also pull the ordered exercise steps for the detail view
  const { rows: steps } = await pool.query(
    `SELECT * FROM workout_plan_exercises
     WHERE plan_id = $1 ORDER BY step_order ASC`,
    [id]
  );

  return { ...rows[0], exercises: steps };
}

async function create({ title, difficulty, duration_min, calories_est, description, image_url }) {
  const { rows } = await pool.query(
    `INSERT INTO workout_plans
       (title, difficulty, duration_min, calories_est, description, image_url)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, difficulty, duration_min, calories_est, description ?? null, image_url ?? null]
  );
  return rows[0];
}

async function addStep(planId, { step_order, name, duration_label, sets_label, exercise_id }) {
  const { rows } = await pool.query(
    `INSERT INTO workout_plan_exercises
       (plan_id, step_order, name, duration_label, sets_label, exercise_id)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [planId, step_order, name, duration_label ?? null, sets_label ?? null, exercise_id ?? null]
  );
  return rows[0];
}

async function remove(id) {
  await pool.query('DELETE FROM workout_plans WHERE id = $1', [id]);
}

module.exports = { findAll, findById, create, addStep, remove };
const pool = require('../db/pool');

// fetch every exercise row (used by plan-builder screens later)
async function findAll() {
  const { rows } = await pool.query(
    'SELECT * FROM exercises ORDER BY name ASC'
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM exercises WHERE id = $1',
    [id]
  );
  return rows[0] ?? null;
}

async function create({ name, muscle_group, equipment, description }) {
  const { rows } = await pool.query(
    `INSERT INTO exercises (name, muscle_group, equipment, description)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, muscle_group ?? null, equipment ?? null, description ?? null]
  );
  return rows[0];
}

async function update(id, fields) {
  const allowed = ['name', 'muscle_group', 'equipment', 'description'];
  const sets = [];
  const values = [];
  let idx = 1;

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = $${idx++}`);
      values.push(fields[key]);
    }
  }

  if (sets.length === 0) return findById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE exercises SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0] ?? null;
}

async function remove(id) {
  await pool.query('DELETE FROM exercises WHERE id = $1', [id]);
}

module.exports = { findAll, findById, create, update, remove };
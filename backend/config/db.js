const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  Object.assign(process.env, dotenv.parse(fs.readFileSync(envPath)));
}

function buildPoolConfig() {
  const rawDatabaseUrl = String(process.env.DATABASE_URL || '').trim().replace(/^\ufeff/, '');

  function assertValidPassword(password) {
    return password && password !== 'PASSWORD';
  }

  if (rawDatabaseUrl) {
    const parsed = new URL(rawDatabaseUrl);
    const password = decodeURIComponent(parsed.password || '');

    if (!assertValidPassword(password)) {
      throw new Error(
        'PostgreSQL password is missing or still set to the placeholder value in DATABASE_URL. ' +
        'Mettez à jour backend/.env avec le vrai mot de passe ou définissez PGPASSWORD.'
      );
    }

    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 5432,
      user: decodeURIComponent(parsed.username),
      password,
      database: parsed.pathname.replace(/^\//, ''),
      max: 10,
      idleTimeoutMillis: 30000,
    };
  }

  return {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'smart_coach_db',
    max: 10,
    idleTimeoutMillis: 30000,
  };
}

const pool = new Pool(buildPoolConfig());

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client:', err.message);
  process.exit(-1);
});

module.exports = pool;
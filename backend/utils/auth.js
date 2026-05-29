const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || process.env.JWT_SECRET || 'smart-coach-dev-secret';
const TOKEN_TTL = process.env.JWT_EXPIRES_IN || '7d';

async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return { hash };
}

async function verifyPassword(password, expectedHash) {
  return bcrypt.compare(password, expectedHash);
}

function signToken(payload) {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_TTL });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch {
    return null;
  }
}

function createResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  createResetToken,
  hashResetToken,
};
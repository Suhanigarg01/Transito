const path = require('path');

// Load .env from the server root regardless of the current working directory
// (so `node src/index.js` and `node index.js` from inside src/ both work).
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  // Fail fast if the DB URL is absent — surfaces misconfig immediately.
  databaseUrl: required('DATABASE_URL'),
};

module.exports = { config };

const { Pool } = require('pg');

// Pool manages a collection of database connections efficiently
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL is required for Neon (cloud Postgres) but not local dev
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

module.exports = pool;

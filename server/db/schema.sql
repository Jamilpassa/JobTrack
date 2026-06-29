-- Run this in your Neon SQL editor to create the tables

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company         VARCHAR(255) NOT NULL,
  role            VARCHAR(255) NOT NULL,
  status          VARCHAR(50)  DEFAULT 'Applied',
  date_applied    DATE,
  salary_range    VARCHAR(100),
  application_url TEXT,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Valid statuses: Applied | Interview Scheduled | Interview Completed | Offer Received | Rejected | Withdrawn

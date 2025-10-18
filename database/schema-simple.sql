-- SEBMC Database Schema for Neon PostgreSQL
-- Run this SQL in the Neon SQL Editor

CREATE TABLE IF NOT EXISTS canvas_data (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL DEFAULT 'default',
  canvas_name VARCHAR(255) NOT NULL DEFAULT 'My Canvas',
  data JSONB NOT NULL,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, canvas_name)
);

CREATE INDEX IF NOT EXISTS idx_user_id ON canvas_data(user_id);
CREATE INDEX IF NOT EXISTS idx_last_modified ON canvas_data(last_modified DESC);

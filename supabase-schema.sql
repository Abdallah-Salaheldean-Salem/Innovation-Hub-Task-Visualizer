-- Run this SQL in your Supabase SQL Editor to create the projects table

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Disable Row Level Security (RLS) for testing, or set up policies as needed
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

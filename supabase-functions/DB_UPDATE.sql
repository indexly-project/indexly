-- Run this in Supabase SQL Editor
-- Add indexly_id column to websites table

ALTER TABLE websites ADD COLUMN IF NOT EXISTS indexly_id TEXT;

-- Update sitemap to include new pages
-- (No DB change needed for pages)

-- Cleanup old rate limits function update
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

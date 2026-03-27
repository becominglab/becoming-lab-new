-- Add LINE user ID to body_profiles for LINE reminder integration
ALTER TABLE body_profiles
  ADD COLUMN IF NOT EXISTS line_user_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS line_remind boolean NOT NULL DEFAULT false;

-- Index for cron query: find users who want reminders and haven't logged today
CREATE INDEX IF NOT EXISTS idx_body_profiles_line_remind
  ON body_profiles (line_remind) WHERE line_remind = true;

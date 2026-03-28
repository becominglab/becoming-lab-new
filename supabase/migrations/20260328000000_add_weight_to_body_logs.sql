-- Add optional weight column to body_logs
ALTER TABLE body_logs ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,2) DEFAULT NULL;

-- Add comment
COMMENT ON COLUMN body_logs.weight_kg IS 'Optional body weight in kg (e.g. 65.50)';

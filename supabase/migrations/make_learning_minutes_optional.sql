-- Make minutes optional in learning_logs table
-- Users can log learning without tracking time

ALTER TABLE learning_logs
  ALTER COLUMN minutes DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS learning_logs_minutes_check;

-- Add new constraint that allows NULL or positive values
ALTER TABLE learning_logs
  ADD CONSTRAINT learning_logs_minutes_check CHECK (minutes IS NULL OR minutes > 0);


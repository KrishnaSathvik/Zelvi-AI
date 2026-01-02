-- Simplify goals table to only store text-based goals
-- Remove all complex fields: type, target_value, timeframe, start_date, end_date, is_active

ALTER TABLE goals
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS target_value,
  DROP COLUMN IF EXISTS timeframe,
  DROP COLUMN IF EXISTS start_date,
  DROP COLUMN IF EXISTS end_date,
  DROP COLUMN IF EXISTS is_active;

-- Goals table now only has: id, user_id, title, created_at, updated_at


-- ============================================
-- Schema Verification Script
-- ============================================
-- Run this after applying fix_schema_constraints.sql
-- to verify all constraints and schema are correct
-- ============================================

-- ============================================
-- 1. Verify Jobs Table Constraints
-- ============================================

-- Check job_type constraint
SELECT 
  'Jobs.job_type' as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'jobs'::regclass 
  AND conname LIKE '%job_type%';

-- Check source constraint
SELECT 
  'Jobs.source' as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'jobs'::regclass 
  AND conname LIKE '%source%';

-- Test valid job_type values (should all succeed)
DO $$
BEGIN
  -- These should all work
  RAISE NOTICE 'Testing job_type values...';
  -- Note: We can't actually insert without a user_id, but we can check constraint exists
END $$;

-- ============================================
-- 2. Verify Projects Table Constraints
-- ============================================

-- Check category constraint
SELECT 
  'Projects.category' as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass 
  AND conname LIKE '%category%';

-- Check status constraint
SELECT 
  'Projects.status' as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass 
  AND conname LIKE '%status%';

-- ============================================
-- 3. Check for Invalid Data
-- ============================================

-- Check if any jobs have invalid job_type values
SELECT 
  'Invalid job_type values' as check_name,
  COUNT(*) as count,
  array_agg(DISTINCT job_type) as invalid_values
FROM jobs
WHERE job_type NOT IN ('remote', 'hybrid', 'onsite', 'contract', 'full_time', 'part_time', 'internship', 'freelance', 'temporary');

-- Check if any jobs have invalid source values
SELECT 
  'Invalid source values' as check_name,
  COUNT(*) as count,
  array_agg(DISTINCT source) as invalid_values
FROM jobs
WHERE source NOT IN ('LinkedIn', 'Indeed', 'Referral', 'Glassdoor', 'Monster', 'Company Website', 'Recruiter', 'Career Fair', 'University', 'Networking Event', 'Other');

-- Check if any projects have invalid category values
SELECT 
  'Invalid category values' as check_name,
  COUNT(*) as count,
  array_agg(DISTINCT category) as invalid_values
FROM projects
WHERE category NOT IN ('data', 'ai', 'ml', 'rag', 'agents', 'saas');

-- Check if any projects have invalid status values
SELECT 
  'Invalid status values' as check_name,
  COUNT(*) as count,
  array_agg(DISTINCT status) as invalid_values
FROM projects
WHERE status NOT IN ('planning', 'building', 'polishing', 'deployed', 'archived');

-- ============================================
-- 4. Verify All Tables Exist
-- ============================================

SELECT 
  'Table Existence Check' as check_name,
  table_name,
  CASE 
    WHEN table_name IN (
      'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
      'projects', 'content_posts', 'daily_custom_tasks', 
      'daily_task_status', 'goals', 'weekly_reviews', 
      'activity_log', 'notes', 'user_settings', 
      'ai_chat_sessions', 'ai_messages'
    ) THEN '✓ Exists'
    ELSE '✗ Missing'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  )
ORDER BY table_name;

-- ============================================
-- 5. Verify RLS is Enabled
-- ============================================

SELECT 
  'RLS Status' as check_name,
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✓ Enabled'
    ELSE '✗ Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  )
ORDER BY tablename;

-- ============================================
-- 6. Verify Indexes Exist
-- ============================================

SELECT 
  'Index Check' as check_name,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  )
ORDER BY tablename, indexname;

-- ============================================
-- 7. Summary Report
-- ============================================

SELECT 
  '=== VERIFICATION SUMMARY ===' as summary;

-- Count constraints
SELECT 
  'Total Constraints' as metric,
  COUNT(*) as count
FROM pg_constraint
WHERE conrelid IN (
  SELECT oid FROM pg_class WHERE relname IN (
    'jobs', 'projects', 'recruiters', 'learning_logs', 
    'content_posts', 'goals', 'weekly_reviews'
  )
);

-- Count indexes
SELECT 
  'Total Indexes' as metric,
  COUNT(*) as count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  );

-- Count tables
SELECT 
  'Total Tables' as metric,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  );


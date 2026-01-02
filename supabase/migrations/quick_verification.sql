-- ============================================
-- Quick Schema Verification Script
-- ============================================
-- Run this in Supabase SQL Editor to verify:
-- 1. All constraints are correct
-- 2. RLS is enabled on all tables
-- 3. All indexes exist
-- ============================================

-- ============================================
-- 1. VERIFY CONSTRAINTS
-- ============================================

-- Check Jobs table constraints
SELECT 
  'Jobs Constraints' as check_type,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'jobs'::regclass 
  AND (conname LIKE '%job_type%' OR conname LIKE '%source%' OR conname LIKE '%status%')
ORDER BY conname;

-- Check Projects table constraints
SELECT 
  'Projects Constraints' as check_type,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass 
  AND (conname LIKE '%category%' OR conname LIKE '%status%' OR conname LIKE '%priority%')
ORDER BY conname;

-- Check Recruiters table constraints
SELECT 
  'Recruiters Constraints' as check_type,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'recruiters'::regclass 
  AND (conname LIKE '%platform%' OR conname LIKE '%status%')
ORDER BY conname;

-- Check Learning Logs constraints
SELECT 
  'Learning Logs Constraints' as check_type,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'learning_logs'::regclass 
  AND conname LIKE '%category%'
ORDER BY conname;

-- Check Content Posts constraints
SELECT 
  'Content Posts Constraints' as check_type,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'content_posts'::regclass 
  AND (conname LIKE '%platform%' OR conname LIKE '%content_type%' OR conname LIKE '%status%')
ORDER BY conname;

-- Check Weekly Reviews constraints
SELECT 
  'Weekly Reviews Constraints' as check_type,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'weekly_reviews'::regclass 
  AND (conname LIKE '%week%' OR conname LIKE '%user_id%')
ORDER BY conname;

-- Check User Settings constraints
SELECT 
  'User Settings Constraints' as check_type,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'user_settings'::regclass 
  AND conname LIKE '%week_start%'
ORDER BY conname;

-- ============================================
-- 2. VERIFY RLS STATUS
-- ============================================

SELECT 
  'RLS Status' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
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

-- Count RLS policies per table
SELECT 
  'RLS Policies Count' as check_type,
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  )
GROUP BY schemaname, tablename
ORDER BY tablename;

-- ============================================
-- 3. VERIFY INDEXES
-- ============================================

SELECT 
  'Indexes' as check_type,
  tablename,
  indexname,
  CASE 
    WHEN indexdef LIKE '%user_id%' THEN 'User ID Index'
    WHEN indexdef LIKE '%status%' THEN 'Status Index'
    WHEN indexdef LIKE '%date%' THEN 'Date Index'
    WHEN indexdef LIKE '%category%' THEN 'Category Index'
    ELSE 'Other Index'
  END as index_type,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  )
ORDER BY tablename, indexname;

-- Count indexes per table
SELECT 
  'Index Count' as check_type,
  tablename,
  COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  )
GROUP BY tablename
ORDER BY tablename;

-- ============================================
-- 4. VERIFY TRIGGERS
-- ============================================

SELECT 
  'Triggers' as check_type,
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  pg_get_triggerdef(oid) as definition
FROM pg_trigger
WHERE tgrelid IN (
  SELECT oid FROM pg_class WHERE relname IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'goals', 'weekly_reviews', 'notes', 'user_settings'
  )
)
AND tgisinternal = false
ORDER BY tgrelid::regclass, tgname;

-- ============================================
-- 5. SUMMARY REPORT
-- ============================================

SELECT '=== VERIFICATION SUMMARY ===' as summary;

-- Total constraints
SELECT 
  'Total Constraints' as metric,
  COUNT(*) as count
FROM pg_constraint
WHERE conrelid IN (
  SELECT oid FROM pg_class WHERE relname IN (
    'jobs', 'projects', 'recruiters', 'learning_logs', 
    'content_posts', 'goals', 'weekly_reviews', 'user_settings'
  )
);

-- Total indexes
SELECT 
  'Total Indexes' as metric,
  COUNT(*) as count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  );

-- Total RLS policies
SELECT 
  'Total RLS Policies' as metric,
  COUNT(*) as count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  );

-- Total triggers
SELECT 
  'Total Triggers' as metric,
  COUNT(*) as count
FROM pg_trigger
WHERE tgrelid IN (
  SELECT oid FROM pg_class WHERE relname IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'goals', 'weekly_reviews', 'notes', 'user_settings'
  )
)
AND tgisinternal = false;

-- Tables with RLS disabled (should be 0)
SELECT 
  'Tables with RLS Disabled' as metric,
  COUNT(*) as count
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  )
  AND NOT rowsecurity;

-- ============================================
-- 6. EXPECTED VALUES CHECK
-- ============================================

-- Expected constraint values for jobs.job_type
SELECT 
  'Expected: jobs.job_type values' as check_type,
  'remote, hybrid, onsite, contract, full_time' as expected_values,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conrelid = 'jobs'::regclass 
      AND conname LIKE '%job_type%'
      AND pg_get_constraintdef(oid) LIKE '%remote%'
      AND pg_get_constraintdef(oid) LIKE '%hybrid%'
    ) THEN '✅ Found'
    ELSE '❌ Missing'
  END as status;

-- Expected constraint values for projects.category
SELECT 
  'Expected: projects.category values' as check_type,
  'de, ai, genai, rag, product, other' as expected_values,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conrelid = 'projects'::regclass 
      AND conname LIKE '%category%'
    ) THEN '✅ Found'
    ELSE '❌ Missing'
  END as status;

-- Check if goals table has correct structure (no is_active, no type)
SELECT 
  'Expected: goals table structure' as check_type,
  'id, user_id, title, created_at, updated_at only' as expected_structure,
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'goals' 
      AND column_name IN ('is_active', 'type', 'target_value', 'timeframe')
    ) THEN '✅ Correct (simplified)'
    ELSE '❌ Has extra columns'
  END as status;

-- Check if learning_logs.minutes is nullable
SELECT 
  'Expected: learning_logs.minutes nullable' as check_type,
  'minutes should be nullable' as expected,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'learning_logs' 
      AND column_name = 'minutes'
      AND is_nullable = 'YES'
    ) THEN '✅ Nullable'
    ELSE '❌ Not nullable'
  END as status;


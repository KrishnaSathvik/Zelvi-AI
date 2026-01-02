-- ============================================
-- Step-by-Step Verification
-- ============================================
-- Run each section separately to see all results
-- ============================================

-- ============================================
-- STEP 1: Run this first - CONSTRAINTS
-- ============================================

SELECT 
  'Jobs.job_type' as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'jobs'::regclass AND conname LIKE '%job_type%'

UNION ALL

SELECT 
  'Jobs.source',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'jobs'::regclass AND conname LIKE '%source%'

UNION ALL

SELECT 
  'Jobs.status',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'jobs'::regclass AND conname LIKE '%status%'

UNION ALL

SELECT 
  'Projects.category',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass AND conname LIKE '%category%'

UNION ALL

SELECT 
  'Projects.status',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass AND conname LIKE '%status%'

UNION ALL

SELECT 
  'Projects.priority',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass AND conname LIKE '%priority%'

UNION ALL

SELECT 
  'Recruiters.platform',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'recruiters'::regclass AND conname LIKE '%platform%'

UNION ALL

SELECT 
  'Recruiters.status',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'recruiters'::regclass AND conname LIKE '%status%'

UNION ALL

SELECT 
  'Learning Logs.category',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'learning_logs'::regclass AND conname LIKE '%category%'

UNION ALL

SELECT 
  'Content Posts.platform',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'content_posts'::regclass AND conname LIKE '%platform%'

UNION ALL

SELECT 
  'Content Posts.content_type',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'content_posts'::regclass AND conname LIKE '%content_type%'

UNION ALL

SELECT 
  'Content Posts.status',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'content_posts'::regclass AND conname LIKE '%status%'

UNION ALL

SELECT 
  'Weekly Reviews.unique',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'weekly_reviews'::regclass AND (conname LIKE '%week%' OR conname LIKE '%user_id%')

UNION ALL

SELECT 
  'User Settings.week_start',
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'user_settings'::regclass AND conname LIKE '%week_start%';

-- ============================================
-- STEP 2: Run this second - RLS STATUS
-- ============================================

SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = t.tablename) as policy_count
FROM pg_tables t
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
-- STEP 3: Run this third - INDEXES
-- ============================================

SELECT 
  tablename,
  indexname,
  CASE 
    WHEN indexdef LIKE '%user_id%' THEN 'User ID'
    WHEN indexdef LIKE '%status%' THEN 'Status'
    WHEN indexdef LIKE '%date%' THEN 'Date'
    WHEN indexdef LIKE '%category%' THEN 'Category'
    ELSE 'Other'
  END as index_type
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

-- ============================================
-- STEP 4: Run this fourth - INDEX COUNT
-- ============================================

SELECT 
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
-- STEP 5: Run this fifth - TRIGGERS
-- ============================================

SELECT 
  tgrelid::regclass as table_name,
  tgname as trigger_name
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
-- STEP 6: Run this sixth - SUMMARY
-- ============================================

SELECT 
  'Total Constraints' as metric,
  COUNT(*)::text as count
FROM pg_constraint
WHERE conrelid IN (
  SELECT oid FROM pg_class WHERE relname IN (
    'jobs', 'projects', 'recruiters', 'learning_logs', 
    'content_posts', 'goals', 'weekly_reviews', 'user_settings'
  )
)

UNION ALL

SELECT 
  'Total Indexes',
  COUNT(*)::text
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  )

UNION ALL

SELECT 
  'Total RLS Policies',
  COUNT(*)::text
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'daily_task_status', 'goals', 'weekly_reviews', 
    'activity_log', 'notes', 'user_settings', 
    'ai_chat_sessions', 'ai_messages'
  )

UNION ALL

SELECT 
  'Total Triggers',
  COUNT(*)::text
FROM pg_trigger
WHERE tgrelid IN (
  SELECT oid FROM pg_class WHERE relname IN (
    'user_profiles', 'jobs', 'recruiters', 'learning_logs', 
    'projects', 'content_posts', 'daily_custom_tasks', 
    'goals', 'weekly_reviews', 'notes', 'user_settings'
  )
)
AND tgisinternal = false

UNION ALL

SELECT 
  'Tables with RLS Disabled',
  COUNT(*)::text
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
-- STEP 7: Run this seventh - EXPECTED VALUES
-- ============================================

SELECT 
  'Goals table structure' as check_item,
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'goals' 
      AND column_name IN ('is_active', 'type', 'target_value', 'timeframe')
    ) THEN '✅ Correct (simplified)'
    ELSE '❌ Has extra columns'
  END as status

UNION ALL

SELECT 
  'Learning logs minutes nullable',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'learning_logs' 
      AND column_name = 'minutes'
      AND is_nullable = 'YES'
    ) THEN '✅ Nullable'
    ELSE '❌ Not nullable'
  END;


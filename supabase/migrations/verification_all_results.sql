-- ============================================
-- Complete Verification - All Results Combined
-- ============================================
-- This version combines all checks into UNION queries
-- so you see ALL results in one output
-- ============================================

-- ============================================
-- 1. ALL CONSTRAINTS (Combined)
-- ============================================

SELECT 
  'CONSTRAINTS' as section,
  'Jobs.job_type' as check_item,
  conname as name,
  pg_get_constraintdef(oid) as details
FROM pg_constraint 
WHERE conrelid = 'jobs'::regclass AND conname LIKE '%job_type%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Jobs.source',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'jobs'::regclass AND conname LIKE '%source%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Jobs.status',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'jobs'::regclass AND conname LIKE '%status%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Projects.category',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass AND conname LIKE '%category%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Projects.status',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass AND conname LIKE '%status%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Projects.priority',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass AND conname LIKE '%priority%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Recruiters.platform',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'recruiters'::regclass AND conname LIKE '%platform%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Recruiters.status',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'recruiters'::regclass AND conname LIKE '%status%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Learning Logs.category',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'learning_logs'::regclass AND conname LIKE '%category%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Content Posts.platform',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'content_posts'::regclass AND conname LIKE '%platform%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Content Posts.content_type',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'content_posts'::regclass AND conname LIKE '%content_type%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Content Posts.status',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'content_posts'::regclass AND conname LIKE '%status%'

UNION ALL

SELECT 
  'CONSTRAINTS',
  'Weekly Reviews.unique',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'weekly_reviews'::regclass AND (conname LIKE '%week%' OR conname LIKE '%user_id%')

UNION ALL

SELECT 
  'CONSTRAINTS',
  'User Settings.week_start',
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint 
WHERE conrelid = 'user_settings'::regclass AND conname LIKE '%week_start%'

ORDER BY section, check_item;

-- ============================================
-- 2. RLS STATUS (All Tables)
-- ============================================

SELECT 
  'RLS STATUS' as section,
  tablename as check_item,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as status,
  NULL::text as details
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
-- 3. RLS POLICIES COUNT
-- ============================================

SELECT 
  'RLS POLICIES' as section,
  tablename as check_item,
  COUNT(*)::text || ' policies' as status,
  NULL::text as details
FROM pg_policies
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
-- 4. INDEXES (All Tables)
-- ============================================

SELECT 
  'INDEXES' as section,
  tablename || '.' || indexname as check_item,
  CASE 
    WHEN indexdef LIKE '%user_id%' THEN 'User ID Index'
    WHEN indexdef LIKE '%status%' THEN 'Status Index'
    WHEN indexdef LIKE '%date%' THEN 'Date Index'
    WHEN indexdef LIKE '%category%' THEN 'Category Index'
    ELSE 'Other Index'
  END as status,
  indexdef as details
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
-- 5. INDEX COUNT PER TABLE
-- ============================================

SELECT 
  'INDEX COUNT' as section,
  tablename as check_item,
  COUNT(*)::text || ' indexes' as status,
  NULL::text as details
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
-- 6. TRIGGERS
-- ============================================

SELECT 
  'TRIGGERS' as section,
  tgrelid::regclass::text || '.' || tgname as check_item,
  'updated_at trigger' as status,
  pg_get_triggerdef(oid) as details
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
-- 7. SUMMARY METRICS
-- ============================================

SELECT 
  'SUMMARY' as section,
  'Total Constraints' as check_item,
  COUNT(*)::text as status,
  NULL::text as details
FROM pg_constraint
WHERE conrelid IN (
  SELECT oid FROM pg_class WHERE relname IN (
    'jobs', 'projects', 'recruiters', 'learning_logs', 
    'content_posts', 'goals', 'weekly_reviews', 'user_settings'
  )
)

UNION ALL

SELECT 
  'SUMMARY',
  'Total Indexes',
  COUNT(*)::text,
  NULL
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
  'SUMMARY',
  'Total RLS Policies',
  COUNT(*)::text,
  NULL
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
  'SUMMARY',
  'Total Triggers',
  COUNT(*)::text,
  NULL
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
  'SUMMARY',
  'Tables with RLS Disabled',
  COUNT(*)::text,
  CASE WHEN COUNT(*) = 0 THEN '✅ All enabled' ELSE '❌ Some disabled' END
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
-- 8. EXPECTED VALUES CHECKS
-- ============================================

SELECT 
  'EXPECTED VALUES' as section,
  'Goals table structure' as check_item,
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'goals' 
      AND column_name IN ('is_active', 'type', 'target_value', 'timeframe')
    ) THEN '✅ Correct (simplified)'
    ELSE '❌ Has extra columns'
  END as status,
  'Should only have: id, user_id, title, created_at, updated_at' as details

UNION ALL

SELECT 
  'EXPECTED VALUES',
  'Learning logs minutes nullable',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'learning_logs' 
      AND column_name = 'minutes'
      AND is_nullable = 'YES'
    ) THEN '✅ Nullable'
    ELSE '❌ Not nullable'
  END,
  'minutes column should be nullable';


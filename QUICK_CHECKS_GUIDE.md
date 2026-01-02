# 🎯 Quick Verification Checks

Run these queries in **Supabase SQL Editor** (one at a time or all together):

---

## 1️⃣ **Check Constraints** (Lines 14-82)

Run this to verify all CHECK constraints:

```sql
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
```

**Expected:** Each query should return constraint definitions.

---

## 2️⃣ **Check RLS Status** (Lines 88-120)

Run this to verify Row Level Security:

```sql
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
```

**Expected:** All 15 tables should show "✅ Enabled" and have 2-5 policies each.

---

## 3️⃣ **Check Indexes** (Lines 126-160)

Run this to verify all indexes:

```sql
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
```

**Expected:** ~45 indexes total. Goals table should have only 1 index (user_id).

---

## 4️⃣ **Check Triggers** (Lines 166-180)

Run this to verify updated_at triggers:

```sql
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
```

**Expected:** 11 triggers (one for each table with updated_at column).

---

## 5️⃣ **Check Goals Table Structure** (Lines 250-260)

Run this to verify goals table is simplified:

```sql
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
```

**Expected:** "✅ Correct (simplified)"

---

## 🚀 **EASIEST WAY: Run Everything at Once**

Just copy and paste the **entire** `quick_verification.sql` file into Supabase SQL Editor and run it. It will show all results in one go!

**Location:** `supabase/migrations/quick_verification.sql`

---

## 📍 **Where to Run**

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Paste the queries above (or the entire file)
5. Click **"Run"** (or press Cmd/Ctrl + Enter)

---

## ✅ **Quick Summary Check**

Run this single query to see everything at once:

```sql
-- Summary Report
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
```

**Expected Results:**
- Total Constraints: ~15-20
- Total Indexes: ~45
- Total RLS Policies: ~55-60
- Total Triggers: 11
- Tables with RLS Disabled: **0** ✅


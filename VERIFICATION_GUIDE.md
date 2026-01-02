# 🔍 Database Verification Guide

## Quick Start

Run `supabase/migrations/quick_verification.sql` in your Supabase SQL Editor to verify:
1. ✅ Constraints (data integrity)
2. ✅ RLS Status (security)
3. ✅ Indexes (performance)
4. ✅ Triggers (auto-updates)

---

## 📋 What to Check in Results

### 1. Constraints Verification ✅

**What it checks:**
- `jobs.job_type` should allow: `remote`, `hybrid`, `onsite`, `contract`, `full_time`
- `jobs.source` should allow: `LinkedIn`, `Indeed`, `Referral`, `Vendor`, `Other`
- `projects.category` should allow: `de`, `ai`, `genai`, `rag`, `product`, `other`
- `projects.status` should allow: `planning`, `building`, `polishing`, `done`, `archived`
- `recruiters.platform` should allow: `LinkedIn`, `Email`, `WhatsApp`, `Other`
- `recruiters.status` should allow: `messaged`, `replied`, `call`, `submitted`, `ghosted`
- `learning_logs.category` should allow: `de`, `ai_ml`, `genai`, `rag`, `system_design`, `interview`, `other`
- `content_posts.platform` should allow: `instagram`, `youtube`, `linkedin`, `medium`, `pinterest`, `other`
- `content_posts.content_type` should allow: `post`, `reel`, `short`, `story`, `article`, `pin`
- `content_posts.status` should allow: `idea`, `draft`, `assets_ready`, `scheduled`, `published`
- `weekly_reviews` should have unique constraint on `(user_id, week_start)`
- `user_settings.week_start` should allow: `monday`, `sunday`

**Expected Result:**
- Each table should show constraint definitions
- All constraints should be present

**If issues found:**
- Run `supabase/migrations/fix_schema_constraints.sql` to update constraints

---

### 2. RLS Status Verification 🔒

**What it checks:**
- Row Level Security (RLS) is enabled on all 15 tables
- Each table has RLS policies for SELECT, INSERT, UPDATE, DELETE

**Expected Result:**
```
RLS Status: ✅ Enabled (for all 15 tables)
Policy Count: 3-5 policies per table (depending on table)
```

**Minimum policies per table:**
- `user_profiles`: 3 policies (SELECT, INSERT, UPDATE)
- `jobs`: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- `recruiters`: 4 policies
- `learning_logs`: 4 policies
- `projects`: 4 policies
- `content_posts`: 4 policies
- `daily_custom_tasks`: 4 policies
- `daily_task_status`: 4 policies
- `goals`: 4 policies
- `weekly_reviews`: 4 policies
- `activity_log`: 2 policies (SELECT, INSERT only)
- `notes`: 4 policies
- `user_settings`: 3 policies (SELECT, INSERT, UPDATE)
- `ai_chat_sessions`: 3 policies (SELECT, INSERT, DELETE)
- `ai_messages`: 3 policies (SELECT, INSERT, DELETE)

**If issues found:**
- RLS disabled: Run `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`
- Missing policies: Check `supabase/schema.sql` for policy definitions

---

### 3. Indexes Verification ⚡

**What it checks:**
- All performance indexes exist
- User ID indexes on all tables
- Date indexes for time-based queries
- Status indexes for filtering
- Composite indexes for common queries

**Expected Index Count:**
- `user_profiles`: 1 index (user_id)
- `jobs`: 4 indexes (user_id, status, applied_date, user_id+status)
- `recruiters`: 4 indexes (user_id, status, last_contact_date, user_id+status)
- `learning_logs`: 4 indexes (user_id, date, category, user_id+date)
- `projects`: 4 indexes (user_id, status, category, user_id+status)
- `content_posts`: 5 indexes (user_id, date, status, platform, user_id+date)
- `daily_custom_tasks`: 3 indexes (user_id, due_date, user_id+due_date)
- `daily_task_status`: 5 indexes (user_id, task_key, task_date, user_id+date, user_id+key+date)
- `goals`: 1 index (user_id) ⚠️ **Fixed - removed invalid indexes**
- `weekly_reviews`: 3 indexes (user_id, week_start, user_id+week_start)
- `activity_log`: 5 indexes (user_id, event_date, event_type, occurred_at, user_id+date)
- `notes`: 1 index (user_id)
- `user_settings`: 1 index (user_id)
- `ai_chat_sessions`: 1 index (user_id)
- `ai_messages`: 2 indexes (session_id, user_id)

**Total Expected:** ~45 indexes

**If issues found:**
- Missing indexes: Check `supabase/schema.sql` for index definitions
- Invalid indexes: Should be removed (goals table fixed)

---

### 4. Triggers Verification 🔄

**What it checks:**
- `updated_at` triggers exist on tables with `updated_at` column

**Expected Triggers:**
- `update_user_profiles_updated_at`
- `update_jobs_updated_at`
- `update_recruiters_updated_at`
- `update_learning_logs_updated_at`
- `update_projects_updated_at`
- `update_content_posts_updated_at`
- `update_daily_custom_tasks_updated_at`
- `update_goals_updated_at`
- `update_weekly_reviews_updated_at`
- `update_notes_updated_at`
- `update_user_settings_updated_at`

**Total Expected:** 11 triggers

**If issues found:**
- Missing triggers: Check `supabase/schema.sql` for trigger definitions

---

### 5. Summary Report 📊

**What to expect:**
```
Total Constraints: ~15-20 (varies by constraint types)
Total Indexes: ~45
Total RLS Policies: ~55-60
Total Triggers: 11
Tables with RLS Disabled: 0 ✅
```

**If counts are lower:**
- Some objects may be missing
- Check individual sections to identify what's missing

---

### 6. Expected Values Check ✅

**What it checks:**
- Goals table structure is simplified (no `is_active`, `type`, `target_value`, `timeframe`)
- Learning logs minutes column is nullable
- Constraint values match expected

**Expected Results:**
- ✅ Goals table: Correct (simplified)
- ✅ Learning logs minutes: Nullable
- ✅ Constraint values: Found

---

## 🚨 Common Issues & Solutions

### Issue: RLS Disabled on Some Tables
**Solution:**
```sql
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
```

### Issue: Missing Indexes
**Solution:**
Check `supabase/schema.sql` and create missing indexes:
```sql
CREATE INDEX IF NOT EXISTS idx_<table>_<column> ON <table>(<column>);
```

### Issue: Constraint Values Don't Match
**Solution:**
Run `supabase/migrations/fix_schema_constraints.sql` to update constraints.

### Issue: Goals Table Has Extra Columns
**Solution:**
Run `supabase/migrations/simplify_goals_table.sql` to remove extra columns.

### Issue: Learning Logs Minutes Not Nullable
**Solution:**
Run `supabase/migrations/make_learning_minutes_optional.sql` to make it nullable.

---

## ✅ Verification Checklist

After running the script, verify:

- [ ] All 15 tables exist
- [ ] All constraints are present and correct
- [ ] RLS is enabled on all tables (15/15)
- [ ] Each table has appropriate RLS policies (3-5 per table)
- [ ] All indexes exist (~45 total)
- [ ] All triggers exist (11 total)
- [ ] Goals table is simplified (no extra columns)
- [ ] Learning logs minutes is nullable
- [ ] Summary counts match expected values
- [ ] No tables with RLS disabled (0)

---

## 📝 Next Steps

Once verification passes:

1. ✅ **Test Application**
   - Sign up/Sign in
   - Create jobs, recruiters, learning logs
   - Test all CRUD operations

2. ✅ **Check Application Logs**
   - No RLS policy violations
   - No constraint violations
   - No missing table errors

3. ✅ **Performance Check**
   - Queries should be fast (indexes working)
   - No slow queries in Supabase dashboard

4. ✅ **Security Check**
   - Users can only access their own data
   - RLS policies are working

---

## 🎯 Success Criteria

Your database is properly configured when:

✅ All verification queries return expected results  
✅ No errors in application logs  
✅ All features work correctly  
✅ Users can only access their own data  
✅ Queries perform well (indexes working)

---

**Need Help?** Check `supabase/schema.sql` for reference definitions.


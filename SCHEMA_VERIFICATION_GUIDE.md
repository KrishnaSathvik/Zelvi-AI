# Schema Verification Guide

## Quick Verification Steps

### Step 1: Run the Migration
1. Open Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/fix_schema_constraints.sql`
3. Confirm all 4 ALTER TABLE statements executed successfully

### Step 2: Run Verification Script
1. In SQL Editor, run `supabase/migrations/verify_schema.sql`
2. Check the results:

**Expected Results:**
- ✅ All constraints show correct CHECK definitions
- ✅ "Invalid values" queries return `count: 0` (no invalid data)
- ✅ All 15 tables show "✓ Exists"
- ✅ All tables show "✓ Enabled" for RLS
- ✅ Indexes are present for all tables

### Step 3: Manual Application Testing

Test in your application:

#### Jobs Table
- [ ] Create job with `job_type: 'part_time'` → Should succeed
- [ ] Create job with `job_type: 'internship'` → Should succeed
- [ ] Create job with `source: 'Glassdoor'` → Should succeed
- [ ] Create job with `source: 'Company Website'` → Should succeed

#### Projects Table
- [ ] Create project with `category: 'data'` → Should succeed
- [ ] Create project with `category: 'ml'` → Should succeed
- [ ] Create project with `category: 'agents'` → Should succeed
- [ ] Create project with `category: 'saas'` → Should succeed
- [ ] Create project with `status: 'deployed'` → Should succeed

### Step 4: Check for Errors

If you see invalid data in Step 2:
1. **For Jobs table:** Update invalid `job_type` or `source` values to valid ones
2. **For Projects table:** Update invalid `category` or `status` values to valid ones

Example fix for old data:
```sql
-- Update old project categories
UPDATE projects SET category = 'data' WHERE category = 'de';
UPDATE projects SET category = 'ml' WHERE category = 'genai';
UPDATE projects SET category = 'agents' WHERE category = 'product';

-- Update old project status
UPDATE projects SET status = 'deployed' WHERE status = 'done';
```

## Quick Verification Query

Run this single query to see all constraint definitions:

```sql
SELECT 
  t.relname as table_name,
  c.conname as constraint_name,
  pg_get_constraintdef(c.oid) as definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
WHERE t.relname IN ('jobs', 'projects')
  AND c.contype = 'c'  -- CHECK constraints only
ORDER BY t.relname, c.conname;
```

## Success Indicators

✅ **Everything is perfect if:**
- All constraints show correct values in verification script
- No invalid data found (count = 0)
- Application can create/update records with all new values
- No constraint violation errors in application logs

❌ **If you see errors:**
- Check which constraint is failing
- Verify the constraint definition matches expected values
- Check if existing data violates new constraints
- Update invalid data or adjust constraints accordingly


-- ============================================
-- Database Schema Migration - Fix Constraints
-- ============================================
-- This migration fixes constraint mismatches between schema and application
-- Run this script in your Supabase SQL editor or via migration tool
-- ============================================

-- 1. Update Jobs table - job_type constraint
-- Add missing job types: part_time, internship, freelance, temporary
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_job_type_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_job_type_check 
  CHECK (job_type IN ('remote', 'hybrid', 'onsite', 'contract', 'full_time', 'part_time', 'internship', 'freelance', 'temporary'));

-- 2. Update Jobs table - source constraint
-- Replace with correct sources (remove 'Vendor', add 6 new sources)
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_source_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_source_check 
  CHECK (source IN ('LinkedIn', 'Indeed', 'Referral', 'Glassdoor', 'Monster', 'Company Website', 'Recruiter', 'Career Fair', 'University', 'Networking Event', 'Other'));

-- 3. Update Projects table - category constraint
-- Replace with correct categories: de->data, genai->ml, product->agents, add saas
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;
ALTER TABLE projects ADD CONSTRAINT projects_category_check 
  CHECK (category IN ('data', 'ai', 'ml', 'rag', 'agents', 'saas'));

-- 4. Update Projects table - status constraint
-- Replace 'done' with 'deployed', optionally keep 'archived' for historical data
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('planning', 'building', 'polishing', 'deployed', 'archived'));

-- ============================================
-- Verification Queries (run after migration)
-- ============================================
-- Uncomment to verify constraints:

-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'jobs'::regclass AND conname LIKE '%job_type%';

-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'jobs'::regclass AND conname LIKE '%source%';

-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'projects'::regclass AND conname LIKE '%category%';

-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'projects'::regclass AND conname LIKE '%status%';


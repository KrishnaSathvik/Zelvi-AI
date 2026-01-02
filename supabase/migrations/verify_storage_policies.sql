-- ============================================
-- Storage Policies Verification
-- ============================================
-- This script verifies that storage buckets and policies
-- are correctly configured for file uploads
-- ============================================

-- ============================================
-- 1. CHECK IF RESUMES BUCKET EXISTS
-- ============================================

SELECT 
  'Storage Bucket Check' as check_type,
  name as bucket_name,
  CASE 
    WHEN name = 'resumes' THEN '✅ Found'
    ELSE '❌ Missing'
  END as status,
  CASE 
    WHEN public THEN 'Public'
    ELSE 'Private'
  END as visibility,
  created_at
FROM storage.buckets
WHERE name = 'resumes';

-- ============================================
-- 2. CHECK STORAGE POLICIES FOR RESUMES BUCKET
-- ============================================
-- Note: Storage policies are stored in pg_policies with schemaname = 'storage'
-- Policies reference the bucket in their definition (qual or with_check)

SELECT 
  'Storage Policies' as check_type,
  policyname as policy_name,
  cmd as operation,
  CASE 
    WHEN cmd = 'INSERT' THEN 'INSERT (Upload)'
    WHEN cmd = 'SELECT' THEN 'SELECT (View/Download)'
    WHEN cmd = 'DELETE' THEN 'DELETE (Remove)'
    WHEN cmd = 'UPDATE' THEN 'UPDATE (Modify)'
    ELSE cmd
  END as operation_type,
  COALESCE(qual, with_check) as policy_definition
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname ILIKE '%resume%' 
    OR qual ILIKE '%resumes%'
    OR with_check ILIKE '%resumes%'
  )
ORDER BY 
  CASE cmd
    WHEN 'INSERT' THEN 1
    WHEN 'SELECT' THEN 2
    WHEN 'DELETE' THEN 3
    WHEN 'UPDATE' THEN 4
    ELSE 5
  END,
  policyname;

-- ============================================
-- 3. COUNT POLICIES PER OPERATION
-- ============================================

SELECT 
  'Policy Count by Operation' as check_type,
  cmd as operation,
  CASE 
    WHEN cmd = 'INSERT' THEN 'INSERT (Upload)'
    WHEN cmd = 'SELECT' THEN 'SELECT (View/Download)'
    WHEN cmd = 'DELETE' THEN 'DELETE (Remove)'
    WHEN cmd = 'UPDATE' THEN 'UPDATE (Modify)'
    ELSE cmd
  END as operation_name,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname ILIKE '%resume%' 
    OR qual ILIKE '%resumes%'
    OR with_check ILIKE '%resumes%'
  )
GROUP BY cmd
ORDER BY 
  CASE cmd
    WHEN 'INSERT' THEN 1
    WHEN 'SELECT' THEN 2
    WHEN 'DELETE' THEN 3
    WHEN 'UPDATE' THEN 4
    ELSE 5
  END;

-- ============================================
-- 4. VERIFY POLICY DEFINITIONS
-- ============================================

-- Check if policies use correct user_id validation
SELECT 
  'Policy Definition Check' as check_type,
  policyname as policy_name,
  cmd as operation,
  CASE 
    WHEN COALESCE(qual, with_check, '') LIKE '%auth.uid()%' OR COALESCE(qual, with_check, '') LIKE '%auth.uid%' THEN '✅ Uses auth.uid()'
    WHEN COALESCE(qual, with_check, '') LIKE '%storage.foldername%' OR COALESCE(qual, with_check, '') LIKE '%foldername%' THEN '✅ Uses folder structure'
    WHEN COALESCE(qual, with_check, '') LIKE '%bucket_id%' AND COALESCE(qual, with_check, '') LIKE '%resumes%' THEN '✅ Checks bucket'
    ELSE '⚠️ Check definition'
  END as validation_method,
  COALESCE(qual, with_check) as policy_definition
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname ILIKE '%resume%' 
    OR qual ILIKE '%resumes%'
    OR with_check ILIKE '%resumes%'
  )
ORDER BY policyname;

-- ============================================
-- 5. SUMMARY
-- ============================================

SELECT 
  '=== STORAGE VERIFICATION SUMMARY ===' as summary;

-- Total buckets
SELECT 
  'Total Storage Buckets' as metric,
  COUNT(*)::text as count
FROM storage.buckets
WHERE name = 'resumes';

-- Total policies for resumes bucket
SELECT 
  'Total Policies for Resumes Bucket' as metric,
  COUNT(*)::text as count
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname ILIKE '%resume%' 
    OR qual ILIKE '%resumes%'
    OR with_check ILIKE '%resumes%'
  );

-- Expected policies
SELECT 
  'Expected Policies' as metric,
  '3 (INSERT, SELECT, DELETE)' as expected,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ Sufficient'
    ELSE '❌ Missing policies'
  END as status
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname ILIKE '%resume%' 
    OR qual ILIKE '%resumes%'
    OR with_check ILIKE '%resumes%'
  );

-- ============================================
-- 6. CHECK JOB_RESUMES TABLE EXISTS
-- ============================================

SELECT 
  'Database Table Check' as check_type,
  table_name,
  CASE 
    WHEN table_name = 'job_resumes' THEN '✅ Exists'
    ELSE '❌ Missing'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'job_resumes';

-- ============================================
-- 7. CHECK JOB_RESUMES RLS POLICIES
-- ============================================

SELECT 
  'Job Resumes RLS Policies' as check_type,
  policyname as policy_name,
  cmd as operation,
  CASE 
    WHEN cmd = 'SELECT' THEN 'View'
    WHEN cmd = 'INSERT' THEN 'Create'
    WHEN cmd = 'UPDATE' THEN 'Update'
    WHEN cmd = 'DELETE' THEN 'Delete'
    ELSE cmd
  END as operation_name
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'job_resumes'
ORDER BY 
  CASE cmd
    WHEN 'SELECT' THEN 1
    WHEN 'INSERT' THEN 2
    WHEN 'UPDATE' THEN 3
    WHEN 'DELETE' THEN 4
    ELSE 5
  END;

-- ============================================
-- 8. EXPECTED SETUP CHECKLIST
-- ============================================

SELECT 
  'Setup Checklist' as check_type,
  'Resumes bucket exists' as requirement,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'resumes') THEN '✅'
    ELSE '❌'
  END as status

UNION ALL

SELECT 
  'Setup Checklist',
  'Resumes bucket is private',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM storage.buckets 
      WHERE name = 'resumes' AND public = false
    ) THEN '✅'
    ELSE '❌'
  END

UNION ALL

SELECT 
  'Setup Checklist',
  'INSERT policy exists',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND cmd = 'INSERT'
      AND (
        policyname ILIKE '%resume%' 
        OR qual ILIKE '%resumes%'
        OR with_check ILIKE '%resumes%'
      )
    ) THEN '✅'
    ELSE '❌'
  END

UNION ALL

SELECT 
  'Setup Checklist',
  'SELECT policy exists',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND cmd = 'SELECT'
      AND (
        policyname ILIKE '%resume%' 
        OR qual ILIKE '%resumes%'
        OR with_check ILIKE '%resumes%'
      )
    ) THEN '✅'
    ELSE '❌'
  END

UNION ALL

SELECT 
  'Setup Checklist',
  'DELETE policy exists',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND cmd = 'DELETE'
      AND (
        policyname ILIKE '%resume%' 
        OR qual ILIKE '%resumes%'
        OR with_check ILIKE '%resumes%'
      )
    ) THEN '✅'
    ELSE '❌'
  END

UNION ALL

SELECT 
  'Setup Checklist',
  'job_resumes table exists',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'job_resumes'
    ) THEN '✅'
    ELSE '❌'
  END

UNION ALL

SELECT 
  'Setup Checklist',
  'job_resumes RLS enabled',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = 'job_resumes' 
      AND rowsecurity = true
    ) THEN '✅'
    ELSE '❌'
  END

ORDER BY requirement;


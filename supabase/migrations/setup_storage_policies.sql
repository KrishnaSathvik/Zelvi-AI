-- ============================================
-- Setup Storage Policies for Resumes Bucket
-- ============================================
-- This script creates the required storage policies
-- for the resumes bucket to allow file uploads
-- ============================================

-- ============================================
-- 1. Verify bucket exists first
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'resumes'
  ) THEN
    RAISE EXCEPTION 'Resumes bucket does not exist. Please create it first in Supabase Dashboard > Storage > New Bucket';
  END IF;
END $$;

-- ============================================
-- 2. Drop existing policies if they exist
-- ============================================

DROP POLICY IF EXISTS "Users can upload own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own resumes" ON storage.objects;

-- ============================================
-- 3. Create INSERT Policy (Upload)
-- ============================================

CREATE POLICY "Users can upload own resumes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes'::text 
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- ============================================
-- 4. Create SELECT Policy (View/Download)
-- ============================================

CREATE POLICY "Users can view own resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes'::text 
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- ============================================
-- 5. Create DELETE Policy (Remove)
-- ============================================

CREATE POLICY "Users can delete own resumes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes'::text 
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- ============================================
-- 6. Verification
-- ============================================

SELECT 
  'Storage Policies Created' as status,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname ILIKE '%resume%' 
    OR qual ILIKE '%resumes%'
    OR with_check ILIKE '%resumes%'
  );

-- List all created policies
SELECT 
  'Created Policy' as info,
  policyname as policy_name,
  cmd as operation
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
    ELSE 4
  END;


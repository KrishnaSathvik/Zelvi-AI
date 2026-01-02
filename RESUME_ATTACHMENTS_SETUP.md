# Resume Attachments Setup Guide

This guide explains how to set up the resume attachments feature for job applications.

## Database Setup

1. **Run the migration** to create the `job_resumes` table:
   - Go to Supabase Dashboard → SQL Editor
   - Open `supabase/migrations/add_job_resumes.sql`
   - Copy and paste the contents
   - Click "Run"

## Storage Bucket Setup ⚠️ **REQUIRED**

**This step is critical! Without it, resume uploads will fail with a 400 error.**

1. **Create the storage bucket**:
   - Go to [Supabase Dashboard](https://app.supabase.com) → Your Project
   - Navigate to **Storage** (left sidebar)
   - Click **"New bucket"** button
   - **Bucket name**: `resumes` (must be exactly this name)
   - **Public bucket**: **UNCHECKED** (make it private)
   - Click **"Create bucket"**

2. **Set up storage policies** (RLS for Storage):
   - Still in Storage, click on the `resumes` bucket
   - Go to the **"Policies"** tab
   - Click **"New Policy"**

   **Policy 1: Upload (INSERT)**
   - Policy name: `Users can upload own resumes`
   - Allowed operation: `INSERT`
   - Policy definition (use "For full customization" option):
     ```sql
     (bucket_id = 'resumes'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
     ```
   - Click **"Review"** then **"Save policy"**

   **Policy 2: View/Download (SELECT)**
   - Click **"New Policy"** again
   - Policy name: `Users can view own resumes`
   - Allowed operation: `SELECT`
   - Policy definition:
     ```sql
     (bucket_id = 'resumes'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
     ```
   - Click **"Review"** then **"Save policy"**

   **Policy 3: Delete (DELETE)**
   - Click **"New Policy"** again
   - Policy name: `Users can delete own resumes`
   - Allowed operation: `DELETE`
   - Policy definition:
     ```sql
     (bucket_id = 'resumes'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])
     ```
   - Click **"Review"** then **"Save policy"**

3. **Verify setup**:
   - You should see 3 policies listed for the `resumes` bucket
   - If you see a 400 error when trying to view/download resumes, the policies aren't set up correctly

## Features

- ✅ Upload multiple PDF resumes per job application
- ✅ View resumes in new tab with browser's native PDF viewer (includes download/print options)
- ✅ Download resumes directly
- ✅ Print resumes
- ✅ Delete resumes
- ✅ Resumes are stored securely in Supabase Storage
- ✅ Multiple resumes with the same name are supported (unique file paths)

## Usage

1. When creating or editing a job, select PDF files in the "Resume Attachments" section
2. After saving the job, resumes will be automatically uploaded
3. View resumes by clicking the eye icon
4. Download or print using the respective buttons
5. Delete resumes using the trash icon


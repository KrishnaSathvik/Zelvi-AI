-- ============================================
-- Job Resumes Table
-- ============================================
-- Stores resume attachments for job applications
-- Multiple resumes can be attached to a single job

CREATE TABLE IF NOT EXISTS job_resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_resumes_job_id ON job_resumes(job_id);
CREATE INDEX IF NOT EXISTS idx_job_resumes_user_id ON job_resumes(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_job_resumes_updated_at
  BEFORE UPDATE ON job_resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE job_resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own job resumes"
  ON job_resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job resumes"
  ON job_resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job resumes"
  ON job_resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job resumes"
  ON job_resumes FOR DELETE
  USING (auth.uid() = user_id);


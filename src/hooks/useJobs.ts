import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { logJobCreated, logJobStatusUpdated } from '../lib/activityLog'
import { trackEvent } from '../lib/analytics'

export interface JobResume {
  id: string
  job_id: string
  user_id: string
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  user_id: string
  role: string
  company: string
  location?: string
  job_type: 'remote' | 'hybrid' | 'onsite' | 'contract' | 'full_time' | 'part_time' | 'internship' | 'freelance' | 'temporary'
  salary_min?: number
  salary_max?: number
  salary_currency?: string
  source: 'LinkedIn' | 'Indeed' | 'Referral' | 'Glassdoor' | 'Monster' | 'Company Website' | 'Recruiter' | 'Career Fair' | 'University' | 'Networking Event' | 'Other'
  status: 'applied' | 'screener' | 'tech' | 'offer' | 'rejected' | 'saved'
  applied_date: string
  job_url?: string
  notes?: string
  created_at: string
  updated_at: string
  resumes?: JobResume[]
}

export interface JobFormData {
  role: string
  company: string
  location?: string
  job_type: Job['job_type']
  salary?: string
  source: Job['source']
  status: Job['status']
  applied_date: string
  job_url?: string
  notes?: string
}

export interface JobFilters {
  status?: Job['status']
  source?: Job['source']
  dateFrom?: string
  dateTo?: string
}

// Helper function to convert salary text to database format
function convertSalaryToDbFormat(salary?: string): {
  salary_min?: number
  salary_max?: number
  salary_currency?: string
} {
  if (!salary || !salary.trim()) {
    return {}
  }

  const trimmed = salary.trim()
  
  // Try to parse patterns like "120000-180000 USD" or "120000 - 180000 USD"
  const rangeMatch = trimmed.match(/^(\d+(?:,\d+)*)\s*-\s*(\d+(?:,\d+)*)\s*(USD|EUR|GBP|INR)?$/i)
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1].replace(/,/g, ''))
    const max = parseInt(rangeMatch[2].replace(/,/g, ''))
    const currency = rangeMatch[3]?.toUpperCase() || 'USD'
    return { salary_min: min, salary_max: max, salary_currency: currency }
  }

  // Try to parse single number with currency like "120000 USD"
  const singleMatch = trimmed.match(/^(\d+(?:,\d+)*)\s*(USD|EUR|GBP|INR)?$/i)
  if (singleMatch) {
    const amount = parseInt(singleMatch[1].replace(/,/g, ''))
    const currency = singleMatch[2]?.toUpperCase() || 'USD'
    return { salary_min: amount, salary_max: amount, salary_currency: currency }
  }

  // If it's just a number, use it as min and max
  const numberMatch = trimmed.match(/^(\d+(?:,\d+)*)$/)
  if (numberMatch) {
    const amount = parseInt(numberMatch[1].replace(/,/g, ''))
    return { salary_min: amount, salary_max: amount, salary_currency: 'USD' }
  }

  // If we can't parse it, return empty (user can put it in notes)
  return {}
}

export function useJobs(userId: string | undefined, filters?: JobFilters) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', userId, filters],
    queryFn: async () => {
      if (!userId) return []
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.source) {
        query = query.eq('source', filters.source)
      }
      if (filters?.dateFrom) {
        query = query.gte('applied_date', filters.dateFrom)
      }
      if (filters?.dateTo) {
        query = query.lte('applied_date', filters.dateTo)
      }

      const { data, error } = await query
        .order('applied_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Fetch resumes for each job
      const jobsWithResumes = await Promise.all(
        (data || []).map(async (job) => {
          const { data: resumes } = await supabase
            .from('job_resumes')
            .select('*')
            .eq('job_id', job.id)
            .order('created_at', { ascending: false })
          
          return {
            ...job,
            resumes: resumes || [],
          } as Job
        })
      )
      
      return jobsWithResumes
    },
    enabled: !!userId,
  })

  const createMutation = useMutation({
    mutationFn: async (formData: JobFormData) => {
      if (!userId) throw new Error('User not authenticated')
      
      // Convert salary text to database format
      const { salary, ...restFormData } = formData
      const salaryFields = convertSalaryToDbFormat(salary)
      
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          user_id: userId,
          ...restFormData,
          ...salaryFields,
        })
        .select()
        .single()

      if (error) throw error

      // Log activity
      await logJobCreated(userId, {
        role: formData.role,
        company: formData.company,
        applied_date: formData.applied_date,
      })

      // Track GA4 event
      trackEvent('job_created', {
        status: formData.status,
        source: formData.source,
      })

      return data as Job
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: JobFormData }) => {
      if (!userId) throw new Error('User not authenticated')
      
      // Check if status changed
      const { data: oldJob } = await supabase
        .from('jobs')
        .select('status')
        .eq('id', id)
        .eq('user_id', userId)
        .single()

      // Convert salary text to database format
      const { salary, ...restFormData } = formData
      const salaryFields = convertSalaryToDbFormat(salary)

      const { data, error } = await supabase
        .from('jobs')
        .update({
          ...restFormData,
          ...salaryFields,
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      // Log status change if it changed
      if (oldJob && oldJob.status !== formData.status) {
        await logJobStatusUpdated(userId, {
          role: formData.role,
          company: formData.company,
          oldStatus: oldJob.status,
          newStatus: formData.status,
        })

        trackEvent('job_status_updated', {
          old_status: oldJob.status,
          new_status: formData.status,
        })
      }

      return data as Job
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated')
      
      // Delete all resumes for this job first
      const { data: resumes } = await supabase
        .from('job_resumes')
        .select('file_path')
        .eq('job_id', id)
        .eq('user_id', userId)
      
      if (resumes) {
        // Delete files from storage
        const filePaths = resumes.map(r => r.file_path)
        await Promise.all(
          filePaths.map(path => 
            supabase.storage.from('resumes').remove([path])
          )
        )
        
        // Delete resume records
        await supabase
          .from('job_resumes')
          .delete()
          .eq('job_id', id)
          .eq('user_id', userId)
      }
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', userId] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary', userId] })
    },
  })

  const uploadResumeMutation = useMutation({
    mutationFn: async ({ jobId, file }: { jobId: string; file: File }) => {
      if (!userId) throw new Error('User not authenticated')
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${jobId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          contentType: file.type || 'application/pdf',
          upsert: false,
        })
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(`Failed to upload resume: ${uploadError.message}. Please ensure the 'resumes' storage bucket exists and policies are configured.`)
      }
      
      // Save resume record
      const { data, error } = await supabase
        .from('job_resumes')
        .insert({
          job_id: jobId,
          user_id: userId,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type || 'application/pdf',
        })
        .select()
        .single()
      
      if (error) {
        // Rollback: delete uploaded file if DB insert fails
        await supabase.storage.from('resumes').remove([fileName])
        throw error
      }
      
      return data as JobResume
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', userId] })
    },
  })

  const deleteResumeMutation = useMutation({
    mutationFn: async ({ resumeId, filePath }: { resumeId: string; filePath: string }) => {
      if (!userId) throw new Error('User not authenticated')
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('resumes')
        .remove([filePath])
      
      if (storageError) throw storageError
      
      // Delete from database
      const { error } = await supabase
        .from('job_resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', userId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', userId] })
    },
  })

  return {
    jobs: data || [],
    isLoading,
    error,
    createJob: createMutation.mutate,
    updateJob: updateMutation.mutate,
    deleteJob: deleteMutation.mutate,
    uploadResume: uploadResumeMutation.mutate,
    uploadResumeAsync: uploadResumeMutation.mutateAsync,
    deleteResume: deleteResumeMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploadingResume: uploadResumeMutation.isPending,
    isDeletingResume: deleteResumeMutation.isPending,
  }
}


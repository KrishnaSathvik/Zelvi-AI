import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useJobs, Job, JobFilters } from '../hooks/useJobs'
import JobForm from '../components/jobs/JobForm'
import JobList from '../components/jobs/JobList'
import JobFiltersComponent from '../components/jobs/JobFilters'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import Icon from '../components/ui/Icon'

export default function Jobs() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<JobFilters>({})
  const {
    jobs,
    isLoading,
    createJob,
    updateJob,
    deleteJob,
    uploadResumeAsync,
    deleteResume,
    isCreating,
    isUpdating,
    isDeleting,
    isUploadingResume,
    isDeletingResume,
  } = useJobs(user?.id, filters)

  const [editingJob, setEditingJob] = useState<Job | undefined>()
  const [showForm, setShowForm] = useState(false)
  const [pendingJobId, setPendingJobId] = useState<string | null>(null)
  const resumeFilesRef = useRef<File[]>([])

  const handleResumeFilesSelected = (files: File[]) => {
    resumeFilesRef.current = files
  }

  const handleSubmit = (formData: Parameters<typeof createJob>[0]) => {
    const filesToUpload = [...resumeFilesRef.current]
    
    if (editingJob) {
      updateJob(
        { id: editingJob.id, formData },
        {
          onSuccess: async (updatedJob) => {
            // Upload resumes if any were selected
            if (filesToUpload.length > 0) {
              setPendingJobId(updatedJob.id)
              try {
                // Upload all files sequentially to ensure they complete
                for (const file of filesToUpload) {
                  await uploadResumeAsync({ jobId: updatedJob.id, file })
                }
              } catch (error) {
                console.error('Error uploading resumes:', error)
                alert('Some resumes failed to upload. Please try uploading them again.')
              } finally {
                resumeFilesRef.current = []
                setPendingJobId(null)
              }
            }
      setEditingJob(undefined)
      setShowForm(false)
          },
        }
      )
    } else {
      createJob(formData, {
        onSuccess: async (newJob) => {
          // Upload resumes if any were selected
          if (filesToUpload.length > 0) {
            setPendingJobId(newJob.id)
            try {
              // Upload all files sequentially to ensure they complete
              for (const file of filesToUpload) {
                await uploadResumeAsync({ jobId: newJob.id, file })
              }
            } catch (error) {
              console.error('Error uploading resumes:', error)
              alert('Some resumes failed to upload. Please try uploading them again.')
            } finally {
              resumeFilesRef.current = []
              setPendingJobId(null)
            }
          }
      setShowForm(false)
        },
      })
    }
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingJob(undefined)
    setShowForm(false)
  }

  const handleAddJob = () => {
    setEditingJob(undefined)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto relative z-10">
          <div className="font-mono text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading...</div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <PageHeader
          title="Jobs"
          description="Track your job applications and manage your job search pipeline"
          count={jobs.length}
          action={
            <button
              onClick={handleAddJob}
              className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth flex items-center gap-2 w-full sm:w-auto theme-text-main theme-border theme-bg-card"
            >
              <Icon name="act-add" size={18} />
              Add job
            </button>
          }
        />

      <div className="space-y-4">
        <JobFiltersComponent filters={filters} onFiltersChange={setFilters} />
      </div>

      {(showForm || editingJob) && (
        <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold font-mono uppercase theme-text-main">
              {editingJob ? 'Edit Job' : 'Add Job'}
            </h2>
          <div className="border-2 p-6 sm:p-8 rounded-sm shadow-card backdrop-blur-modern theme-bg-form theme-border">
            <JobForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={editingJob}
              isLoading={isCreating || isUpdating}
              onResumeFilesSelected={handleResumeFilesSelected}
              isUploadingResumes={isUploadingResume && pendingJobId !== null}
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        <JobList
          jobs={jobs}
          onEdit={handleEdit}
          onDelete={deleteJob}
          isDeleting={isDeleting}
          onDeleteResume={(resumeId, filePath) => deleteResume({ resumeId, filePath })}
          isDeletingResume={isDeletingResume}
        />
      </div>
      </div>
    </PageTransition>
  )
}


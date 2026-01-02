import { Job } from '../../hooks/useJobs'
import { FaMapMarkerAlt, FaDollarSign, FaLink, FaEdit, FaTrash } from 'react-icons/fa'
import ResumeAttachment from './ResumeAttachment'

interface JobListProps {
  jobs: Job[]
  onEdit: (job: Job) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
  onDeleteResume?: (resumeId: string, filePath: string) => void
  isDeletingResume?: boolean
}

const statusLabels: Record<Job['status'], string> = {
  applied: 'Applied',
  screener: 'Screener',
  tech: 'Tech Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  saved: 'Saved',
}

const statusColors: Record<Job['status'], string> = {
  applied: 'bg-blue-500/60 text-white dark:text-white border-blue-600',
  screener: 'bg-yellow-500/60 text-black dark:text-black border-yellow-600',
  tech: 'bg-purple-500/60 text-white dark:text-white border-purple-600',
  offer: 'bg-green-500/60 text-white dark:text-white border-green-600',
  rejected: 'bg-red-500/70 text-white dark:text-white border-red-600',
  saved: 'bg-gray-500/60 text-white dark:text-white border-gray-600',
}

const jobTypeLabels: Record<Job['job_type'], string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
  contract: 'Contract',
  full_time: 'Full-time',
  part_time: 'Part-time',
  internship: 'Internship',
  freelance: 'Freelance',
  temporary: 'Temporary',
}

export default function JobList({ jobs, onEdit, onDelete, isDeleting, onDeleteResume, isDeletingResume }: JobListProps) {
  // Debug: Log jobs with resumes
  if (process.env.NODE_ENV === 'development') {
    jobs.forEach(job => {
      if (job.resumes && job.resumes.length > 0) {
        console.log(`Job ${job.id} has ${job.resumes.length} resume(s):`, job.resumes)
      }
    })
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 font-mono text-xs theme-text-main">
        <p>No jobs found. Add your first job application to get started.</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatSalary = (job: Job) => {
    if (!job.salary_min && !job.salary_max) return null
    const currency = job.salary_currency || 'USD'
    const min = job.salary_min ? new Intl.NumberFormat('en-US').format(job.salary_min) : ''
    const max = job.salary_max ? new Intl.NumberFormat('en-US').format(job.salary_max) : ''
    if (min && max) return `${currency} ${min} - ${max}`
    if (min) return `${currency} ${min}+`
    if (max) return `Up to ${currency} ${max}`
    return null
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="stagger-item border-2 p-3 sm:p-4 hover:border-cyan-400 hover:shadow-card-hover transition-elevation rounded-sm backdrop-blur-modern theme-bg-form theme-border"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-semibold font-mono break-words theme-text-main">
                  {job.role} @ {job.company}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium font-mono border-2 theme-border ${statusColors[job.status]} self-start sm:self-auto`}
                >
                  {statusLabels[job.status]}
                </span>
              </div>

              <div className="text-sm font-mono text-xs space-y-1 theme-text-main">
                {job.location && (
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt size={12} />
                    <span>{job.location} · {jobTypeLabels[job.job_type]} · {job.source}</span>
                  </div>
                )}
                {!job.location && (
                  <div>
                    {jobTypeLabels[job.job_type]} · {job.source}
                  </div>
                )}
                <div>Applied: {formatDate(job.applied_date)}</div>
                {formatSalary(job) && (
                  <div className="flex items-center gap-1">
                    <FaDollarSign size={12} />
                    <span>{formatSalary(job)}</span>
                  </div>
                )}
                {job.notes && (
                  <div className="mt-2 line-clamp-2">{job.notes}</div>
                )}
                {job.resumes && job.resumes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                      Resumes ({job.resumes.length})
                    </div>
                    <div className="space-y-2">
                      {job.resumes.map((resume) => (
                        <ResumeAttachment
                          key={resume.id}
                          resume={resume}
                          onDelete={onDeleteResume || (() => {})}
                          isDeleting={isDeletingResume}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 sm:ml-4 flex-shrink-0">
              {job.job_url && (
                <a
                  href={job.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-sm transition-smooth hover:scale-110"
                  title="Open job URL"
                >
                  <FaLink size={18} />
                </a>
              )}
              <button
                onClick={() => onEdit(job)}
                className="p-2 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-sm transition-smooth hover:scale-110"
                title="Edit"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this job?')) {
                    onDelete(job.id)
                  }
                }}
                disabled={isDeleting}
                className="p-2 hover:text-red-600 hover:bg-red-600/10 rounded-sm transition-smooth hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


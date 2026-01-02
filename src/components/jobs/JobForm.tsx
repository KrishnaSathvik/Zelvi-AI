import { useState, useEffect } from 'react'
import { JobFormData, Job } from '../../hooks/useJobs'
import { FaFilePdf, FaTimes } from 'react-icons/fa'

interface JobFormProps {
  onSubmit: (data: JobFormData) => void
  onCancel?: () => void
  initialData?: Job
  isLoading?: boolean
  onResumeFilesSelected?: (files: File[]) => void
  isUploadingResumes?: boolean
}

const jobTypes: JobFormData['job_type'][] = ['remote', 'hybrid', 'onsite', 'contract', 'full_time', 'part_time', 'internship', 'freelance', 'temporary']
const jobTypeLabels: Record<JobFormData['job_type'], string> = {
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

const sources: JobFormData['source'][] = ['LinkedIn', 'Indeed', 'Referral', 'Glassdoor', 'Monster', 'Company Website', 'Recruiter', 'Career Fair', 'University', 'Networking Event', 'Other']
const statuses: JobFormData['status'][] = ['applied', 'screener', 'tech', 'offer', 'rejected', 'saved']
const statusLabels: Record<JobFormData['status'], string> = {
  applied: 'Applied',
  screener: 'Screener',
  tech: 'Tech Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  saved: 'Saved',
}

export default function JobForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  onResumeFilesSelected,
  isUploadingResumes = false,
}: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    role: '',
    company: '',
    location: '',
    job_type: 'remote',
    salary: '',
    source: 'LinkedIn',
    status: 'applied',
    applied_date: new Date().toISOString().split('T')[0],
    job_url: '',
    notes: '',
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  useEffect(() => {
    if (initialData) {
      // Convert old salary format to new text format if needed
      let salaryText = ''
      if (initialData.salary_min || initialData.salary_max) {
        const parts: string[] = []
        if (initialData.salary_min) parts.push(initialData.salary_min.toString())
        if (initialData.salary_max) parts.push(initialData.salary_max.toString())
        salaryText = parts.join('-')
        if (initialData.salary_currency) {
          salaryText += ` ${initialData.salary_currency}`
        }
      }
      
      setFormData({
        role: initialData.role,
        company: initialData.company,
        location: initialData.location || '',
        job_type: initialData.job_type,
        salary: salaryText,
        source: initialData.source,
        status: initialData.status,
        applied_date: initialData.applied_date,
        job_url: initialData.job_url || '',
        notes: initialData.notes || '',
      })
    }
  }, [initialData])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
    
    if (pdfFiles.length !== files.length) {
      alert('Only PDF files are allowed. Non-PDF files were ignored.')
    }
    
    if (pdfFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...pdfFiles])
      if (onResumeFilesSelected) {
        onResumeFilesSelected([...selectedFiles, ...pdfFiles])
      }
    }
    
    // Reset input
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    if (onResumeFilesSelected) {
      onResumeFilesSelected(newFiles)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.role.trim() || !formData.company.trim()) return
    
    // Clean up empty strings to undefined
    const cleanedData = {
      ...formData,
      location: formData.location?.trim() || undefined,
      job_url: formData.job_url?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
      salary: formData.salary?.trim() || undefined,
    }
    
    onSubmit(cleanedData)
    if (!initialData) {
      // Reset form if creating new
      setFormData({
        role: '',
        company: '',
        location: '',
        job_type: 'remote',
        salary: '',
        source: 'LinkedIn',
        status: 'applied',
        applied_date: new Date().toISOString().split('T')[0],
        job_url: '',
        notes: '',
      })
      setSelectedFiles([])
    }
  }

  useEffect(() => {
    if (!initialData) {
      setSelectedFiles([])
    }
  }, [initialData])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Role <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            placeholder="e.g., Senior Data Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Company <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            placeholder="e.g., Tech Corp"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Job Type
          </label>
          <select
            value={formData.job_type}
            onChange={(e) =>
              setFormData({ ...formData, job_type: e.target.value as JobFormData['job_type'] })
            }
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          >
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {jobTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Source
          </label>
          <select
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value as JobFormData['source'] })
            }
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          >
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Salary
          </label>
          <input
            type="text"
            value={formData.salary || ''}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            placeholder="e.g., 120000-180000 USD"
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Status <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as JobFormData['status'] })
            }
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
            required
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          Applied Date <span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          value={formData.applied_date}
          onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 date-input-calendar theme-bg-card theme-border theme-text-main"
          required
        />
        <style>{`
          body.dark .date-input-calendar::-webkit-calendar-picker-indicator,
          body.dark-mode .date-input-calendar::-webkit-calendar-picker-indicator {
            filter: invert(1);
            opacity: 0.8;
            cursor: pointer;
          }
          body.dark .date-input-calendar::-webkit-calendar-picker-indicator:hover,
          body.dark-mode .date-input-calendar::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
          }
          body.light .date-input-calendar::-webkit-calendar-picker-indicator {
            filter: none;
            opacity: 0.8;
            cursor: pointer;
          }
          body.light .date-input-calendar::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
          }
        `}</style>
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Job URL
        </label>
        <input
          type="url"
          value={formData.job_url}
          onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none theme-bg-card theme-border theme-text-main"
          placeholder="Optional notes..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
          Resume Attachments (PDF)
        </label>
        <div className="space-y-2">
          <label className="block">
            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="resume-upload"
            />
            <div className="w-full px-3 py-2 border-2 border-dashed font-mono text-sm cursor-pointer hover:border-cyan-400 transition-smooth theme-bg-card theme-border theme-text-main text-center">
              {selectedFiles.length === 0 ? (
                <span>Click to select PDF files or drag and drop</span>
              ) : (
                <span>Add more PDF files</span>
              )}
            </div>
          </label>
          
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between gap-2 p-2 border-2 theme-border theme-bg-card rounded-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FaFilePdf className="text-red-500 flex-shrink-0" size={16} />
                    <span className="font-mono text-sm truncate" style={{ color: 'var(--text-main)' }}>
                      {file.name}
                    </span>
                    <span className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 hover:text-red-600 hover:bg-red-600/10 rounded-sm transition-smooth"
                    title="Remove"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || isUploadingResumes || !formData.role.trim() || !formData.company.trim()}
          className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto theme-text-main theme-border theme-bg-card"
        >
          {isLoading || isUploadingResumes ? 'Saving...' : initialData ? 'Update' : 'Save'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth w-full sm:w-auto theme-text-main theme-border theme-bg-card"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}



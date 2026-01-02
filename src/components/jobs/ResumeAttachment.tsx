import { useState } from 'react'
import { FaFilePdf, FaTrash, FaDownload, FaPrint, FaEye } from 'react-icons/fa'
import { JobResume } from '../../hooks/useJobs'
import { supabase } from '../../lib/supabase'

interface ResumeAttachmentProps {
  resume: JobResume
  onDelete: (resumeId: string, filePath: string) => void
  isDeleting?: boolean
}

export default function ResumeAttachment({ resume, onDelete, isDeleting }: ResumeAttachmentProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleView = async () => {
    setIsLoading(true)
    try {
      // Get signed URL for viewing
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(resume.file_path, 3600) // 1 hour expiry

      if (error) {
        console.error('Error loading PDF:', error)
        alert(`Failed to load resume: ${error.message}. Please ensure the storage bucket is set up correctly.`)
        return
      }

      if (data?.signedUrl) {
        // Open PDF in new tab - browser will show native PDF viewer with download/print
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to load resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(resume.file_path, 3600)

      if (error) {
        console.error('Error downloading PDF:', error)
        alert('Failed to download resume. Please try again.')
        return
      }

      if (data?.signedUrl) {
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = data.signedUrl
        link.download = resume.file_name
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to download resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = async () => {
    setIsLoading(true)
    try {
      // Get signed URL for printing
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(resume.file_path, 3600)

      if (error) {
        console.error('Error loading PDF for print:', error)
        alert('Failed to load resume for printing. Please try again.')
        return
      }

      if (data?.signedUrl) {
        // Open PDF in new window and trigger print
        const printWindow = window.open(data.signedUrl, '_blank')
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print()
            }, 500)
          }
        }
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to print resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="flex items-center justify-between gap-2 p-2 border-2 theme-border theme-bg-card rounded-sm">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <FaFilePdf className="text-red-500 flex-shrink-0" size={20} />
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm truncate" style={{ color: 'var(--text-main)' }}>
            {resume.file_name}
          </div>
          <div className="font-mono text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {formatFileSize(resume.file_size)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={handleView}
          disabled={isLoading}
          className="p-2 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-sm transition-smooth disabled:opacity-50"
          title="View"
        >
          <FaEye size={16} />
        </button>
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="p-2 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-sm transition-smooth disabled:opacity-50"
          title="Download"
        >
          <FaDownload size={16} />
        </button>
        <button
          onClick={handlePrint}
          disabled={isLoading}
          className="p-2 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-sm transition-smooth disabled:opacity-50"
          title="Print"
        >
          <FaPrint size={16} />
        </button>
        <button
          onClick={() => {
            if (confirm(`Are you sure you want to delete "${resume.file_name}"?`)) {
              onDelete(resume.id, resume.file_path)
            }
          }}
          disabled={isDeleting || isLoading}
          className="p-2 hover:text-red-600 hover:bg-red-600/10 rounded-sm transition-smooth disabled:opacity-50"
          title="Delete"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  )
}


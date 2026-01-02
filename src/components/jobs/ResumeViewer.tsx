import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface ResumeViewerProps {
  filePath: string
  fileName: string
  onClose: () => void
}

export default function ResumeViewer({ filePath, fileName, onClose }: ResumeViewerProps) {
  useEffect(() => {
    const loadAndDisplayPDF = async () => {
      try {
        // Get signed URL for the file
        const { data, error } = await supabase.storage
          .from('resumes')
          .createSignedUrl(filePath, 3600) // 1 hour expiry

        if (error) {
          console.error('Error loading PDF:', error)
          alert('Failed to load resume. Please try again.')
          onClose()
          return
        }

        if (data?.signedUrl) {
          // Open PDF in new window with download/print controls
          const newWindow = window.open(data.signedUrl, '_blank')
          
          if (!newWindow) {
            alert('Please allow popups to view the resume.')
            return
          }

          // Wait for window to load, then add print functionality
          newWindow.onload = () => {
            // The browser's native PDF viewer will show download/print buttons
            // This is handled automatically by the browser
          }
        }
      } catch (err) {
        console.error('Error:', err)
        alert('Failed to load resume. Please try again.')
        onClose()
      }
    }

    loadAndDisplayPDF()
  }, [filePath, fileName, onClose])

  return null // This component doesn't render anything visible
}


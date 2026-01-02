import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useUserProfile } from '../../hooks/useUserProfile'
import { trackEvent } from '../../lib/analytics'
import { generatePDF } from '../../lib/pdfExport'

export default function DataControls() {
  const { user, signOut } = useAuth()
  const { exportData, isExporting, deleteAccount, isDeleting } = useUserProfile()
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  // Hide these sections for guest users
  if (user?.is_anonymous) {
    return null
  }

  const handleExportJSON = async () => {
    trackEvent('data_export_started', { format: 'json' })
    try {
      const data = await exportData()
      // Create a blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `zelvi-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      trackEvent('data_export_completed', { format: 'json' })
    } catch (error: any) {
      alert(`Failed to export data: ${error.message}`)
    }
  }

  const handleExportPDF = async () => {
    trackEvent('data_export_started', { format: 'pdf' })
    try {
      const data = await exportData()
      await generatePDF(data)
      trackEvent('data_export_completed', { format: 'pdf' })
    } catch (error: any) {
      alert(`Failed to export PDF: ${error.message}`)
    }
  }

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') {
      alert('Please type DELETE to confirm')
      return
    }

    trackEvent('account_delete_started')
    try {
      await deleteAccount('DELETE')
      trackEvent('account_delete_completed')
      await signOut()
      navigate('/')
    } catch (error: any) {
      alert(`Failed to delete account: ${error.message}`)
    }
  }

  return (
    <>
      {/* Export Section */}
      <div className="border-2 p-6 mb-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
        <h2 className="text-xl font-semibold mb-4 font-mono uppercase theme-text-main">Export Data</h2>
        <p className="font-mono text-xs mb-4 theme-text-main">
          Download all your data. Choose JSON for complete data export or PDF for a formatted summary with essential information.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
          >
            {isExporting ? 'Exporting...' : 'Export as PDF'}
          </button>
          <button
            onClick={handleExportJSON}
            disabled={isExporting}
            className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
          >
            {isExporting ? 'Exporting...' : 'Export as JSON'}
          </button>
        </div>
      </div>

      {/* Delete Section */}
      <div className="border-2 border-red-600 p-6 mb-6 rounded-sm backdrop-blur-modern theme-bg-form">
        <h2 className="text-xl font-semibold text-red-600 mb-4 font-mono uppercase">Danger Zone</h2>
        <p className="font-mono text-xs mb-4 theme-text-main">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {!showDeleteModal ? (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth theme-text-main theme-border theme-bg-card"
          >
            Delete account
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium font-mono text-xs uppercase mb-2 text-red-600">
                Type <span className="font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full border-2 border-red-600 px-3 py-2 font-mono text-sm focus:outline-none focus:border-red-700 theme-bg-card theme-text-main"
                placeholder="DELETE"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting || deleteConfirm !== 'DELETE'}
                className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
              >
                {isDeleting ? 'Deleting...' : 'Confirm deletion'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirm('')
                }}
                disabled={isDeleting}
                className="px-6 py-3 border-2 font-mono text-sm uppercase transition-smooth disabled:opacity-50 disabled:cursor-not-allowed theme-text-main theme-border theme-bg-card"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}


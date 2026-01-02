import { Recruiter } from '../../hooks/useRecruiters'
import { FaEdit } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa'

interface RecruiterListProps {
  recruiters: Recruiter[]
  onEdit: (recruiter: Recruiter) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

const statusLabels: Record<Recruiter['status'], string> = {
  messaged: 'Messaged',
  replied: 'Replied',
  call: 'Call Scheduled',
  submitted: 'Submitted',
  ghosted: 'Ghosted',
}

const statusColors: Record<Recruiter['status'], string> = {
  messaged: 'bg-blue-500/60 text-white dark:text-white border-blue-600',
  replied: 'bg-green-500/60 text-white dark:text-white border-green-600',
  call: 'bg-yellow-500/60 text-black dark:text-black border-yellow-600',
  submitted: 'bg-purple-500/60 text-white dark:text-white border-purple-600',
  ghosted: 'bg-red-500/70 text-white dark:text-white border-red-600',
}

export default function RecruiterList({
  recruiters,
  onEdit,
  onDelete,
  isDeleting,
}: RecruiterListProps) {
  if (recruiters.length === 0) {
    return (
      <div className="text-center py-12 font-mono text-xs theme-text-main">
        <p>No recruiters found. Add your first recruiter contact to get started.</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {recruiters.map((recruiter) => (
        <div
          key={recruiter.id}
          className="border-2 p-3 sm:p-4 hover:border-cyan-400 transition-colors rounded-sm backdrop-blur-modern theme-bg-form theme-border"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-semibold font-mono break-words theme-text-main">
                  {recruiter.name}
                  {recruiter.company && ` – ${recruiter.company}`}
                  {recruiter.platform && ` (${recruiter.platform})`}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium font-mono border-2 theme-border ${statusColors[recruiter.status]} self-start sm:self-auto`}
                >
                  {statusLabels[recruiter.status]}
                </span>
              </div>

              <div className="text-sm font-mono text-xs space-y-1 theme-text-main">
                {recruiter.role && <div>Role: {recruiter.role}</div>}
                <div>Last contact: {formatDate(recruiter.last_contact_date)}</div>
                {recruiter.notes && (
                  <div className="mt-2 line-clamp-2">{recruiter.notes}</div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 sm:ml-4 flex-shrink-0">
              <button
                onClick={() => onEdit(recruiter)}
                className="p-2 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-sm transition-smooth hover:scale-110"
                title="Edit"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this recruiter?')) {
                    onDelete(recruiter.id)
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


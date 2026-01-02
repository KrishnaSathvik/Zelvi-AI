import { LearningLog } from '../../hooks/useLearning'

interface LearningListProps {
  learningLogs: LearningLog[]
  onEdit: (log: LearningLog) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

const categoryLabels: Record<LearningLog['category'], string> = {
  de: 'DE',
  ai_ml: 'AI/ML',
  genai: 'GenAI',
  rag: 'RAG',
  system_design: 'System Design',
  interview: 'Interview',
  other: 'Other',
}

const categoryColors: Record<LearningLog['category'], string> = {
  de: 'bg-blue-500/60 text-white dark:text-white border-blue-600',
  ai_ml: 'bg-purple-500/60 text-white dark:text-white border-purple-600',
  genai: 'bg-green-500/60 text-white dark:text-white border-green-600',
  rag: 'bg-yellow-500/60 text-black dark:text-black border-yellow-600',
  system_design: 'bg-orange-500/60 text-white dark:text-white border-orange-600',
  interview: 'bg-red-500/70 text-white dark:text-white border-red-600',
  other: 'bg-gray-500/60 text-white dark:text-white border-gray-600',
}

export default function LearningList({
  learningLogs,
  onEdit,
  onDelete,
  isDeleting = false,
}: LearningListProps) {
  // Group by date
  const grouped = learningLogs.reduce((acc, log) => {
    const date = log.date
    if (!acc[date]) acc[date] = []
    acc[date].push(log)
    return acc
  }, {} as Record<string, LearningLog[]>)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this learning log?')) {
      onDelete(id)
    }
  }

  return (
    <div className="space-y-6">
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 font-mono text-xs theme-text-main">
          No learning logs yet. Create your first one above!
        </div>
      ) : (
        Object.entries(grouped)
          .sort((a, b) => b[0].localeCompare(a[0])) // Newest first
          .map(([date, logs]) => (
            <div key={date} className="space-y-3">
              <h3 className="text-lg font-semibold font-mono uppercase theme-text-main">{formatDate(date)}</h3>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="border-2 p-4 hover:border-cyan-400 transition-colors rounded-sm backdrop-blur-modern theme-bg-form theme-border"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium font-mono border-2 theme-border ${categoryColors[log.category]}`}
                          >
                            {categoryLabels[log.category]}
                          </span>
                          {log.minutes && (
                            <span className="font-mono text-xs">{log.minutes} min</span>
                          )}
                        </div>
                        <h4 className="font-medium font-mono mb-1 theme-text-main">{log.topic}</h4>
                        {log.resource && (
                          <a
                            href={log.resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm inline-flex items-center gap-1 font-mono text-xs"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            Resource
                          </a>
                        )}
                        {log.takeaways && (
                          <p className="font-mono text-xs mt-2 line-clamp-2 theme-text-main">
                            {log.takeaways}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(log)}
                          className="p-2 hover:text-cyan-400 transition-colors"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          disabled={isDeleting}
                          className="p-2 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  )
}


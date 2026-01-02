import { Content } from '../../hooks/useContent'

interface ContentListProps {
  content: Content[]
  onEdit: (content: Content) => void
  onDelete: (id: string) => void
  onMarkAsPublished?: (id: string) => void
  isDeleting?: boolean
  isMarkingPublished?: boolean
}

const platformColors: Record<Content['platform'], string> = {
  instagram: 'bg-pink-500',
  youtube: 'bg-red-500',
  linkedin: 'bg-blue-500',
  medium: 'bg-green-500',
  pinterest: 'bg-red-600',
  other: 'bg-gray-500',
}

const platformLabels: Record<Content['platform'], string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  medium: 'Medium',
  pinterest: 'Pinterest',
  other: 'Other',
}


const contentTypeLabels: Record<Content['content_type'], string> = {
  post: 'Post',
  reel: 'Reel',
  short: 'Short',
  story: 'Story',
  article: 'Article',
  pin: 'Pin',
}

const statusLabels: Record<Content['status'], string> = {
  idea: 'Idea',
  draft: 'Draft',
  assets_ready: 'Assets Ready',
  scheduled: 'Scheduled',
  published: 'Published',
}

const statusColors: Record<Content['status'], string> = {
  idea: 'bg-gray-500',
  draft: 'bg-yellow-500',
  assets_ready: 'bg-blue-500',
  scheduled: 'bg-purple-500',
  published: 'bg-green-500',
}

export default function ContentList({ content, onEdit, onDelete, onMarkAsPublished, isDeleting, isMarkingPublished }: ContentListProps) {
  if (content.length === 0) {
    return (
      <div className="text-center py-12 font-mono text-xs theme-text-main">
        <p>No content yet. Create your first content piece to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {content.map((item) => (
        <div
          key={item.id}
          className="border-2 p-4 sm:p-5 hover:border-cyan-400 transition-colors rounded-sm backdrop-blur-modern theme-bg-form theme-border"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium font-mono border-2 theme-border ${platformColors[item.platform]}`}>
                  {platformLabels[item.platform]}
                </span>
                <span className="text-xs font-mono">{contentTypeLabels[item.content_type]}</span>
                <span className={`px-2 py-1 text-xs font-medium font-mono border-2 theme-border ${statusColors[item.status]}`}>
                  {statusLabels[item.status]}
                </span>
              </div>
              <p className="text-sm font-mono text-xs mb-1 theme-text-main">
                {new Date(item.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex gap-2 sm:ml-4 flex-shrink-0">
              {onMarkAsPublished && item.status !== 'published' && (
                <button
                  onClick={() => {
                    if (confirm('Mark this content as published?')) {
                      onMarkAsPublished(item.id)
                    }
                  }}
                  disabled={isMarkingPublished}
                  className="hover:text-green-500 transition-colors disabled:opacity-50"
                  title="Mark as published"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onEdit(item)}
                className="hover:text-cyan-400 transition-colors"
                title="Edit content"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this content?')) {
                    onDelete(item.id)
                  }
                }}
                disabled={isDeleting}
                className="hover:text-red-600 transition-colors disabled:opacity-50"
                title="Delete content"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {item.notes && (
            <div className="mt-3 pt-3 border-t-2 theme-border">
              <p className="text-sm font-mono text-xs line-clamp-3 theme-text-main">{item.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


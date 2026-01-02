import { TimelineEntry } from '../../hooks/useTodayTimeline'

interface TimelineProps {
  entries: TimelineEntry[]
  isLoading?: boolean
}

export default function Timeline({ entries, isLoading }: TimelineProps) {
  if (isLoading) {
    return (
      <div className="border-2 p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
        <h2 className="text-xl font-semibold mb-4 font-mono uppercase theme-text-main">Today's Activity Timeline</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 w-16 theme-bg-page"></div>
              <div className="h-4 flex-1 theme-bg-page"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
      <div className="border-2 p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
        <h2 className="text-xl font-semibold mb-4 font-mono uppercase theme-text-main">Today's Activity Timeline</h2>
      {entries.length === 0 ? (
        <div className="text-center py-8 font-mono text-xs theme-text-main">
          No events logged yet. Add jobs, learning sessions, content, or tasks to see them here.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="flex gap-4">
              <div className="text-sm font-mono text-xs min-w-[60px]" style={{ color: 'var(--text-muted)' }}>
                {formatTime(entry.occurred_at)}
              </div>
              <div className="flex-1 font-mono text-sm theme-text-main">{entry.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


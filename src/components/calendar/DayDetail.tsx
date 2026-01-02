import { DayActivity } from '../../hooks/useCalendarData'

interface DayDetailProps {
  activity: DayActivity | null
  onClose: () => void
}

export default function DayDetail({ activity, onClose }: DayDetailProps) {
  if (!activity) {
    return (
      <div className="border-2 p-4 sm:p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold font-mono uppercase theme-text-main">Day Details</h3>
          <button
            onClick={onClose}
            className="p-2 border-2 font-bold transition-smooth font-mono text-xs uppercase theme-text-main theme-border theme-bg-card"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="font-mono text-xs theme-text-main">Select a day to view details</p>
      </div>
    )
  }

  const date = new Date(activity.date)
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="border-2 p-4 sm:p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold font-mono uppercase break-words theme-text-main">{dateStr}</h3>
        <button
          onClick={onClose}
          className="p-2 border-2 font-bold transition-smooth font-mono text-xs uppercase theme-text-main theme-border theme-bg-card"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="border-2 p-2 sm:p-3 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
            <div className="text-xs sm:text-sm font-mono text-xs uppercase theme-text-main">Jobs</div>
            <div className="text-lg sm:text-xl font-semibold font-mono theme-text-main">{activity.jobs}</div>
          </div>
          <div className="border-2 p-2 sm:p-3 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
            <div className="text-xs sm:text-sm font-mono text-xs uppercase theme-text-main">Recruiters</div>
            <div className="text-lg sm:text-xl font-semibold font-mono theme-text-main">{activity.recruiters}</div>
          </div>
          <div className="border-2 p-2 sm:p-3 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
            <div className="text-xs sm:text-sm font-mono text-xs uppercase theme-text-main">Learning</div>
            <div className="text-lg sm:text-xl font-semibold font-mono theme-text-main">{activity.learning} min</div>
          </div>
          <div className="border-2 p-2 sm:p-3 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
            <div className="text-xs sm:text-sm font-mono text-xs uppercase theme-text-main">Content</div>
            <div className="text-lg sm:text-xl font-semibold font-mono theme-text-main">{activity.content}</div>
          </div>
          <div className="border-2 p-2 sm:p-3 col-span-2 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
            <div className="text-xs sm:text-sm font-mono text-xs uppercase theme-text-main">Tasks</div>
            <div className="text-lg sm:text-xl font-semibold font-mono theme-text-main">{activity.tasks}</div>
          </div>
        </div>

        {activity.activities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium font-mono text-xs uppercase mb-2 theme-text-main">Timeline</h4>
            <div className="space-y-2">
              {activity.activities.map((act, index) => (
                <div key={index} className="flex items-start gap-3 text-sm font-mono text-xs theme-text-main">
                  <span>{act.time}</span>
                  <span>{act.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activity.activities.length === 0 && (
          <p className="font-mono text-xs theme-text-main">No activities logged for this day</p>
        )}
      </div>
    </div>
  )
}


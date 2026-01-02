import { DayActivity } from '../../hooks/useCalendarData'
import { formatDateLocal, getTodayLocal, parseDateLocal } from '../../lib/dateUtils'

interface CalendarGridProps {
  activities: DayActivity[]
  selectedDate: string | null
  onDateSelect: (date: string) => void
}

export default function CalendarGrid({ activities, selectedDate, onDateSelect }: CalendarGridProps) {
  const today = getTodayLocal()

  // Get first day of month and number of days
  const firstDay = activities.length > 0 ? parseDateLocal(activities[0].date) : new Date()
  const firstDayOfWeek = firstDay.getDay()
  const daysInMonth = activities.length

  // Create array of day numbers with padding for first week
  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getActivityDots = (activity: DayActivity) => {
    const dots = []
    if (activity.jobs > 0) dots.push({ color: 'bg-blue-500', count: activity.jobs })
    if (activity.recruiters > 0) dots.push({ color: 'bg-orange-500', count: activity.recruiters })
    if (activity.learning > 0) dots.push({ color: 'bg-green-500', count: activity.learning })
    if (activity.content > 0) dots.push({ color: 'bg-yellow-500', count: activity.content })
    if (activity.tasks > 0) dots.push({ color: 'bg-purple-500', count: activity.tasks })
    return dots
  }

  const getDateString = (day: number): string => {
    const date = new Date(firstDay)
    date.setDate(day)
    return formatDateLocal(date)
  }

  const getActivityForDay = (day: number): DayActivity | undefined => {
    const dateStr = getDateString(day)
    return activities.find((a) => a.date === dateStr)
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="border-2 p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium font-mono text-xs uppercase py-2 theme-text-main">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dateStr = getDateString(day)
          const activity = getActivityForDay(day)
          const isToday = dateStr === today
          const isSelected = dateStr === selectedDate
          const dots = activity ? getActivityDots(activity) : []

          return (
            <button
              key={day}
              onClick={() => onDateSelect(dateStr)}
              className={`aspect-square p-2 border-2 transition-colors font-mono theme-text-main ${
                isSelected ? 'theme-bg-card' : isToday ? 'theme-bg-form' : 'theme-bg-page'
              } theme-border`}
            >
              <div className="text-sm font-medium mb-1">{day}</div>
              <div className="flex flex-wrap gap-1 justify-center">
                {dots.slice(0, 3).map((dot, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 ${dot.color}`}
                    title={`${dot.count} activities`}
                  />
                ))}
                {dots.length > 3 && (
                  <div className="text-xs font-mono">+{dots.length - 3}</div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}


import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCalendarData } from '../hooks/useCalendarData'
import CalendarFilters from '../components/calendar/CalendarFilters'
import CalendarGrid from '../components/calendar/CalendarGrid'
import DayDetail from '../components/calendar/DayDetail'
import { trackEvent } from '../lib/analytics'
import { useEffect } from 'react'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'

export default function Calendar() {
  const { user } = useAuth()
  const today = new Date()
  const [filters, setFilters] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    categories: {
      jobs: true,
      recruiters: true,
      learning: true,
      content: true,
      tasks: true,
    },
  }))

  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { calendarData, isLoading } = useCalendarData(user?.id, filters)

  useEffect(() => {
    trackEvent('calendar_view')
  }, [])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    trackEvent('calendar_day_selected', { date })
  }

  const selectedActivity = selectedDate
    ? calendarData?.activities.find((a) => a.date === selectedDate) || null
    : null

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto relative z-10">
          <PageHeader
            title="Calendar"
            description="View your activities and timeline"
          />
          <div className="mt-8 font-mono text-sm theme-text-main">Loading calendar...</div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <PageHeader
          title="Calendar"
          description="View your activities and timeline"
        />

        <div className="space-y-4">
          <CalendarFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <CalendarGrid
              activities={calendarData?.activities || []}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
          <div>
            <DayDetail activity={selectedActivity} onClose={() => setSelectedDate(null)} />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}


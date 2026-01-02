import { CalendarFilters as Filters } from '../../hooks/useCalendarData'

interface CalendarFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function CalendarFilters({ filters, onChange }: CalendarFiltersProps) {
  const handleCategoryToggle = (category: keyof Filters['categories']) => {
    onChange({
      ...filters,
      categories: {
        ...filters.categories,
        [category]: !filters.categories[category],
      },
    })
  }

  const handleMonthChange = (delta: number) => {
    let newMonth = filters.month + delta
    let newYear = filters.year

    if (newMonth < 1) {
      newMonth = 12
      newYear--
    } else if (newMonth > 12) {
      newMonth = 1
      newYear++
    }

    onChange({
      ...filters,
      month: newMonth,
      year: newYear,
    })
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return (
    <div className="border-2 p-3 sm:p-4 mb-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2 border-2 font-bold transition-smooth font-mono text-xs uppercase theme-text-main theme-border theme-bg-card"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg sm:text-xl font-semibold font-mono uppercase theme-text-main">
            {monthNames[filters.month - 1]} {filters.year}
          </h2>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 border-2 font-bold transition-smooth font-mono text-xs uppercase theme-text-main theme-border theme-bg-card"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(filters.categories).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleCategoryToggle(key as keyof Filters['categories'])}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-mono text-xs uppercase border-2 font-bold transition-smooth theme-text-main theme-border ${
                value ? 'theme-bg-card' : 'theme-bg-page'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


import { JobFilters, Job } from '../../hooks/useJobs'

interface JobFiltersProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters) => void
}

const statuses: Job['status'][] = ['applied', 'screener', 'tech', 'offer', 'rejected', 'saved']
const statusLabels: Record<Job['status'], string> = {
  applied: 'Applied',
  screener: 'Screener',
  tech: 'Tech Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  saved: 'Saved',
}

const sources: Job['source'][] = ['LinkedIn', 'Indeed', 'Referral', 'Glassdoor', 'Monster', 'Company Website', 'Recruiter', 'Career Fair', 'University', 'Networking Event', 'Other']

export default function JobFiltersComponent({
  filters,
  onFiltersChange,
}: JobFiltersProps) {
  const handleStatusChange = (status: Job['status'] | 'all') => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? undefined : status,
    })
  }

  const handleSourceChange = (source: Job['source'] | 'all') => {
    onFiltersChange({
      ...filters,
      source: source === 'all' ? undefined : source,
    })
  }

  const handleDateFromChange = (date: string) => {
    onFiltersChange({
      ...filters,
      dateFrom: date || undefined,
    })
  }

  const handleDateToChange = (date: string) => {
    onFiltersChange({
      ...filters,
      dateTo: date || undefined,
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = filters.status || filters.source || filters.dateFrom || filters.dateTo

  return (
    <div className="border-2 p-3 sm:p-4 mb-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold font-mono uppercase theme-text-main">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-mono text-xs hover:text-cyan-400 transition-colors"
            style={{ color: 'var(--text-main)' }}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Status
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleStatusChange(e.target.value as Job['status'] | 'all')}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          >
            <option value="all">All</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Source
          </label>
          <select
            value={filters.source || 'all'}
            onChange={(e) => handleSourceChange(e.target.value as Job['source'] | 'all')}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          >
            <option value="all">All</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Date From
          </label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 date-input-calendar theme-bg-card theme-border theme-text-main"
          />
        </div>

        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Date To
          </label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 date-input-calendar theme-bg-card theme-border theme-text-main"
          />
        </div>
        <style>{`
          body.dark .date-input-calendar::-webkit-calendar-picker-indicator,
          body.dark-mode .date-input-calendar::-webkit-calendar-picker-indicator {
            filter: invert(1);
            opacity: 0.8;
            cursor: pointer;
          }
          body.dark .date-input-calendar::-webkit-calendar-picker-indicator:hover,
          body.dark-mode .date-input-calendar::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
          }
          body.light .date-input-calendar::-webkit-calendar-picker-indicator {
            filter: none;
            opacity: 0.8;
            cursor: pointer;
          }
          body.light .date-input-calendar::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
          }
        `}</style>
      </div>
    </div>
  )
}


import { RecruiterFilters, Recruiter } from '../../hooks/useRecruiters'

interface RecruiterFiltersProps {
  filters: RecruiterFilters
  onFiltersChange: (filters: RecruiterFilters) => void
}

const statuses: Recruiter['status'][] = ['messaged', 'replied', 'call', 'submitted', 'ghosted']
const statusLabels: Record<Recruiter['status'], string> = {
  messaged: 'Messaged',
  replied: 'Replied',
  call: 'Call Scheduled',
  submitted: 'Submitted',
  ghosted: 'Ghosted',
}

const platforms: Recruiter['platform'][] = ['LinkedIn', 'Email', 'WhatsApp', 'Other']

export default function RecruiterFiltersComponent({
  filters,
  onFiltersChange,
}: RecruiterFiltersProps) {
  const handleStatusChange = (status: Recruiter['status'] | 'all') => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? undefined : status,
    })
  }

  const handlePlatformChange = (platform: Recruiter['platform'] | 'all') => {
    onFiltersChange({
      ...filters,
      platform: platform === 'all' ? undefined : platform,
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = filters.status || filters.platform

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            Status
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleStatusChange(e.target.value as Recruiter['status'] | 'all')}
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
            Platform
          </label>
          <select
            value={filters.platform || 'all'}
            onChange={(e) => handlePlatformChange(e.target.value as Recruiter['platform'] | 'all')}
            className="w-full px-3 py-2 border-2 font-mono text-sm focus:outline-none focus:border-cyan-400 theme-bg-card theme-border theme-text-main"
          >
            <option value="all">All</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}


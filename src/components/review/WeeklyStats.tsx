import { WeeklyStats as WeeklyStatsType } from '../../hooks/useWeeklyStats'

interface WeeklyStatsProps {
  stats: WeeklyStatsType
  isLoading: boolean
  lastWeekStats?: WeeklyStatsType
  lastWeekLoading?: boolean
}

const formatChange = (current: number, last: number): { text: string; isPositive: boolean } => {
  if (last === 0) {
    if (current > 0) return { text: `+${current}`, isPositive: true }
    return { text: '0', isPositive: false }
  }
  const change = current - last
  const percent = Math.round((change / last) * 100)
  if (change > 0) return { text: `+${change} (+${percent}%)`, isPositive: true }
  if (change < 0) return { text: `${change} (${percent}%)`, isPositive: false }
  return { text: '0', isPositive: false }
}

export default function WeeklyStats({ stats, isLoading, lastWeekStats, lastWeekLoading }: WeeklyStatsProps) {
  if (isLoading) {
    return (
      <div className="border-2 p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
        <div className="font-mono text-xs theme-text-main">Loading stats...</div>
      </div>
    )
  }

  const showComparison = lastWeekStats && !lastWeekLoading

  return (
    <div className="border-2 p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <h2 className="text-xl font-semibold mb-4 font-mono uppercase theme-text-main">
        {showComparison ? 'This Week vs Last Week' : 'Weekly Stats'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm font-mono text-xs mb-1 uppercase theme-text-main">Jobs</div>
          <div className="text-lg font-semibold font-mono theme-text-main">
            {stats.jobs.applied} applied
          </div>
          {showComparison && (
            <div className={`text-xs font-mono mt-1 ${
              formatChange(stats.jobs.applied, lastWeekStats.jobs.applied).isPositive 
                ? 'text-green-400' 
                : formatChange(stats.jobs.applied, lastWeekStats.jobs.applied).text.startsWith('-')
                  ? 'text-red-400'
                  : ''
            }`} style={!formatChange(stats.jobs.applied, lastWeekStats.jobs.applied).isPositive && !formatChange(stats.jobs.applied, lastWeekStats.jobs.applied).text.startsWith('-') ? { color: 'var(--text-main)' } : {}}>
              vs last: {formatChange(stats.jobs.applied, lastWeekStats.jobs.applied).text}
            </div>
          )}
          <div className="text-sm font-mono text-xs mt-1 theme-text-main">
            {stats.jobs.interviews} interviews · {stats.jobs.offers} offers
          </div>
        </div>
        <div>
          <div className="text-sm font-mono text-xs mb-1 uppercase theme-text-main">Recruiters</div>
          <div className="text-lg font-semibold font-mono theme-text-main">
            {stats.recruiters.contacts} contacts
          </div>
          {showComparison && (
            <div className={`text-xs font-mono mt-1 ${
              formatChange(stats.recruiters.contacts, lastWeekStats.recruiters.contacts).isPositive 
                ? 'text-green-400' 
                : formatChange(stats.recruiters.contacts, lastWeekStats.recruiters.contacts).text.startsWith('-')
                  ? 'text-red-400'
                  : ''
            }`} style={!formatChange(stats.recruiters.contacts, lastWeekStats.recruiters.contacts).isPositive && !formatChange(stats.recruiters.contacts, lastWeekStats.recruiters.contacts).text.startsWith('-') ? { color: 'var(--text-main)' } : {}}>
              vs last: {formatChange(stats.recruiters.contacts, lastWeekStats.recruiters.contacts).text}
            </div>
          )}
          <div className="text-sm font-mono text-xs mt-1 theme-text-main">
            {stats.recruiters.responseRate}% response rate
          </div>
        </div>
        <div>
          <div className="text-sm font-mono text-xs mb-1 uppercase theme-text-main">Learning</div>
          <div className="text-lg font-semibold font-mono theme-text-main">
            {stats.learning.totalMinutes} min
          </div>
          {showComparison && (
            <div className={`text-xs font-mono mt-1 ${
              formatChange(stats.learning.totalMinutes, lastWeekStats.learning.totalMinutes).isPositive 
                ? 'text-green-400' 
                : formatChange(stats.learning.totalMinutes, lastWeekStats.learning.totalMinutes).text.startsWith('-')
                  ? 'text-red-400'
                  : ''
            }`} style={!formatChange(stats.learning.totalMinutes, lastWeekStats.learning.totalMinutes).isPositive && !formatChange(stats.learning.totalMinutes, lastWeekStats.learning.totalMinutes).text.startsWith('-') ? { color: 'var(--text-main)' } : {}}>
              vs last: {formatChange(stats.learning.totalMinutes, lastWeekStats.learning.totalMinutes).text}
            </div>
          )}
          <div className="text-sm font-mono text-xs mt-1 theme-text-main">
            Top: {stats.learning.topCategory || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-sm font-mono text-xs mb-1 uppercase theme-text-main">Content</div>
          <div className="text-lg font-semibold font-mono theme-text-main">
            {stats.content.published} published
          </div>
          {showComparison && (
            <div className={`text-xs font-mono mt-1 ${
              formatChange(stats.content.published, lastWeekStats.content.published).isPositive 
                ? 'text-green-400' 
                : formatChange(stats.content.published, lastWeekStats.content.published).text.startsWith('-')
                  ? 'text-red-400'
                  : ''
            }`} style={!formatChange(stats.content.published, lastWeekStats.content.published).isPositive && !formatChange(stats.content.published, lastWeekStats.content.published).text.startsWith('-') ? { color: 'var(--text-main)' } : {}}>
              vs last: {formatChange(stats.content.published, lastWeekStats.content.published).text}
            </div>
          )}
        </div>
        <div>
          <div className="text-sm font-mono text-xs mb-1 uppercase theme-text-main">Tasks</div>
          <div className="text-lg font-semibold font-mono theme-text-main">
            {stats.tasks.completed} / {stats.tasks.created} completed
          </div>
          {showComparison && (
            <div className={`text-xs font-mono mt-1 ${
              formatChange(stats.tasks.completed, lastWeekStats.tasks.completed).isPositive 
                ? 'text-green-400' 
                : formatChange(stats.tasks.completed, lastWeekStats.tasks.completed).text.startsWith('-')
                  ? 'text-red-400'
                  : ''
            }`} style={!formatChange(stats.tasks.completed, lastWeekStats.tasks.completed).isPositive && !formatChange(stats.tasks.completed, lastWeekStats.tasks.completed).text.startsWith('-') ? { color: 'var(--text-main)' } : {}}>
              vs last: {formatChange(stats.tasks.completed, lastWeekStats.tasks.completed).text}
            </div>
          )}
        </div>
        {stats.goals.length > 0 && (
          <div>
            <div className="text-sm font-mono text-xs mb-1 uppercase theme-text-main">Goals</div>
            <div className="text-lg font-semibold font-mono theme-text-main">
              {stats.goals.length} active
            </div>
            <div className="text-sm font-mono text-xs theme-text-main">
              {stats.goals.map((g) => `${g.current}/${g.target}`).join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


import { DailySummary } from '../../hooks/useDailySummary'
import Icon from '../ui/Icon'
import Card from '../ui/Card'
import Skeleton from '../ui/Skeleton'

interface SummaryBarProps {
  summary: DailySummary
  isLoading?: boolean
}

export default function SummaryBar({ summary, isLoading }: SummaryBarProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} variant="default" className="p-3 sm:p-4">
            <Skeleton variant="rectangular" width="40px" height="20px" className="mb-2" />
            <Skeleton variant="text" width="60%" className="mb-1" />
            <Skeleton variant="text" width="40%" />
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      icon: 'nav-dashboard' as const,
      label: 'Jobs',
      value: summary.jobsToday,
      link: '/app/jobs',
    },
    {
      icon: 'nav-team' as const,
      label: 'Recruiters',
      value: summary.recruitersToday,
      link: '/app/recruiters',
    },
    {
      icon: 'cont-doc' as const,
      label: 'Learning',
      value: summary.learningSessionsToday === 1 ? '1 session' : `${summary.learningSessionsToday} sessions`,
      link: '/app/learning',
    },
    {
      icon: 'cont-image' as const,
      label: 'Content',
      value: summary.contentTotal,
      link: '/app/content',
    },
    {
      icon: 'nav-tasks' as const,
      label: 'Tasks',
      value: `${summary.tasksDone}/${summary.tasksTotal}`,
      link: '/app',
    },
    {
      icon: 'stat-success' as const,
      label: 'Goals',
      value: summary.goalsSnapshot || 'None',
      link: '/app/goals',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="stagger-item">
          <Card
            variant="corner"
            hover
            className="p-3 sm:p-4 no-underline group"
            as="a"
            href={card.link}
          >
            <div className="mb-1 sm:mb-2 text-cyan-400 transition-transform duration-300 group-hover:scale-110">
              <Icon name={card.icon} size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs sm:text-sm font-mono text-[10px] sm:text-xs mb-1 uppercase leading-tight" style={{ color: 'var(--text-muted)' }}>{card.label}</div>
            <div className="text-sm sm:text-base md:text-lg font-semibold font-mono leading-tight break-words theme-text-main">{card.value}</div>
          </Card>
        </div>
      ))}
    </div>
  )
}


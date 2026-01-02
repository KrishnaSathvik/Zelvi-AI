import { GoalProgressData } from '../../hooks/useAnalytics'
import { Target, TrendingUp, AlertCircle } from 'lucide-react'

interface GoalsProgressProps {
  goals: GoalProgressData[]
}

export default function GoalsProgress({ goals }: GoalsProgressProps) {
  if (!goals || goals.length === 0) return null

  return (
    <div className="border-2 border-acid/30 p-4 md:p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-acid/20 flex items-center justify-center border border-acid/30 flex-shrink-0">
          <Target className="w-4 h-4 md:w-5 md:h-5 text-acid" />
        </div>
        <h3 className="text-xs md:text-sm font-bold text-text uppercase tracking-widest font-mono">
          Active Goals
        </h3>
      </div>

      <div className="space-y-4">
        {goals.map((goalProgress) => {
          const { goal, percentage, status, daysLeft } = goalProgress
          const isOnTrack = status === 'on_track'

          return (
            <div key={goal.id} className="border-2 border-border rounded-sm p-3 md:p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold font-mono theme-text-main">{goal.title}</h4>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-sm ${
                        isOnTrack
                          ? 'bg-success/20 text-success border border-success/30'
                          : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                      }`}
                    >
                      {isOnTrack ? (
                        <>
                          <TrendingUp className="w-2.5 h-2.5 inline mr-1" />
                          On Track
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-2.5 h-2.5 inline mr-1" />
                          Behind
                        </>
                      )}
                    </span>
                  </div>
                  <div className="text-[10px] md:text-xs text-dim font-mono">
                    {/* Goals are now simplified - no type/timeframe/end_date */}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg md:text-xl font-bold font-mono theme-text-main">
                    {percentage}%
                  </div>
                  <div className="text-[10px] text-dim font-mono">{daysLeft} days left</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface border border-border rounded-sm h-3 md:h-4 overflow-hidden mb-2">
                <div
                  className={`h-full transition-all duration-500 ${
                    isOnTrack ? 'bg-success' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="text-xs font-mono theme-text-main">
                {/* Goals are now simplified - no progress tracking */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


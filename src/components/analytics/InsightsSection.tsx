import { Lightbulb, Target, TrendingUp } from 'lucide-react'
import { GoalAchievementData, WeeklyPatternData, formatDateShort } from '../../lib/analyticsUtils'

interface InsightsSectionProps {
  goalAchievements?: {
    jobs?: GoalAchievementData
    learning?: GoalAchievementData
    tasks?: GoalAchievementData
  }
  weeklyPatterns?: {
    jobs?: WeeklyPatternData
    learning?: WeeklyPatternData
    tasks?: WeeklyPatternData
  }
}

export default function InsightsSection({ goalAchievements, weeklyPatterns }: InsightsSectionProps) {
  const hasAnyInsights = 
    (goalAchievements && (goalAchievements.jobs || goalAchievements.learning || goalAchievements.tasks)) ||
    (weeklyPatterns && (weeklyPatterns.jobs || weeklyPatterns.learning || weeklyPatterns.tasks))

  if (!hasAnyInsights) return null

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xs md:text-sm font-bold text-text uppercase tracking-widest font-mono flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-acid" />
        Insights & Patterns
      </h2>

      {/* Goal Achievement */}
      {goalAchievements && (goalAchievements.jobs || goalAchievements.learning || goalAchievements.tasks) && (
        <div className="border-2 border-acid/30 p-4 md:p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
          <div className="flex items-center gap-2 md:gap-3 mb-4">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-acid" />
            <h3 className="text-xs md:text-sm font-bold text-text uppercase tracking-widest font-mono">
              Goal Achievement Rate
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {goalAchievements.jobs && (
              <div>
                <div className="text-[10px] md:text-xs text-dim font-mono uppercase mb-2">Job Applications</div>
                <div className="text-2xl md:text-3xl font-bold text-text font-mono mb-1">
                  {goalAchievements.jobs.achievementRate}%
                </div>
                <div className="text-[10px] text-dim font-mono">
                  {goalAchievements.jobs.achievedDays} of {goalAchievements.jobs.totalDays} days
                </div>
              </div>
            )}
            {goalAchievements.learning && (
              <div>
                <div className="text-[10px] md:text-xs text-dim font-mono uppercase mb-2">Learning</div>
                <div className="text-2xl md:text-3xl font-bold text-success font-mono mb-1">
                  {goalAchievements.learning.achievementRate}%
                </div>
                <div className="text-[10px] text-dim font-mono">
                  {goalAchievements.learning.achievedDays} of {goalAchievements.learning.totalDays} days
                </div>
              </div>
            )}
            {goalAchievements.tasks && (
              <div>
                <div className="text-[10px] md:text-xs text-dim font-mono uppercase mb-2">Task Completion</div>
                <div className="text-2xl md:text-3xl font-bold text-sky-400 font-mono mb-1">
                  {goalAchievements.tasks.achievementRate}%
                </div>
                <div className="text-[10px] text-dim font-mono">
                  {goalAchievements.tasks.achievedDays} of {goalAchievements.tasks.totalDays} days
                </div>
              </div>
            )}
          </div>
          {((goalAchievements.jobs?.insights.length ?? 0) || (goalAchievements.learning?.insights.length ?? 0) || (goalAchievements.tasks?.insights.length ?? 0)) > 0 && (
            <div className="space-y-2 pt-4 border-t border-border/50">
              {goalAchievements.jobs?.insights.map((insight, idx) => (
                <div key={`jobs-${idx}`} className="text-xs md:text-sm text-text font-mono flex items-start gap-2">
                  <span className="text-acid mt-0.5">•</span>
                  <span>Jobs: {insight}</span>
                </div>
              ))}
              {goalAchievements.learning?.insights.map((insight, idx) => (
                <div key={`learning-${idx}`} className="text-xs md:text-sm text-text font-mono flex items-start gap-2">
                  <span className="text-acid mt-0.5">•</span>
                  <span>Learning: {insight}</span>
                </div>
              ))}
              {goalAchievements.tasks?.insights.map((insight, idx) => (
                <div key={`tasks-${idx}`} className="text-xs md:text-sm text-text font-mono flex items-start gap-2">
                  <span className="text-acid mt-0.5">•</span>
                  <span>Tasks: {insight}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly Patterns */}
      {weeklyPatterns && (weeklyPatterns.jobs || weeklyPatterns.learning || weeklyPatterns.tasks) && (
        <div className="border-2 border-acid/30 p-4 md:p-6 rounded-sm backdrop-blur-modern theme-bg-form theme-border">
          <div className="flex items-center gap-2 md:gap-3 mb-4">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-acid" />
            <h3 className="text-xs md:text-sm font-bold text-text uppercase tracking-widest font-mono">
              Weekly Patterns
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {weeklyPatterns.jobs && weeklyPatterns.jobs.bestDay && (
              <div>
                <div className="text-[10px] md:text-xs text-dim font-mono uppercase mb-2">Best Day (Jobs)</div>
                <div className="text-sm font-mono text-text mb-1">
                  {formatDateShort(weeklyPatterns.jobs.bestDay.date)}
                </div>
                <div className="text-xs text-dim font-mono">
                  {weeklyPatterns.jobs.bestDay.value} applications
                </div>
              </div>
            )}
            {weeklyPatterns.learning && weeklyPatterns.learning.bestDay && (
              <div>
                <div className="text-[10px] md:text-xs text-dim font-mono uppercase mb-2">Best Day (Learning)</div>
                <div className="text-sm font-mono text-text mb-1">
                  {formatDateShort(weeklyPatterns.learning.bestDay.date)}
                </div>
                <div className="text-xs text-dim font-mono">
                  {weeklyPatterns.learning.bestDay.value} sessions
                </div>
              </div>
            )}
            {weeklyPatterns.jobs && weeklyPatterns.jobs.averagePerWeek > 0 && (
              <div>
                <div className="text-[10px] md:text-xs text-dim font-mono uppercase mb-2">Average per Week</div>
                <div className="text-lg font-bold text-acid font-mono mb-1">
                  {weeklyPatterns.jobs.averagePerWeek.toFixed(1)} applications
                </div>
              </div>
            )}
            {weeklyPatterns.learning && weeklyPatterns.learning.averagePerWeek > 0 && (
              <div>
                <div className="text-[10px] md:text-xs text-dim font-mono uppercase mb-2">Average per Week</div>
                <div className="text-lg font-bold text-acid font-mono mb-1">
                  {weeklyPatterns.learning.averagePerWeek.toFixed(1)} sessions
                </div>
              </div>
            )}
          </div>
          {((weeklyPatterns.jobs?.insights.length ?? 0) || (weeklyPatterns.learning?.insights.length ?? 0) || (weeklyPatterns.tasks?.insights.length ?? 0)) > 0 && (
            <div className="space-y-2 pt-4 border-t border-border/50">
              {weeklyPatterns.jobs?.insights.map((insight, idx) => (
                <div key={`jobs-pattern-${idx}`} className="text-xs md:text-sm text-text font-mono flex items-start gap-2">
                  <span className="text-acid mt-0.5">•</span>
                  <span>{insight}</span>
                </div>
              ))}
              {weeklyPatterns.learning?.insights.map((insight, idx) => (
                <div key={`learning-pattern-${idx}`} className="text-xs md:text-sm text-text font-mono flex items-start gap-2">
                  <span className="text-acid mt-0.5">•</span>
                  <span>{insight}</span>
                </div>
              ))}
              {weeklyPatterns.tasks?.insights.map((insight, idx) => (
                <div key={`tasks-pattern-${idx}`} className="text-xs md:text-sm text-text font-mono flex items-start gap-2">
                  <span className="text-acid mt-0.5">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


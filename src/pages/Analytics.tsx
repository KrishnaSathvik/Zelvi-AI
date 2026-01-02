import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useAnalytics } from '../hooks/useAnalytics'
import AnalyticsFilters from '../components/analytics/AnalyticsFilters'
import JobFunnelChart from '../components/analytics/JobFunnelChart'
import JobTimelineChart from '../components/analytics/JobTimelineChart'
import RecruiterChart from '../components/analytics/RecruiterChart'
import LearningChart from '../components/analytics/LearningChart'
import ProjectChart from '../components/analytics/ProjectChart'
import ContentChart from '../components/analytics/ContentChart'
import TaskChart from '../components/analytics/TaskChart'
import StatCard from '../components/analytics/StatCard'
import InsightsSection from '../components/analytics/InsightsSection'
import GoalsProgress from '../components/analytics/GoalsProgress'
import { trackEvent } from '../lib/analytics'
import { useEffect } from 'react'
import SectionDivider from '../components/ui/SectionDivider'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import { Briefcase, GraduationCap, CheckCircle2, Target, Users } from 'lucide-react'

export default function Analytics() {
  const { user } = useAuth()
  const [filters, setFilters] = useState(() => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 30)
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }
  })

  const { analytics, isLoading } = useAnalytics(user?.id, filters)

  useEffect(() => {
    trackEvent('analytics_view')
  }, [])

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto relative z-10">
          <PageHeader
            title="Analytics"
            description="Insights from your data"
          />
          <div className="mt-8 font-mono text-sm theme-text-main">Loading analytics...</div>
        </div>
      </PageTransition>
    )
  }

  if (!analytics) {
    return (
      <PageTransition>
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto relative z-10">
          <PageHeader
            title="Analytics"
            description="Insights from your data"
          />
          <div className="mt-8 font-mono text-sm theme-text-main">No data available</div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <PageHeader
          title="Analytics"
          description="Insights from your data"
        />

      <div className="space-y-4">
        <AnalyticsFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Summary Statistics */}
      {analytics.summaryStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          <StatCard
            icon={<Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-500 fill-orange-500 dark:text-acid dark:fill-acid flex-shrink-0" />}
            label="Applications"
            value={analytics.summaryStats.totalApplications}
            trend={analytics.trends.applications || undefined}
            subtitle="Total applied"
            borderColor="border-orange-500/30 dark:border-acid/30"
            valueColor="text-orange-500 dark:text-acid"
          />
          <StatCard
            icon={<Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-success fill-success flex-shrink-0" />}
            label="Interviews"
            value={analytics.summaryStats.totalInterviews}
            subtitle={`${analytics.summaryStats.interviewRate}% rate`}
            borderColor="border-success/30"
            valueColor="text-success"
          />
          <StatCard
            icon={<CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-500 fill-purple-500 dark:text-purple-500 flex-shrink-0" />}
            label="Offers"
            value={analytics.summaryStats.totalOffers}
            subtitle={`${analytics.summaryStats.offerRate}% rate`}
            borderColor="border-purple-500/30 dark:border-acid/30"
            valueColor="text-purple-500 dark:text-text"
          />
          <StatCard
            icon={<GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 fill-blue-500 dark:text-blue-500 flex-shrink-0" />}
            label="Learning"
            value={analytics.summaryStats.totalLearningSessions}
            trend={analytics.trends.learning || undefined}
            subtitle={`${analytics.learningStreak} day streak`}
            borderColor="border-blue-500/30 dark:border-acid/30"
            valueColor="text-blue-500 dark:text-text"
          />
          <StatCard
            icon={<CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400 fill-cyan-400 flex-shrink-0" />}
            label="Tasks Done"
            value={analytics.summaryStats.totalTasksCompleted}
            trend={analytics.trends.tasks || undefined}
            subtitle={`of ${analytics.summaryStats.totalTasksCreated}`}
            borderColor="border-cyan-400/30 dark:border-acid/30"
            valueColor="text-cyan-400 dark:text-text"
          />
          <StatCard
            icon={<Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 fill-amber-500 dark:text-amber-500 flex-shrink-0" />}
            label="Recruiters"
            value={analytics.recruiters.reduce((sum, r) => sum + r.contacts, 0)}
            subtitle={`${analytics.summaryStats.responseRate}% response`}
            borderColor="border-amber-500/30 dark:border-amber-500/30"
            valueColor="text-amber-500 dark:text-text"
          />
        </div>
      )}

      <SectionDivider variant="gradient" />

      {/* Goals Progress */}
      {analytics.activeGoals && analytics.activeGoals.length > 0 && (
        <>
          <GoalsProgress goals={analytics.activeGoals} />
          <SectionDivider variant="tilt" height={8} />
        </>
      )}

      {/* All Charts - Back to Back, Two Per Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <JobFunnelChart data={analytics.jobFunnel} />
        <JobTimelineChart data={analytics.jobTimeline} />
        <RecruiterChart data={analytics.recruiters} />
        <LearningChart data={analytics.learning} streak={analytics.learningStreak} />
        <TaskChart data={analytics.tasks} />
        <ProjectChart data={analytics.projects} />
        {analytics.content && analytics.content.length > 0 && (
          <ContentChart data={analytics.content} />
        )}
      </div>

      {/* Insights & Patterns Section */}
      {(analytics.goalAchievements || analytics.weeklyPatterns) && (
        <>
          <SectionDivider variant="gradient" height={8} />
          <InsightsSection
            goalAchievements={analytics.goalAchievements}
            weeklyPatterns={analytics.weeklyPatterns}
          />
        </>
      )}
      </div>
    </PageTransition>
  )
}


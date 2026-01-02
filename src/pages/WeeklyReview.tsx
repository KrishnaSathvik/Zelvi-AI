import { useState, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useWeeklyReview, WeeklyReviewFormData } from '../hooks/useWeeklyReview'
import { useWeeklyStats } from '../hooks/useWeeklyStats'
import WeekSelector from '../components/review/WeekSelector'
import WeeklyStats from '../components/review/WeeklyStats'
import ReviewForm from '../components/review/ReviewForm'
import AISummary from '../components/review/AISummary'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'

export default function WeeklyReview() {
  const { user } = useAuth()

  const getWeekStart = (date: Date): string => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
    const monday = new Date(d.setDate(diff))
    return monday.toISOString().split('T')[0]
  }

  const [weekStart, setWeekStart] = useState<string>(getWeekStart(new Date()))
  const weekEnd = new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Calculate last week's dates for comparison
  const lastWeekStart = useMemo(() => {
    const lastWeek = new Date(weekStart)
    lastWeek.setDate(lastWeek.getDate() - 7)
    return getWeekStart(lastWeek)
  }, [weekStart])
  
  const lastWeekEnd = useMemo(() => {
    return new Date(new Date(lastWeekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }, [lastWeekStart])

  const { review, isLoading: reviewLoading, saveReview, generateAISummary, isSaving, isGenerating } =
    useWeeklyReview(user?.id, weekStart)
  
  // Suppress unused variable warning - reviewLoading may be used in future
  void reviewLoading

  // Get last week's review for context
  const { review: lastWeekReview } = useWeeklyReview(user?.id, lastWeekStart)

  const { stats, isLoading: statsLoading } = useWeeklyStats(user?.id, weekStart, weekEnd)
  const { stats: lastWeekStats, isLoading: lastWeekStatsLoading } = useWeeklyStats(user?.id, lastWeekStart, lastWeekEnd)

  const handleSave = (formData: WeeklyReviewFormData) => {
    saveReview(formData)
  }

  const handleGenerateAI = () => {
    generateAISummary({
      weekStart,
      weekEnd,
      stats,
      reviewText: {
        wins: review?.wins || '',
        challenges: review?.challenges || '',
        avoided: review?.avoided || '',
        next_focus: review?.next_focus || '',
      },
      goals: stats.goals,
    })
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-6xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <PageHeader
          title="Weekly Review"
          description="Reflect on your week and plan for the next"
        />

        <div className="space-y-4">
          <WeekSelector weekStart={weekStart} onWeekChange={setWeekStart} />
        </div>

        <WeeklyStats 
          stats={stats} 
          isLoading={statsLoading}
          lastWeekStats={lastWeekStats}
          lastWeekLoading={lastWeekStatsLoading}
        />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="border-2 p-6 sm:p-8 rounded-sm shadow-card backdrop-blur-modern theme-bg-form theme-border">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold font-mono uppercase mb-2 theme-text-main">Your Reflection</h2>
              <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                Optional: Write your thoughts to help AI generate personalized insights and recommendations.
              </p>
            </div>
            <ReviewForm
              initialData={review || undefined}
              onSave={handleSave}
              isSaving={isSaving}
              lastWeekReview={lastWeekReview || undefined}
            />
          </div>

          <div>
            <AISummary review={review || null} onGenerate={handleGenerateAI} isGenerating={isGenerating} />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}


/**
 * Analytics utility functions for insights and pattern detection
 */

export interface GoalAchievementData {
  totalDays: number
  achievementRate: number
  achievedDays: number
  insights: string[]
}

export interface WeeklyPatternData {
  bestDay: { date: string; value: number } | null
  worstDay: { date: string; value: number } | null
  averagePerWeek: number
  insights: string[]
}

/**
 * Calculate goal achievement insights
 */
export function calculateGoalAchievement(
  data: Array<{ date: string; value: number }>,
  target: number,
  threshold: number = 0.8
): GoalAchievementData {
  if (data.length === 0) {
    return {
      totalDays: 0,
      achievementRate: 0,
      achievedDays: 0,
      insights: [],
    }
  }

  const totalDays = data.length
  const achievedDays = data.filter((d) => d.value >= target * threshold).length
  const achievementRate = totalDays > 0 ? Math.round((achievedDays / totalDays) * 100) : 0

  const insights: string[] = []
  if (achievementRate >= 80) {
    insights.push('Excellent consistency! You\'re hitting your target most days.')
  } else if (achievementRate >= 60) {
    insights.push('Good progress. Try to hit your target more consistently.')
  } else if (achievementRate > 0) {
    insights.push('Focus on meeting your target more often for better results.')
  } else {
    insights.push('Start tracking to see your progress.')
  }

  return {
    totalDays,
    achievementRate,
    achievedDays,
    insights,
  }
}

/**
 * Calculate weekly patterns
 */
export function calculateWeeklyPatterns(
  data: Array<{ date: string; value: number }>
): WeeklyPatternData {
  if (data.length === 0) {
    return {
      bestDay: null,
      worstDay: null,
      averagePerWeek: 0,
      insights: [],
    }
  }

  // Find best and worst days
  const bestDay = data.reduce((best, current) => {
    return current.value > best.value ? current : best
  })
  const worstDay = data.reduce((worst, current) => {
    return current.value < worst.value ? current : worst
  })

  // Calculate average per week
  const totalValue = data.reduce((sum, d) => sum + d.value, 0)
  const weeks = Math.max(1, Math.ceil(data.length / 7))
  const averagePerWeek = Math.round((totalValue / weeks) * 10) / 10

  const insights: string[] = []
  if (averagePerWeek > 0) {
    insights.push(`You're averaging ${averagePerWeek.toFixed(1)} per week.`)
  }

  return {
    bestDay: { date: bestDay.date, value: bestDay.value },
    worstDay: { date: worstDay.date, value: worstDay.value },
    averagePerWeek,
    insights,
  }
}

/**
 * Calculate trend (difference between last two values)
 */
export function calculateTrend(
  data: Array<{ value: number }>
): number | null {
  if (data.length < 2) return null
  const last = data[data.length - 1].value
  const previous = data[data.length - 2].value
  return last - previous
}

/**
 * Calculate correlation between two data series
 */
export function calculateCorrelation(
  data1: number[],
  data2: number[]
): number {
  if (data1.length !== data2.length || data1.length === 0) return 0

  const n = data1.length
  const sum1 = data1.reduce((a, b) => a + b, 0)
  const sum2 = data2.reduce((a, b) => a + b, 0)
  const sum1Sq = data1.reduce((a, b) => a + b * b, 0)
  const sum2Sq = data2.reduce((a, b) => a + b * b, 0)
  const pSum = data1.reduce((sum, val, i) => sum + val * data2[i], 0)

  const num = pSum - (sum1 * sum2 / n)
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n))

  if (den === 0) return 0
  return num / den
}

/**
 * Format date for display
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}


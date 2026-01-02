import { Goal } from './useGoals'

export interface GoalProgress {
  goal: Goal
  current: number
  percentage: number
  daysElapsed: number
  daysTotal: number
  daysLeft: number
  status: 'on_track' | 'behind'
}

// Goals are now simplified to text-only, so progress tracking is not available
export function useGoalProgress(_userId: string | undefined, _goal: Goal): GoalProgress | null {
  // Simplified goals don't support progress tracking
  return null
}


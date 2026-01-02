import { useAuth } from '../contexts/AuthContext'
import { useDailySummary } from '../hooks/useDailySummary'
import { useDailyTasks, DailyTask } from '../hooks/useDailyTasks'
import { useTodayTimeline } from '../hooks/useTodayTimeline'
import SummaryBar from '../components/dashboard/SummaryBar'
import ActionList from '../components/dashboard/ActionList'
import Timeline from '../components/dashboard/Timeline'
import PageTransition from '../components/ui/PageTransition'
import PageHeader from '../components/ui/PageHeader'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { getTodayLocal } from '../lib/dateUtils'

export default function Dashboard() {
  const { user } = useAuth()
  const today = getTodayLocal()

  const { summary, isLoading: summaryLoading } = useDailySummary(user?.id, today)
  const {
    tasks,
    completeTask,
    uncompleteTask,
    createManualTask,
    updateManualTask,
    deleteManualTask,
    isCompleting,
    isCreating,
    isUpdating,
    isDeleting,
  } = useDailyTasks(user?.id, today)
  const { timeline, isLoading: timelineLoading } = useTodayTimeline(user?.id, today)

  // Get completed task keys
  const { data: completedTasks } = useQuery({
    queryKey: ['completed-tasks', user?.id, today],
    queryFn: async () => {
      if (!user?.id) return []
      const { data } = await supabase
        .from('daily_task_status')
        .select('task_key')
        .eq('user_id', user.id)
        .eq('task_date', today)
      return new Set(data?.map((t) => t.task_key) || [])
    },
    enabled: !!user?.id,
  })

  const completedTaskKeys: Set<string> = (completedTasks instanceof Set ? completedTasks : new Set<string>())

  const handleCompleteTask = (task: DailyTask) => {
    completeTask({
      taskKey: task.task_key,
      taskDate: task.task_date,
      taskLabel: task.label,
      taskType: task.type,
      sourceId: task.source_id,
    })
  }

  const handleUncompleteTask = (task: DailyTask) => {
    uncompleteTask({
      taskKey: task.task_key,
      taskDate: task.task_date,
    })
  }

  const handleEditTask = (taskId: string, newTitle: string) => {
    updateManualTask({ taskId, title: newTitle })
  }

  const handleDeleteTask = (task: DailyTask) => {
    if (task.type === 'Manual' && task.source_id) {
      deleteManualTask(task.source_id)
    }
  }

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 md:space-y-12 relative z-10">
        <PageHeader
          title="Dashboard"
          description="Your daily command center"
        />

        <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <SummaryBar summary={summary} isLoading={summaryLoading} />
        </div>

        <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <ActionList
            tasks={tasks}
            completedTaskKeys={completedTaskKeys}
            onCompleteTask={handleCompleteTask}
            onUncompleteTask={handleUncompleteTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCreateManualTask={createManualTask}
            isCompleting={isCompleting}
            isEditing={isUpdating}
            isDeleting={isDeleting}
            isCreating={isCreating}
          />
        </div>

        <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <Timeline entries={timeline} isLoading={timelineLoading} />
        </div>
      </div>
    </PageTransition>
  )
}


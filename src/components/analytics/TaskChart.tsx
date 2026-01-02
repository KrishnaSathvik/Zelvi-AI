import { TaskData } from '../../hooks/useAnalytics'
import MultiLineChart from './charts/MultiLineChart'
import { CheckCircle2 } from 'lucide-react'

interface TaskChartProps {
  data: TaskData[]
}

export default function TaskChart({ data }: TaskChartProps) {
  if (!data || data.length === 0) {
    return (
      <MultiLineChart
        data={[]}
        lines={[
          { dataKey: 'created', color: '#84cc16', label: 'Created' },
          { dataKey: 'completed', color: '#22c55e', label: 'Completed' },
        ]}
        xKey="date"
        title="Task Completion"
        summary="No data available"
        icon={<CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-success" />}
      />
    )
  }

  let chartData = data
    .map((d) => {
      const date = new Date(d.date)
      if (isNaN(date.getTime())) {
        return null
      }
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        created: d.created || 0,
        completed: d.completed || 0,
      }
    })
    .filter((d): d is { date: string; created: number; completed: number } => d !== null)

  // Ensure we have data to display - even if only completed tasks exist
  // If date parsing failed for all entries, use a fallback format
  if (chartData.length === 0 && data.length > 0) {
    chartData = data.map((d) => ({
      date: d.date.includes('T') ? d.date.split('T')[0] : d.date, // Use date as-is if parsing fails
      created: d.created || 0,
      completed: d.completed || 0,
    }))
  }

  const totalCreated = data.reduce((sum, d) => sum + (d.created || 0), 0)
  const totalCompleted = data.reduce((sum, d) => sum + (d.completed || 0), 0)
  const completionRate = totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0
  const daysWithTasks = data.filter((d) => d.created > 0 || d.completed > 0).length
  const avgCreated = daysWithTasks > 0 ? Math.round((totalCreated / daysWithTasks) * 10) / 10 : 0
  const avgCompleted = daysWithTasks > 0 ? Math.round((totalCompleted / daysWithTasks) * 10) / 10 : 0

  // Better summary text
  let summaryText = ''
  if (totalCreated === 0 && totalCompleted === 0) {
    summaryText = 'No tasks tracked in this period'
  } else if (totalCreated === 0) {
    summaryText = `${totalCompleted} completed • Start tracking tasks to see completion rate`
  } else {
    summaryText = `${completionRate}% completion rate • ${avgCompleted.toFixed(1)}/${avgCreated.toFixed(1)} avg per day • ${totalCompleted}/${totalCreated} total`
  }

  return (
    <MultiLineChart
      data={chartData}
      lines={[
        { dataKey: 'created', color: '#84cc16', label: 'Created' },
        { dataKey: 'completed', color: '#22c55e', label: 'Completed' },
      ]}
      xKey="date"
      title="Task Completion"
      summary={summaryText}
      icon={<CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-success" />}
    />
  )
}


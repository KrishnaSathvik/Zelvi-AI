import { JobTimelineData } from '../../hooks/useAnalytics'
import LineChart from './charts/LineChart'
import { TrendingUp } from 'lucide-react'

interface JobTimelineChartProps {
  data: JobTimelineData[]
}

export default function JobTimelineChart({ data }: JobTimelineChartProps) {
  if (!data || data.length === 0) {
    return (
      <LineChart
        data={[]}
        dataKey="applications"
        xKey="date"
        title="Application Timeline"
        summary="No data available"
        color="#f97316"
        showArea={true}
        icon={<TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />}
      />
    )
  }

  const chartData = data
    .map((d) => {
      const date = new Date(d.date)
      if (isNaN(date.getTime())) {
        return null
      }
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: d.applications || 0,
      }
    })
    .filter((d): d is { date: string; applications: number } => d !== null)

  const total = data.reduce((sum, d) => sum + (d.applications || 0), 0)
  const avgPerDay = data.length > 0 ? Math.round((total / data.length) * 10) / 10 : 0
  const maxInDay = data.length > 0 ? Math.max(...data.map((d) => d.applications || 0), 0) : 0

  return (
    <LineChart
      data={chartData}
      dataKey="applications"
      xKey="date"
      title="Application Timeline"
      summary={`${total} total applications • ${avgPerDay} avg/day • ${maxInDay} max in one day`}
      color="#f97316"
      showArea={true}
      icon={<TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />}
    />
  )
}


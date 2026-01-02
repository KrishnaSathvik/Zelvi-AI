import { ProjectData } from '../../hooks/useAnalytics'
import DonutChart from './charts/DonutChart'
import { FolderKanban } from 'lucide-react'

interface ProjectChartProps {
  data: ProjectData[]
}

const statusLabels: Record<string, string> = {
  planning: 'Planning',
  building: 'Building',
  polishing: 'Polishing',
  deployed: 'Deployed',
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280']

export default function ProjectChart({ data }: ProjectChartProps) {
  const chartData = data.map((d, index) => ({
    name: statusLabels[d.status] || d.status,
    value: d.count,
    color: COLORS[index % COLORS.length],
  }))

  const active = data.filter((d) => d.status !== 'deployed').reduce((sum, d) => sum + d.count, 0)
  const completed = data.filter((d) => d.status === 'deployed').reduce((sum, d) => sum + d.count, 0)
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <DonutChart
      data={chartData}
      title="Projects by Status"
      summary={`${total} total • ${active} active • ${completed} completed`}
      colors={COLORS}
      icon={<FolderKanban className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />}
    />
  )
}


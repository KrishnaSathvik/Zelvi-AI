import { ContentData } from '../../hooks/useAnalytics'
import StackedBarChart from './charts/StackedBarChart'
import { FileText } from 'lucide-react'

interface ContentChartProps {
  data: ContentData[]
}

const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  medium: 'Medium',
  pinterest: 'Pinterest',
  other: 'Other',
}

export default function ContentChart({ data }: ContentChartProps) {
  const chartData = data.map((d) => ({
    platform: platformLabels[d.platform] || d.platform,
    published: d.published,
    inPipeline: d.inPipeline,
  }))

  const totalPublished = data.reduce((sum, d) => sum + d.published, 0)
  const totalInPipeline = data.reduce((sum, d) => sum + d.inPipeline, 0)
  const total = totalPublished + totalInPipeline

  return (
    <StackedBarChart
      data={chartData}
      stacks={[
        { dataKey: 'published', color: '#22c55e', label: 'Published' },
        { dataKey: 'inPipeline', color: '#84cc16', label: 'In Pipeline' },
      ]}
      xKey="platform"
      title="Content by Platform"
      summary={`${total} total • ${totalPublished} published • ${totalInPipeline} in pipeline`}
      icon={<FileText className="w-4 h-4 md:w-5 md:h-5 text-success" />}
    />
  )
}


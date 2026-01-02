import { LearningData } from '../../hooks/useAnalytics'
import BarChart from './charts/BarChart'
import { GraduationCap } from 'lucide-react'

interface LearningChartProps {
  data: LearningData[]
  streak: number
}

const categoryLabels: Record<string, string> = {
  de: 'Data Engineering',
  ai_ml: 'AI/ML',
  genai: 'GenAI',
  rag: 'RAG',
  system_design: 'System Design',
  interview: 'Interview',
  other: 'Other',
}

export default function LearningChart({ data, streak }: LearningChartProps) {
  const chartData = data.map((d) => ({
    category: categoryLabels[d.category] || d.category,
    count: d.count,
  }))

  const totalCount = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <BarChart
      data={chartData}
      dataKey="count"
      xKey="category"
      title="Learning by Category"
      summary={`${totalCount} sessions total • ${streak} day streak`}
      color="#525252"
      highlightColor="#3b82f6"
      useGradient={true}
      icon={<GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />}
    />
  )
}


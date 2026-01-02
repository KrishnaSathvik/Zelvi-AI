import { RecruiterData } from '../../hooks/useAnalytics'
import MultiLineChart from './charts/MultiLineChart'
import { Users } from 'lucide-react'

interface RecruiterChartProps {
  data: RecruiterData[]
}

export default function RecruiterChart({ data }: RecruiterChartProps) {
  if (!data || data.length === 0) {
    return (
      <MultiLineChart
        data={[]}
        lines={[
          { dataKey: 'contacts', color: '#84cc16', label: 'Contacts' },
          { dataKey: 'responses', color: '#22c55e', label: 'Responses' },
        ]}
        xKey="week"
        title="Recruiter Contacts & Responses"
        summary="No data available"
        icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-acid" />}
      />
    )
  }

  const chartData = data
    .map((d) => {
      const date = new Date(d.week)
      if (isNaN(date.getTime())) {
        return null
      }
      const weekLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const responseRate = (d.contacts || 0) > 0 ? Math.round(((d.responses || 0) / (d.contacts || 1)) * 100) : 0
      return {
        week: weekLabel,
        contacts: d.contacts || 0,
        responses: d.responses || 0,
        responseRate: responseRate,
      }
    })
    .filter((d): d is { week: string; contacts: number; responses: number; responseRate: number } => d !== null)

  const totalContacts = data.reduce((sum, d) => sum + (d.contacts || 0), 0)
  const totalResponses = data.reduce((sum, d) => sum + (d.responses || 0), 0)
  const responseRate = totalContacts > 0 ? Math.round((totalResponses / totalContacts) * 100) : 0
  const avgPerWeek = data.length > 0 ? Math.round(totalContacts / data.length) : 0

  return (
    <MultiLineChart
      data={chartData}
      lines={[
        { dataKey: 'contacts', color: '#84cc16', label: 'Contacts' },
        { dataKey: 'responses', color: '#22c55e', label: 'Responses' },
      ]}
      xKey="week"
      title="Recruiter Contacts & Responses"
      summary={`${totalContacts} total contacts • ${avgPerWeek} avg/week • ${responseRate}% overall response rate`}
      icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-acid" />}
    />
  )
}


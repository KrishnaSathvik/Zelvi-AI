import { JobFunnelData } from '../../hooks/useAnalytics'
import BarChart from './charts/BarChart'
import { Briefcase } from 'lucide-react'

interface JobFunnelChartProps {
  data: JobFunnelData
}

export default function JobFunnelChart({ data }: JobFunnelChartProps) {
  const chartData = [
    { name: 'Applied', value: data.applied },
    { name: 'Screener', value: data.screener },
    { name: 'Tech', value: data.tech },
    { name: 'Offer', value: data.offer },
    { name: 'Rejected', value: data.rejected },
  ]

  const total = data.applied
  const reachedInterviews = data.screener + data.tech
  const offers = data.offer
  const interviewRate = total > 0 ? Math.round((reachedInterviews / total) * 100) : 0
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0
  const screenerToOfferRate = reachedInterviews > 0 ? Math.round((offers / reachedInterviews) * 100) : 0

  return (
    <BarChart
      data={chartData}
      dataKey="value"
      xKey="name"
      title="Job Funnel"
      summary={`${total} applied → ${reachedInterviews} interviews (${interviewRate}%) → ${offers} offers (${offerRate}%) • ${screenerToOfferRate}% interview-to-offer rate`}
      color="#525252"
      highlightColor="#84cc16"
      useGradient={true}
      icon={<Briefcase className="w-4 h-4 md:w-5 md:h-5 text-acid" />}
    />
  )
}


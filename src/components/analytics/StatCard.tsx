import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: number
  subtitle?: string
  borderColor?: string
  valueColor?: string
}

export default function StatCard({
  icon,
  label,
  value,
  trend,
  subtitle,
  borderColor = 'border-acid/30',
  valueColor = 'text-acid',
}: StatCardProps) {
  return (
    <div className={`border-2 ${borderColor} p-3 md:p-4 rounded-sm backdrop-blur-modern theme-bg-form theme-border`}>
      <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
        <div className="flex-shrink-0">{icon}</div>
        <span className="text-[10px] md:text-xs text-dim font-mono uppercase truncate">{label}</span>
      </div>
      <div className={`text-xl md:text-2xl font-bold ${valueColor} font-mono mb-1`}>{value}</div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-[10px] md:text-xs font-mono">
          {trend > 0 ? (
            <>
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-success flex-shrink-0" />
              <span className="text-success">+{trend}</span>
            </>
          ) : trend < 0 ? (
            <>
              <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3 text-error flex-shrink-0" />
              <span className="text-error">{trend}</span>
            </>
          ) : (
            <>
              <Minus className="w-2.5 h-2.5 md:w-3 md:h-3 text-dim flex-shrink-0" />
              <span className="text-dim">No change</span>
            </>
          )}
          {subtitle && <span className="text-dim ml-1 hidden sm:inline">{subtitle}</span>}
        </div>
      )}
      {!trend && subtitle && (
        <div className="text-[10px] md:text-xs text-dim font-mono">{subtitle}</div>
      )}
    </div>
  )
}


interface LegendItem {
  label: string
  color: string
}

interface ChartLegendProps {
  items: LegendItem[]
  className?: string
}

export default function ChartLegend({ items, className = '' }: ChartLegendProps) {
  return (
    <div className={`flex flex-wrap items-center gap-4 mt-4 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs font-mono theme-text-main">{item.label}</span>
        </div>
      ))}
    </div>
  )
}


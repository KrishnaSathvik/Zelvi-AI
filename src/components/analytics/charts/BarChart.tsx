import { useEffect, useRef, useState } from 'react'
import ChartBase, { mapValue } from './ChartBase'

interface BarChartProps {
  data: Array<{ [key: string]: string | number }>
  dataKey: string
  xKey: string
  height?: number
  title?: string
  summary?: string
  color?: string
  highlightColor?: string
  showGrid?: boolean
  animate?: boolean
  referenceLine?: number
  referenceLabel?: string
  useGradient?: boolean
  icon?: React.ReactNode
}

export default function BarChart({
  data,
  dataKey,
  xKey,
  height = 300,
  title,
  summary,
  color = '#404040',
  highlightColor = '#84cc16',
  showGrid = true,
  animate = true,
  referenceLine,
  referenceLabel,
  useGradient = true,
  icon,
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; label: string } | null>(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = containerRef.current.offsetHeight
        if (width > 0 && height > 0) {
          setDimensions({ width, height })
        }
      }
    }

    // Use requestAnimationFrame to ensure DOM is laid out
    const rafId = requestAnimationFrame(() => {
      updateDimensions()
    })

    // Use ResizeObserver for better dimension tracking
    let resizeObserver: ResizeObserver | null = null
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateDimensions)
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', updateDimensions)
    
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', updateDimensions)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  if (data.length === 0) {
    return (
      <ChartBase title={title} summary={summary} height={height} icon={icon}>
        <div className="flex items-center justify-center h-full text-dim font-mono text-sm">
          No data available
        </div>
      </ChartBase>
    )
  }

  // Wait for dimensions to be set before rendering
  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <ChartBase title={title} summary={summary} height={height} icon={icon}>
        <div className="w-full h-full" ref={containerRef} style={{ minHeight: `${height}px` }} />
      </ChartBase>
    )
  }

  const padding = 40
  const chartWidth = dimensions.width - padding * 2
  const chartHeight = dimensions.height - padding * 2

  const values = data.map((d) => Number(d[dataKey]))
  const maxValue = Math.max(...values) || 1

  const barWidth = (chartWidth / data.length) * 0.6
  const spacing = chartWidth / data.length

  const handleBarHover = (index: number, e: React.MouseEvent<SVGRectElement>) => {
    setHoveredIndex(index)
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      value: values[index],
      label: String(data[index][xKey]),
    })
  }

  const handleBarLeave = () => {
    setHoveredIndex(null)
    setTooltip(null)
  }

  const chartId = `barChart-${Math.random().toString(36).substr(2, 9)}`

  return (
    <ChartBase title={title} summary={summary} height={height} icon={icon}>
      <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: `${height}px` }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="overflow-visible"
        >
          <defs>
            {useGradient && (
              <>
                <linearGradient id={`${chartId}-gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={highlightColor} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={highlightColor} stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id={`${chartId}-gradient-default`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.5" />
                </linearGradient>
              </>
            )}
          </defs>

          {/* Grid lines */}
          {showGrid && (
            <g>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = mapValue(ratio, 0, 1, dimensions.height - padding, padding)
                return (
                  <line
                    key={ratio}
                    x1={padding}
                    y1={y}
                    x2={dimensions.width - padding}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="opacity-20"
                  />
                )
              })}
            </g>
          )}

          {/* Reference line */}
          {referenceLine !== undefined && referenceLine > 0 && (
            <g>
              <line
                x1={padding}
                y1={mapValue(referenceLine, 0, maxValue, dimensions.height - padding, padding)}
                x2={dimensions.width - padding}
                y2={mapValue(referenceLine, 0, maxValue, dimensions.height - padding, padding)}
                stroke="#84cc16"
                strokeWidth="2"
                strokeDasharray="5 5"
                opacity="0.6"
              />
              {referenceLabel && (
                <text
                  x={dimensions.width - padding - 5}
                  y={mapValue(referenceLine, 0, maxValue, dimensions.height - padding, padding) - 5}
                  fill="#84cc16"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="end"
                  className="opacity-70"
                >
                  {referenceLabel}
                </text>
              )}
            </g>
          )}

          {/* Bars */}
          {data.map((item, i) => {
            const value = Number(item[dataKey])
            const barHeight = mapValue(value, 0, maxValue, 0, chartHeight)
            const x = padding + i * spacing + spacing / 2 - barWidth / 2
            const y = dimensions.height - padding - barHeight
            const isHovered = hoveredIndex === i
            const isLast = i === data.length - 1
            const barColor = isHovered 
              ? '#ffffff' 
              : isLast 
                ? highlightColor 
                : color

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={useGradient 
                    ? (isLast ? `url(#${chartId}-gradient)` : `url(#${chartId}-gradient-default)`)
                    : barColor
                  }
                  stroke={isHovered ? highlightColor : 'none'}
                  strokeWidth={isHovered ? 2 : 0}
                  rx="4"
                  className={animate ? 'grow-bar' : ''}
                  style={
                    animate
                      ? {
                          animationDelay: `${i * 0.05}s`,
                          transformOrigin: 'bottom',
                        }
                      : {}
                  }
                  onMouseEnter={(e) => handleBarHover(i, e)}
                  onMouseLeave={handleBarLeave}
                />
                {/* Value label on top of bar */}
                {value > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    fill={isHovered ? highlightColor : 'currentColor'}
                    fontSize="11"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                    className="opacity-70"
                  >
                    {value}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-50 bg-black/95 backdrop-blur-md border border-cyan-400/30 px-4 py-3 rounded-sm shadow-lg font-mono text-xs"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 50}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-white mb-1.5 text-sm">{tooltip.label}</div>
            <div className="text-cyan-400 font-semibold text-base">{tooltip.value.toLocaleString()}</div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400/30"></div>
          </div>
        )}
      </div>
    </ChartBase>
  )
}


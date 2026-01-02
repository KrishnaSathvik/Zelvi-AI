import { useEffect, useRef, useState } from 'react'
import ChartBase, { mapValue, getBezierPath } from './ChartBase'

interface LineChartProps {
  data: Array<{ [key: string]: string | number }>
  dataKey: string
  xKey: string
  height?: number
  title?: string
  summary?: string
  color?: string
  showGrid?: boolean
  animate?: boolean
  referenceLine?: number
  referenceLabel?: string
  showArea?: boolean
  icon?: React.ReactNode
}

export default function LineChart({
  data,
  dataKey,
  xKey,
  height = 300,
  title,
  summary,
  color = '#84cc16',
  showGrid = true,
  animate = true,
  referenceLine,
  referenceLabel,
  showArea = true,
  icon,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
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
  const chartId = `lineChart-${Math.random().toString(36).substr(2, 9)}`

  const values = data.map((d) => Number(d[dataKey]))
  const minValue = Math.min(...values, 0)
  const maxValue = Math.max(...values) || 1

  // Handle single data point case to avoid division by zero
  const xRange = data.length > 1 ? data.length - 1 : 1

  const points = data.map((d, i) => ({
    x: mapValue(i, 0, xRange, padding, dimensions.width - padding),
    y: mapValue(Number(d[dataKey]), minValue, maxValue, dimensions.height - padding, padding),
    value: Number(d[dataKey]),
    label: String(d[xKey]),
  }))

  const pathD = getBezierPath(points)

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    
    // Find closest point
    const closestPoint = points.reduce((prev, curr) => {
      return Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
    })
    
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      value: closestPoint.value,
      label: closestPoint.label,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <ChartBase title={title} summary={summary} height={height} icon={icon}>
      <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: `${height}px` }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={`${chartId}-gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="50%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
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
          {referenceLine !== undefined && referenceLine >= minValue && referenceLine <= maxValue && (
            <g>
              <line
                x1={padding}
                y1={mapValue(referenceLine, minValue, maxValue, dimensions.height - padding, padding)}
                x2={dimensions.width - padding}
                y2={mapValue(referenceLine, minValue, maxValue, dimensions.height - padding, padding)}
                stroke="#84cc16"
                strokeWidth="2"
                strokeDasharray="5 5"
                opacity="0.6"
              />
              {referenceLabel && (
                <text
                  x={dimensions.width - padding - 5}
                  y={mapValue(referenceLine, minValue, maxValue, dimensions.height - padding, padding) - 5}
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

          {/* Area fill */}
          {showArea && (
            <path
              d={`${pathD} L ${dimensions.width - padding},${dimensions.height - padding} L ${padding},${dimensions.height - padding} Z`}
              fill={`url(#${chartId}-gradient)`}
              className={animate ? 'fade-in' : ''}
            />
          )}

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animate ? 'draw-path' : ''}
          />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#0a0a0a"
                stroke={color}
                strokeWidth="2.5"
                className={animate ? 'fade-in' : ''}
                style={animate ? { animationDelay: `${0.5 + i * 0.1}s` } : {}}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="2"
                fill={color}
                className={animate ? 'fade-in' : ''}
                style={animate ? { animationDelay: `${0.5 + i * 0.1}s` } : {}}
              />
            </g>
          ))}
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


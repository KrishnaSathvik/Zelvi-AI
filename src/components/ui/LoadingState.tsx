
export type LoadingVariant =
  | 'spinner'
  | 'dots'
  | 'pulse'
  | 'bars'
  | 'ring'
  | 'infinity'
  | 'hourglass'
  | 'typing'
  | 'upload'
  | 'progress'

interface LoadingStateProps {
  variant?: LoadingVariant
  size?: number
  className?: string
  color?: string
}

export default function LoadingState({
  variant = 'dots',
  size = 40,
  className = '',
  color = 'currentColor',
}: LoadingStateProps) {
  const baseClasses = 'flex items-center justify-center'
  
  const variants: Record<LoadingVariant, (props: { size: number; color: string }) => JSX.Element> = {
    spinner: ({ size, color }) => (
      <svg width={size} height={size} viewBox="0 0 40 40" className="animate-spin">
        <circle cx="20" cy="20" r="16" stroke="#333" strokeWidth="3" fill="none" />
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray="100"
          strokeDashoffset="60"
          strokeLinecap="round"
        />
      </svg>
    ),
    
    dots: ({ size, color }) => (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="10" cy="20" r="3" fill={color}>
          <animate attributeName="cy" values="20;15;20" dur="0.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="20" cy="20" r="3" fill={color}>
          <animate attributeName="cy" values="20;15;20" dur="0.6s" begin="0.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="30" cy="20" r="3" fill={color}>
          <animate attributeName="cy" values="20;15;20" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    
    pulse: ({ size, color }) => (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <span
          className="absolute w-3 h-3 rounded-full z-10"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
        <span
          className="absolute w-full h-full border rounded-full opacity-0 animate-[radar_2s_infinite]"
          style={{ borderColor: color }}
        />
        <span
          className="absolute w-full h-full border rounded-full opacity-0 animate-[radar_2s_0.6s_infinite]"
          style={{ borderColor: color }}
        />
      </div>
    ),
    
    bars: ({ size, color }) => (
      <svg width={size} height={size} viewBox="0 0 40 40" style={{ stroke: color, strokeWidth: 2, strokeLinecap: 'round' }}>
        <line x1="12" y1="15" x2="12" y2="25">
          <animate attributeName="y1" values="15;10;15" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y2" values="25;30;25" dur="0.6s" repeatCount="indefinite" />
        </line>
        <line x1="20" y1="15" x2="20" y2="25">
          <animate attributeName="y1" values="15;10;15" dur="0.6s" begin="0.1s" repeatCount="indefinite" />
          <animate attributeName="y2" values="25;30;25" dur="0.6s" begin="0.1s" repeatCount="indefinite" />
        </line>
        <line x1="28" y1="15" x2="28" y2="25">
          <animate attributeName="y1" values="15;10;15" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
          <animate attributeName="y2" values="25;30;25" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
        </line>
      </svg>
    ),
    
    ring: ({ size, color }) => (
      <svg className="w-10 h-10 animate-spin-slow" viewBox="25 25 50 50" style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r="20" fill="none" stroke="#333" strokeWidth="4" />
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          style={{ animation: 'ring-dash 1.5s ease-in-out infinite' }}
        />
      </svg>
    ),
    
    infinity: ({ size, color }) => (
      <svg width={size * 2} height={size} viewBox="0 0 60 30">
        <path
          d="M15,15 C15,5 25,5 30,15 C35,25 45,25 45,15 C45,5 35,5 30,15 C25,25 15,25 15,15 Z"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="100"
          style={{ animation: 'dash-draw 2s linear infinite' }}
        />
      </svg>
    ),
    
    hourglass: ({ size, color }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ stroke: color, strokeWidth: 1.5, fill: 'none' }}
        className="animate-spin-slow"
      >
        <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </svg>
    ),
    
    typing: ({ size, color }) => (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="#333" strokeWidth="1.5" />
        <circle cx="8" cy="12" r="1" fill={color}>
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0s" repeatCount="indefinite" />
        </circle>
        <circle cx="12" cy="12" r="1" fill={color}>
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="16" cy="12" r="1" fill={color}>
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    
    upload: ({ size, color }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ stroke: color, strokeWidth: 1.5, fill: 'none', overflow: 'visible' }}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#555" />
        <g style={{ animation: 'upload-arrow 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}>
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </g>
      </svg>
    ),
    
    progress: ({ size, color }) => (
      <svg width={size} height={size} viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="20" cy="20" r="16" stroke="#222" strokeWidth="4" fill="none" />
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray="100"
          strokeDashoffset="25"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="100; 20"
            dur="2s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.16 1 0.3 1"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    ),
  }

  const VariantComponent = variants[variant]

  return (
    <div className={`${baseClasses} ${className}`}>
      <VariantComponent size={size} color={color} />
    </div>
  )
}


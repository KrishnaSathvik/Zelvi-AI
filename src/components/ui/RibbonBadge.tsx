import { HTMLAttributes, ReactNode } from 'react'

interface RibbonBadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
}

export default function RibbonBadge({
  children,
  position = 'top-right',
  className = '',
  ...props
}: RibbonBadgeProps) {
  const positionClasses = {
    'top-right': 'top-3 right-[-30px] rotate-45',
    'top-left': 'top-3 left-[-30px] -rotate-45',
    'bottom-right': 'bottom-3 right-[-30px] -rotate-45',
    'bottom-left': 'bottom-3 left-[-30px] rotate-45',
  }

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      <div
        className={`absolute ${positionClasses[position]} bg-cyan-400 text-black text-[10px] font-bold px-10 py-1 border-y border-black z-10 shadow-[0_5px_10px_rgba(0,0,0,0.5)] tracking-widest`}
      >
        {children}
      </div>
    </div>
  )
}


import { HTMLAttributes, ReactNode, AnchorHTMLAttributes } from 'react'

interface BaseCardProps {
  children: ReactNode
  variant?: 'default' | 'glassmorphism' | 'light' | 'corner'
  hover?: boolean
  showCorners?: boolean
  className?: string
}

interface CardProps extends BaseCardProps, Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  as?: 'div'
  href?: never
}

interface CardLinkProps extends BaseCardProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  as: 'a'
  href: string
}

type CardComponentProps = CardProps | CardLinkProps

export default function Card({
  children,
  variant = 'default',
  hover = false,
  showCorners = false,
  className = '',
  as,
  ...props
}: CardComponentProps) {
  const baseClasses = 'transition-elevation relative block overflow-hidden'
  
  const variantClasses = {
    default: 'border-2 shadow-card shadow-card-hover rounded-sm backdrop-blur-modern',
    glassmorphism: 'bg-gradient-card backdrop-blur-xl border border-white/20 shadow-elevation-3 rounded-lg',
    light: 'border-2 shadow-card shadow-card-hover rounded-sm backdrop-blur-modern',
    corner: 'border-2 shadow-card shadow-card-hover group rounded-sm backdrop-blur-modern',
  }
  
  const hoverClasses = hover ? 'hover:shadow-card-hover hover:-translate-y-1 hover:scale-[1.02] cursor-pointer' : ''
  
  const cornerAccents = (showCorners || variant === 'corner') && (
    <>
      <svg
        className="absolute top-0 left-0 w-4 h-4 text-cyan-400 transition-all duration-300 group-hover:scale-110"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M1 19V1H19" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-4 h-4 text-dim group-hover:text-cyan-400 transition-all duration-300 group-hover:scale-110"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 1V19H1" />
      </svg>
    </>
  )
  
  // Subtle background pattern for glassmorphism variant
  const backgroundPattern = variant === 'glassmorphism' && (
    <div className="absolute inset-0 opacity-[0.03] bg-pattern-grid pointer-events-none" />
  )

  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`

  if (as === 'a' || 'href' in props) {
    return (
      <a
        className={`${classes} theme-bg-form theme-border`}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {backgroundPattern}
        {cornerAccents}
        <div className="relative z-10">{children}</div>
      </a>
    )
  }

  return (
    <div 
      className={`${classes} theme-bg-form theme-border`}
      {...(props as HTMLAttributes<HTMLDivElement>)}
    >
      {backgroundPattern}
      {cornerAccents}
      <div className="relative z-10">{children}</div>
    </div>
  )
}


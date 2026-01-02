import { ButtonHTMLAttributes, ReactNode, useState, useRef } from 'react'
import LoadingState from './LoadingState'
import Icon from './Icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'glassmorphism' | 'yellow-gradient' | 'arrow' | 'gradient' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  success?: boolean
  showArrow?: boolean
  ripple?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  loading = false,
  success = false,
  showArrow = false,
  ripple = true,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rippleIdRef = useRef(0)
  
  const baseClasses = 'font-medium transition-smooth disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const variantClasses = {
    primary: 'bg-gradient-lime hover:shadow-lime-glow text-black border-2 shadow-hard shadow-hard-hover shadow-hard-active font-mono uppercase hover:scale-[1.02] active:scale-[0.98]',
    glassmorphism: 'bg-gradient-card backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:shadow-elevation-3',
    'yellow-gradient': 'bg-gradient-to-r from-[#FFEBB1] to-[#FFC438] text-primary-dark border-2 theme-border shadow-hard hover:shadow-elevation-3 hover:scale-[1.02]',
    arrow: 'bg-transparent hover:bg-white/5 border border-white/20 text-white hover:border-white/40 font-mono uppercase group hover:shadow-elevation-2',
    gradient: 'bg-gradient-lime hover:bg-gradient-accent text-black border-2 theme-border shadow-elevation-2 hover:shadow-lime-glow font-mono uppercase transition-all hover:scale-[1.02] active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-cyan-400/10 border-2 border-cyan-400 text-cyan-400 hover:text-black hover:bg-cyan-400 font-mono uppercase transition-all hover:shadow-lime-glow hover:scale-[1.02]',
  }
  
  const isDisabled = disabled || loading
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && buttonRef.current && !isDisabled) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = rippleIdRef.current++
      
      setRipples((prev) => [...prev, { x, y, id }])
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
    }
    
    props.onClick?.(e)
  }
  
  return (
    <button
      ref={buttonRef}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={variant === 'primary' || variant === 'gradient' ? { borderColor: 'rgba(255, 255, 255, 0.3)' } : undefined}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '0',
            height: '0',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      <span className="relative z-10 flex items-center gap-2 justify-center">
        {loading ? (
          <>
            <LoadingState variant="spinner" size={16} color={variant === 'primary' || variant === 'gradient' ? '#000' : 'currentColor'} />
            <span>Processing</span>
          </>
        ) : success ? (
          <>
            <Icon name="stat-success" size={16} className="text-success" />
            <span>Saved</span>
          </>
        ) : (
          <>
            {children}
            {showArrow && (
              <Icon
                name="sys-chevron-right"
                size={16}
                className={`transition-transform duration-300 ${variant === 'arrow' ? 'group-hover:translate-x-1' : ''}`}
              />
            )}
          </>
        )}
      </span>
      
      {/* Corner accents for arrow variant */}
      {variant === 'arrow' && !loading && !success && (
        <>
          <svg className="absolute top-0 left-0 w-2 h-2 text-white transition-transform duration-300 group-hover:scale-110" viewBox="0 0 10 10">
            <path d="M0 10V0H10" stroke="currentColor" fill="none" strokeWidth="2" />
          </svg>
          <svg className="absolute bottom-0 right-0 w-2 h-2 text-white transition-transform duration-300 group-hover:scale-110" viewBox="0 0 10 10">
            <path d="M10 0V10H0" stroke="currentColor" fill="none" strokeWidth="2" />
          </svg>
        </>
      )}
    </button>
  )
}


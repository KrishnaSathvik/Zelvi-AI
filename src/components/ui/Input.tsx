import { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react'
import Icon, { IconName } from './Icon'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: IconName
  rightIcon?: IconName
  onRightIconClick?: () => void
  showSuccess?: boolean
  floatingLabel?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconClick,
      showSuccess = false,
      floatingLabel = false,
      className = '',
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!value || !!props.defaultValue)
    const hasLeftIcon = !!leftIcon
    const hasRightIcon = !!rightIcon
    const showSuccessIcon = showSuccess && !error && value

    useEffect(() => {
      setHasValue(!!value)
    }, [value])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      props.onBlur?.(e)
    }

    const isFloatingActive = floatingLabel && (isFocused || hasValue)

    return (
      <div className="flex flex-col">
        {label && !floatingLabel && (
          <label className="block text-sm font-medium font-mono text-xs uppercase mb-1" style={{ color: 'var(--text-main)' }}>
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          {hasLeftIcon && (
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${
              floatingLabel && isFloatingActive ? 'pt-5' : ''
            }`}>
              <Icon
                name={leftIcon}
                size={16}
                className={`transition-colors ${
                  error
                    ? 'text-error'
                    : showSuccessIcon
                    ? 'text-success'
                    : isFocused
                    ? 'text-cyan-400'
                    : ''
                }`}
                style={!error && !showSuccessIcon && !isFocused ? { color: 'var(--text-muted)' } : undefined}
              />
            </div>
          )}
          {floatingLabel && label && (
            <label
              className={`absolute left-3 font-mono text-xs uppercase transition-all duration-300 pointer-events-none ${
                hasLeftIcon ? 'left-9' : ''
              } ${
                isFloatingActive
                  ? 'top-1.5 text-xs text-cyan-400'
                  : 'top-1/2 -translate-y-1/2 text-sm'
              }`}
              style={!isFloatingActive ? { color: 'var(--text-muted)' } : undefined}
            >
              {label}
              {props.required && <span className="text-error ml-1">*</span>}
            </label>
          )}
          <input
            ref={ref}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full font-mono text-sm focus:outline-none transition-smooth ${
              hasLeftIcon ? (floatingLabel ? 'pl-9' : 'pl-9') : 'pl-3'
            } ${hasRightIcon || showSuccessIcon ? 'pr-9' : 'pr-3'} ${
              floatingLabel ? 'pt-6 pb-2' : 'py-2'
            } border-2 rounded-sm ${
              error
                ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(255,51,0,0.1)]'
                : showSuccessIcon
                ? 'border-success focus:border-success focus:shadow-[0_0_0_3px_rgba(0,204,102,0.1)]'
                : 'focus:border-cyan-400 focus:shadow-[0_0_0_3px_rgba(0,217,255,0.15)]'
            } ${className}`}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: error ? undefined : showSuccessIcon ? undefined : 'var(--border-main)',
              color: 'var(--text-main)',
              ...props.style
            }}
            {...props}
          />
          {hasRightIcon && !showSuccessIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700/50 rounded transition-colors"
              tabIndex={-1}
            >
              <Icon name={rightIcon} size={18} className="hover:text-cyan-400 transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            </button>
          )}
          {showSuccessIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="stat-success" size={16} className="text-success animate-pop" />
            </div>
          )}
        </div>
        {error && (
          <div className="mt-1 text-xs text-error font-mono animate-fade flex items-center gap-1">
            <Icon name="stat-error" size={12} />
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input


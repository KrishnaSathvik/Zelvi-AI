import { Component, ErrorInfo, ReactNode } from 'react'
import { logger } from '../../lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo)
    // TODO: Send to error tracking service (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen theme-bg-page flex items-center justify-center p-4">
          <div className="max-w-md w-full theme-border border-2 rounded-lg p-6 space-y-4">
            <div className="text-2xl font-bold font-mono text-red-400">
              Something went wrong
            </div>
            <div className="text-sm font-mono theme-text-secondary">
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="w-full px-4 py-2 bg-cyan-400 text-black font-mono font-semibold rounded-lg hover:bg-cyan-300 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}


import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger } from './logger'

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should log in development mode', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    logger.log('test message')
    // In test environment, it should log
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should always log errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    logger.error('error message')
    expect(consoleSpy).toHaveBeenCalledWith('error message')
    consoleSpy.mockRestore()
  })
})


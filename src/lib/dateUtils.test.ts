import { describe, it, expect } from 'vitest'
import { getTodayLocal } from './dateUtils'

describe('dateUtils', () => {
  describe('getTodayLocal', () => {
    it('should return today\'s date in YYYY-MM-DD format', () => {
      const today = getTodayLocal()
      const expected = new Date().toISOString().split('T')[0]
      expect(today).toBe(expected)
    })

    it('should return a valid date string', () => {
      const today = getTodayLocal()
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      expect(today).toMatch(dateRegex)
    })
  })
})


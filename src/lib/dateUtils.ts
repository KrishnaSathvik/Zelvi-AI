/**
 * Date utility functions that work in local timezone
 * to avoid timezone conversion issues
 */

/**
 * Format a Date object as YYYY-MM-DD in local timezone
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get today's date as YYYY-MM-DD in local timezone
 */
export function getTodayLocal(): string {
  return formatDateLocal(new Date())
}

/**
 * Parse a YYYY-MM-DD string to a Date object in local timezone
 */
export function parseDateLocal(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}


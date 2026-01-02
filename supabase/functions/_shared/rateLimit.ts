/**
 * Simple in-memory rate limiting for Edge Functions
 * For production, consider using Redis or Supabase's built-in rate limiting
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (resets on function restart)
// In production, use Redis or database-backed rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export function checkRateLimit(
  userId: string,
  config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 } // 10 requests per minute default
): { allowed: boolean; remaining: number; resetAt: number } {
  const key = userId
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    // Create new window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    }
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetTime,
  }
}

// AI endpoints need stricter limits
export const AI_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 20, // 20 requests
  windowMs: 60000, // per minute
}

// General endpoints
export const GENERAL_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100, // 100 requests
  windowMs: 60000, // per minute
}


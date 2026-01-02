// PWA utilities for service worker registration and install prompts

import { logger } from './logger'

let deferredPrompt: BeforeInstallPromptEvent | null = null
let installPromptShown = false

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      logger.log('Service Worker registered:', registration)

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              logger.log('New service worker available')
              // You can show a notification here to prompt user to refresh
            }
          })
        }
      })

      return registration
    } catch (error) {
      logger.error('Service Worker registration failed:', error)
      return null
    }
  }
  return null
}

/**
 * Handle install prompt
 */
export function handleInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    installPromptShown = false
    
    // Track that install prompt is available/shown
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'pwa_install_prompt_shown')
    }
  })
}

/**
 * Show install prompt
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    return false
  }

  if (installPromptShown) {
    return false
  }

  try {
    // Track that we're showing the prompt
    if (typeof window !== 'undefined' && (window as any).gtag && !installPromptShown) {
      ;(window as any).gtag('event', 'pwa_install_prompt_shown')
    }
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      logger.log('User accepted install prompt')
      // Track install event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'pwa_installed')
      }
    } else {
      logger.log('User dismissed install prompt')
    }

    deferredPrompt = null
    installPromptShown = true
    return outcome === 'accepted'
  } catch (error) {
    logger.error('Error showing install prompt:', error)
    return false
  }
}

/**
 * Check if app is installed
 */
export function isInstalled(): boolean {
  if (typeof window === 'undefined') return false

  // Check if running in standalone mode
  if (
    (window.navigator as any).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  ) {
    return true
  }

  return false
}

/**
 * Check if app is installable
 */
export function isInstallable(): boolean {
  return deferredPrompt !== null && !installPromptShown
}

/**
 * Detect offline status
 */
export function detectOfflineStatus(
  callback: (isOffline: boolean) => void
): () => void {
  const updateOnlineStatus = () => {
    const isOffline = !navigator.onLine
    callback(isOffline)
  }

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)

  // Initial check
  updateOnlineStatus()

  // Return cleanup function
  return () => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  }
}

/**
 * Initialize PWA features
 */
export function initPWA() {
  // Register service worker
  if (typeof window !== 'undefined') {
    registerServiceWorker()
    handleInstallPrompt()
  }
}


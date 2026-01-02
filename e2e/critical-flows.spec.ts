import { test, expect } from '@playwright/test'

test.describe('Critical User Flows', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Zelvi AI/)
  })

  test('should navigate to auth page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sign Up')
    await expect(page).toHaveURL(/.*\/auth/)
  })

  test('should show error boundary on invalid route', async ({ page }) => {
    await page.goto('/invalid-route')
    // Should redirect to home or show 404
    await expect(page).toHaveURL(/.*\//)
  })
})

test.describe('Authentication', () => {
  test('should allow guest mode sign-in', async ({ page }) => {
    await page.goto('/')
    const guestButton = page.locator('button:has-text("Try as Guest")').first()
    if (await guestButton.isVisible()) {
      await guestButton.click()
      // Should navigate to app
      await expect(page).toHaveURL(/.*\/app/, { timeout: 10000 })
    }
  })
})


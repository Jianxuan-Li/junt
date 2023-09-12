import { test, expect } from '@playwright/test'
import 'dotenv/config'

test('open linkedin', async ({ page, context }) => {
  await page.goto('https://www.linkedin.com')
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByText(process.env.LINKEDIN_NAME || '')).toBeVisible()
})

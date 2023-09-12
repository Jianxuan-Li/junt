import { test as setup, expect } from '@playwright/test'
import 'dotenv/config'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  if (!process.env.LINKEDIN_USERNAME || !process.env.LINKEDIN_PASSWORD || !process.env.LINKEDIN_NAME) {
    throw new Error('Please provide linkedin username and password')
  }

  // username input id: session_key
  // password input id: session_password
  await page.goto('https://www.linkedin.com')
  await page.fill('#session_key', process.env.LINKEDIN_USERNAME || '')
  await page.fill('#session_password', process.env.LINKEDIN_PASSWORD || '')
  await page.click('.sign-in-form__submit-btn--full-width')

  // End of authentication steps.
  await page.context().storageState({ path: authFile })
})

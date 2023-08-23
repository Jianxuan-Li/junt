import { test, expect } from './fixtures'

test('popup page', async ({ page, extensionId }) => {
  // chrome-extension://ofgimnfoihdgacaommcakoeldinmjdma/popup.html
  await page.goto(`chrome-extension://${extensionId}/popup.html`)

  // right nav should be visible, and have at least 4 items (List, Form, Settings, About), maybe 5 (Refresh/Sync)
  await page.locator('div.rightNav').first().waitFor()
  expect(await page.locator('div.navItem').count()).toBeGreaterThanOrEqual(4)
})

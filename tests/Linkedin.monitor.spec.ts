import { Builder, By, Key, until } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import assert from 'assert'
import 'dotenv/config'
import { WebDriver } from 'selenium-webdriver'

// lunch browser with debugger port
/*
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=27011 --user-data-dir=/Users/jack/Work/freeyeti/junt/tmp/chrome-tests
*/

// linkedin job search monitor
// to determine if doms are changed

// job search url: https://www.linkedin.com/jobs/search/?distance=25&geoId=105149290&keywords=Python
const jobSearchUrl = 'https://www.linkedin.com/jobs/search/?distance=25&geoId=105149290&keywords=Python'

const binPath = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const dataDir = process.env.CHROME_DATA
const debuggerPort = process.env.CHROME_PORT || '9222'
const debuggerAddress = `localhost:${debuggerPort}`

describe('Linkedin Monitor', () => {
  it('check elements', async () => {
    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new Options().setChromeBinaryPath(binPath))
      // .setChromeOptions(new Options().headless())
      .setChromeOptions(new Options().addArguments(`user-data-dir=${dataDir}`))
      .setChromeOptions(new Options().debuggerAddress(debuggerAddress))
      .build()
    driver.manage().window().maximize()
    driver.manage().setTimeouts({ implicit: 3000 })

    await driver.get(jobSearchUrl)
    await driver.sleep(2000)

    await driver.wait(until.elementLocated(By.css('.scaffold-layout__list-container')), 30000)
    {
      const elements = await driver.findElements(By.css('.scaffold-layout__list-container'))
      assert(elements.length)
    }
    await driver.wait(
      until.elementLocated(By.css('.jobs-search-two-pane__job-card-container--viewport-tracking-0')),
      30000,
    )
    {
      const elements = await driver.findElements(By.css('.artdeco-entity-lockup__content'))
      assert(elements.length)
    }
    {
      const elements = await driver.findElements(By.css('.job-card-container__primary-description'))
      assert(elements.length)
    }
    await driver.wait(until.elementLocated(By.css('.jobs-unified-top-card__primary-description')), 30000)
    {
      const elements = await driver.findElements(By.css('.jobs-unified-top-card__job-title'))
      assert(elements.length)
    }

    await driver.quit()
  })
})

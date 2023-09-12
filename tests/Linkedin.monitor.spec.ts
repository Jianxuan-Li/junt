import { Builder, By, Key, until } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import assert from 'assert'
import 'dotenv/config'

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

describe('Linkedin Job Search Monitor', () => {
  it('should have the right title', async () => {
    ;(async function helloSelenium() {
      let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new Options().setChromeBinaryPath(binPath))
        .setChromeOptions(new Options().headless())
        .setChromeOptions(new Options().addArguments(`user-data-dir=${dataDir}`))
        .setChromeOptions(new Options().debuggerAddress(debuggerAddress))
        .build()

      driver.manage().window().maximize()

      await driver.get(jobSearchUrl)
      await driver.sleep(2000)

      // title matches '.*Python Jobs | LinkedIn'
      const title = await driver.getTitle()
      assert(title.match(/.*Python Jobs \| LinkedIn/))

      await driver.quit()
    })()
  })
})

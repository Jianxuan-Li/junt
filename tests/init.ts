import { Builder, By, Key, until, Capabilities } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import 'dotenv/config'
import { WebDriver } from 'selenium-webdriver'
import fs from 'fs'

// lunch browser with debugger port
/*
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=27011 --user-data-dir=/Users/jack/Work/freeyeti/junt/tmp/chrome-tests
*/

const binPath = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const dataDir = process.env.CHROME_DATA
const debuggerPort = process.env.CHROME_PORT || '27011'
const debuggerAddress = `localhost:${debuggerPort}`

const createLocalDriver = async (): Promise<WebDriver> => {
  let builder = new Builder()
  builder.forBrowser('chrome')
  builder.setChromeOptions(new Options().setChromeBinaryPath(binPath))
  // builder.setChromeOptions(new Options().headless())
  builder.setChromeOptions(new Options().addArguments(`user-data-dir=${dataDir}`))
  builder.setChromeOptions(new Options().debuggerAddress(debuggerAddress))

  return await builder.build()
}

const main = async () => {
  let driver = await createLocalDriver()
  await driver.manage().window().maximize()

  await driver.get('https://linkedin.com/jobs')

  // get all cookies
  const cookies = await driver.manage().getCookies()

  // sleep 5 seconds to wait for cookies to be saved
  await driver.sleep(5000)

  console.log(cookies)

  // save to tmp/cookies.json
  fs.writeFileSync('tmp/cookies.json', JSON.stringify(cookies, null, 2))

  await driver.quit()
}

main()

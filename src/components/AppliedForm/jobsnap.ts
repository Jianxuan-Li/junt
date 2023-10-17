import { snapGlassdoor } from './snapfuncs/glassdoor'
import { snapLinkedin } from './snapfuncs/linkedin'
import { snapLinkedinDetail } from './snapfuncs/linkedinDetail'
const urlMap = new Map<string, string>()

urlMap.set('linkedin.com/jobs/search/', 'linkedinList')
urlMap.set('linkedin.com/jobs/collections/', 'linkedinList')
urlMap.set('linkedin.com/jobs/view/', 'linkedinDetail')
urlMap.set('glassdoor.ca/Job', 'glassdoorList')
urlMap.set('glassdoor.com/Job', 'glassdoorList')

const supportedSite = (url: string): string | null => {
  let site = null
  urlMap.forEach((value, key) => {
    if (url.includes(key)) {
      site = value
      return
    }
  })
  return site
}

// do query to get company name and position
// send message to background script
export const query = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0]

    // // supported urls:
    let site = supportedSite(tab.url || '')
    if (site === null) return

    let snap = null

    switch (site) {
      case 'linkedinList':
        snap = snapLinkedin
        break
      case 'glassdoorList':
        snap = snapGlassdoor
        break
      case 'linkedinDetail':
        snap = snapLinkedinDetail
        break
      default:
        return
    }

    // execute script on tab
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: snap,
      })
      .then(() => {})
      .catch(() => {})
  })
}

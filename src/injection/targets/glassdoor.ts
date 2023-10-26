import { AppliedMap, AppliedMapValue } from '@/types/appliedJob'
import { InjectionTarget } from '../interfaces'
import * as urls from '@/constants/allowedSites'
import { createBadge, badgeSelector } from '../badgeUtil'
import { waitForElementToExist } from '../domUtil'

export default class GlassdoorTarget implements InjectionTarget {
  // for interface
  url: string
  allowedUrls: string[] = [urls.GLASSDOOR_JOBS_CA, urls.GLASSDOOR_JOBS_COM]
  appliedMap: AppliedMap = new Map()

  // for this class
  observer: MutationObserver | null = null
  ulObserver: MutationObserver | null = null
  jobListElementType: string = 'ul'
  jobListElementClass: string = 'JobsList_jobsList'
  jobListElement: HTMLElement | null = null

  constructor(url: string) {
    this.url = url
  }

  public setAppliedMap(appliedMap: AppliedMap): void {
    this.appliedMap = appliedMap
  }

  public isInjectable(): boolean {
    for (const allowedUrl of this.allowedUrls) {
      if (this.url.includes(allowedUrl)) {
        return true
      }
    }

    return false
  }

  private showAppliedBadge = (element: HTMLElement): void => {
    if (!element) return
    const baseElement = element
    const listItems = baseElement.querySelectorAll('li')
    for (const item of listItems) {
      const itemElement = item.querySelectorAll('div')
      if (!itemElement) continue

      let companyName: string | null = ''
      let companyElement: HTMLElement | null = null

      itemElement.forEach((element) => {
        const id = element.getAttribute('id')
        if (id && id.includes('job-employer')) {
          companyName = element.firstChild?.textContent || null
          if (!companyName) {
            companyName = element.firstChild?.nextSibling?.firstChild?.textContent || ''
          }
          companyElement = element.parentElement
          return
        }
      })

      if (!companyName || !companyElement) continue

      companyName = companyName.toLowerCase()

      const applied = this.appliedMap.get(companyName)
      const badge = companyElement.querySelector(badgeSelector)
      if (applied && !badge) {
        const badgeElement = createBadge(applied)
        companyElement.appendChild(badgeElement)
      }
    }
  }

  // inject badges to search list
  private injectToSearchList = (ul: HTMLUListElement): void => {
    // the first time to inject
    this.showAppliedBadge(ul)

    // since glassdoor use react, the ul element will be changed when user scroll down
    //  or user click `show more` button, so we need to observe the ul element
    const config = { attributes: false, childList: true, subtree: false }
    const callback = (mutationList: MutationRecord[]) => {
      this.showAppliedBadge(ul)
    }
    this.ulObserver = new MutationObserver(callback)
    this.ulObserver.observe(ul, config)
  }

  // inject badges to job list on index (e.g. https://www.glassdoor.ca/Job/index.htm)
  private indexInjector = (): void => {
    const targetNode = document.getElementById('__next')
    const config = { attributes: true, childList: true, subtree: true }

    // Callback function to execute when mutations are observed
    // this observer is to detect the job list element, which is a ul element
    const callback = (mutationList: MutationRecord[]) => {
      const ul = document.querySelectorAll('ul')
      let found = false
      for (const element of ul) {
        element.classList.forEach((className) => {
          if (className.includes(this.jobListElementClass)) {
            this.injectToSearchList(element)
            this.jobListElement = element
            found = true
            // disconnect current observer, use ul observer instead to reduce performance impact
            this.observer?.disconnect()
            return
          }
        })
        if (found) break
      }
    }
    this.observer = new MutationObserver(callback)
    this.observer.observe(targetNode, config)
  }

  // inject badges to search result page (e.g. https://www.glassdoor.ca/Job/software-developer-jobs-SRCH_KO0,18.htm)
  // 2023-10-26 update: glassdoor now using same page as index page
  private searchResultInjector = async (): Promise<void> => {
    const ul = await waitForElementToExist('article#MainCol ul')
    if (ul.length === 0) return

    const ule = ul[0] as HTMLUListElement

    this.injectToSearchList(ule)
    this.jobListElement = ule
  }

  public inject(): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        const currentUrl = window.location.href
        if (currentUrl.includes('/Job')) {
          this.indexInjector()
          resolve()
          return
        }

        // other wise, stop injection
        this.destory()
      } catch (e) {}

      // always resolve
      resolve()
    })
  }

  public destory = (): void => {
    // glassdoor doesn't need to destroy since the url will change by link click
    // but in case it's needed in the future
    this.observer?.disconnect()
    this.ulObserver?.disconnect()
  }

  public updateInjection = (): void => {
    this.showAppliedBadge(this.jobListElement as HTMLElement)
  }
}

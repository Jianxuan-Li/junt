import { InjectionTarget } from '../interfaces'
import * as urls from '@/constants/allowedSites'
import { AppliedMap } from '@/types/appliedJob'
import moment from 'moment'

export default class LinkedinTarget implements InjectionTarget {
  url: string
  allowedUrls: string[] = [urls.LINKEDIN_JOBS_SEARCH, urls.LINKEDIN_JOBS_COLLECTIONS]
  appliedMap: AppliedMap = new Map()
  targetClass = 'jobs-unified-top-card__primary-description'
  listElement = 'ul.scaffold-layout__list-container'
  observer: MutationObserver | null = null
  waitForElementInterval: number | null = null

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

  private waitForElement(selector: string, maxRetry: number = 10): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.waitForElementInterval = setInterval(() => {
        const element = document.querySelector(selector)
        maxRetry--
        if (element) {
          clearInterval(this.waitForElementInterval)
          resolve(true)
        }
        if (maxRetry <= 0) {
          clearInterval(this.waitForElementInterval)
          resolve(false)
        }
      }, 1000)
    })
  }

  private async injectToSearchList() {
    const baseElement = document.querySelector(this.listElement)
    const listItems = baseElement.querySelectorAll('li')
    for (const item of listItems) {
      const companyElement = item.querySelector('span.job-card-container__primary-description')
      if (companyElement) {
        const companyName = (companyElement as HTMLElement).innerText
        const applied = this.appliedMap.get(companyName)
        const badge = item.querySelector('div.juntInjectedAppliedBadge')
        if (applied && !badge) {
          const badge = document.createElement('div')
          badge.classList.add('juntInjectedAppliedBadge')
          badge.innerHTML = `Junt: You applied ${applied.title}`
          badge.innerHTML += `<br />on ${moment(Date.parse(applied.datetime)).format('dddd, MM Do YYYY, h:mm')}`
          const targetDom = item.querySelector('div.artdeco-entity-lockup__content')
          targetDom.insertBefore(badge, targetDom.lastChild)
        }
      }
    }
  }

  public inject(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!(await this.waitForElement(this.listElement))) {
          return
        }

        this.injectToSearchList()

        // use MutationObserver to detect changes in the DOM
        // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        const targetNode = document.querySelector(this.listElement)
        const config = { childList: true }
        const callback = (mutationsList: MutationRecord[], observer: MutationObserver) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
              this.injectToSearchList()
            }
          }
        }
        const observer = new MutationObserver(callback)
        observer.observe(targetNode, config)
        this.observer = observer
      } catch (error) {}
      resolve()
    })
  }

  public disinjected(): void {
    const badge = document.querySelectorAll('div.juntInjectedAppliedBadge')
    for (const b of badge) {
      b.remove()
    }
  }

  public updateInjection(): void {
    this.injectToSearchList()
  }

  public destory(): void {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.waitForElementInterval) {
      clearInterval(this.waitForElementInterval)
    }
    this.disinjected()
  }
}

import { InjectionTarget } from '../interfaces'
import * as urls from '@/constants/allowedSites'
import { AppliedMap } from '@/types/appliedJob'
import dayjs from 'dayjs'

export default class LinkedinTarget implements InjectionTarget {
  url: string
  allowedUrls: string[] = [urls.LINKEDIN_JOBS_SEARCH, urls.LINKEDIN_JOBS_COLLECTIONS]
  appliedMap: AppliedMap = new Map()

  listElement: string = 'ul.scaffold-layout__list-container'
  appliedBadgeElement: string = 'div.juntInjectedAppliedBadge'
  appliedBadgeParentElement: string = 'div.artdeco-entity-lockup__content'
  companyNameElement: string = 'span.job-card-container__primary-description'

  listObserver: MutationObserver | null = null
  detailObserver: MutationObserver | null = null
  waitForElementInterval: number | ReturnType<typeof setInterval> | null = null

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
      const companyElement = item.querySelector(this.companyNameElement)
      if (companyElement) {
        const companyName = (companyElement as HTMLElement).innerText
        const applied = this.appliedMap.get(companyName.toLowerCase())
        const badge = item.querySelector(this.appliedBadgeElement)
        if (applied && !badge) {
          const badge = document.createElement('div')
          badge.classList.add(this.appliedBadgeElement.split('.')[1])
          if (applied.title) {
            badge.innerHTML = `Junt: You applied ${applied.title}`
            badge.innerHTML += `<br />on ${dayjs(applied.datetime).format('dddd, MM D YYYY, h:mm')}`
          } else {
            badge.innerHTML = `Junt: You applied on ${dayjs(applied.datetime).format('dddd, MM D YYYY, h:mm')}`
          }
          const targetDom = item.querySelector(this.appliedBadgeParentElement)
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
        this.listObserver = new MutationObserver(callback)
        this.listObserver.observe(targetNode, config)
      } catch (error) {}
      resolve()
    })
  }

  public disinjected(): void {
    const badge = document.querySelectorAll(this.appliedBadgeElement)
    for (const b of badge) {
      b.remove()
    }
  }

  public updateInjection(): void {
    this.injectToSearchList()
  }

  public destory(): void {
    if (this.listObserver) this.listObserver.disconnect()
    if (this.detailObserver) this.detailObserver.disconnect()
    if (this.waitForElementInterval) clearInterval(this.waitForElementInterval)
    this.disinjected()
  }
}

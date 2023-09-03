import './injection/inject.css'
import { getFromSyncStorage, getFromLocalStorage } from './libs/storage'
import { SYNC_STORAGE_KEY_SHEET_ID, STORAGE_KEY_APPLIED_LIST } from './constants/storage'
import LinkedinInjector from '@/injection/injectors/linkedin'
import GlassdoorInjector from '@/injection/injectors/glassdoor'
import InjectionFactory from '@/injection/factory'
import { AppliedMap } from '@/types/appliedJob'
import { listToMap } from '@/libs/appliedJobsUtil'

// using factory to create a new instance of a injection class
let injector: null | InjectionFactory = null
let injected: boolean = false

// save current url, remove query string
let currentUrl: string = window.location.href.split('?')[0]

const getInjector = (): null | InjectionFactory => {
  // get domain name from url of current tab
  // the domain name must assigned in manifest.json, see gen-manifest.mjs

  const url = window.location.href
  const domain = url.split('/')[2]
  let selectedInjector: null | InjectionFactory = null
  switch (domain) {
    case 'www.linkedin.com':
    case 'linkedin.com':
      selectedInjector = new LinkedinInjector()
      break
    case 'www.glassdoor.ca':
    case 'www.glassdoor.com':
    case 'glassdoor.ca':
    case 'glassdoor.com':
      selectedInjector = new GlassdoorInjector()
      break
    default:
      break
  }

  return selectedInjector
}

const performInjection = (appliedMap: AppliedMap) => {
  // destroy the old injector
  if (injector) {
    injector.destroy()
    injector = null
  }

  injector = getInjector()

  // if no injector found, exit
  if (!injector) {
    return
  }

  // listen to disconnect message to destroy the injector
  //   user may disconnect from settings page in popup, see src/components/Settings
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'disconnectedGoogleSheet') {
      injector?.destroy()
      injector = null
    }
  })

  // listen to update appliedMap message to update appliedMap
  //   user may add new applied job in popup, see src/components/AppliedForm
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'updateAppliedMap') {
      getFromLocalStorage(STORAGE_KEY_APPLIED_LIST).then((appliedList) => {
        if (appliedList) {
          injector?.setAppliedMap(listToMap(appliedList))
        }
      })
    }
  })

  // inject to the target page
  injected = injector.inject(window.location.href, appliedMap)

  // linkedin uses SPA, so changes in url doesn't trigger page reload,
  // we need to destroy the old injector and create a new one
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'urlUpdated') {
      const newUrl = window.location.href.split('?')[0]

      if (newUrl === currentUrl) {
        return
      }

      currentUrl = newUrl

      // destroy the old injector if user not in the target page or user change the target page
      if (injector) {
        injector.destroy()
        injector = null
      }

      injector = getInjector()
      if (injector) {
        injected = injector.inject(window.location.href, appliedMap)
      } else {
        injected = false
      }
    }
  })
}

const inject = async () => {
  let [sheetId, appliedList] = await Promise.all([
    getFromSyncStorage(SYNC_STORAGE_KEY_SHEET_ID),
    getFromLocalStorage(STORAGE_KEY_APPLIED_LIST),
  ])

  const sheetIdChangedEvent = (request: any) => {
    if (request.message === 'sheetIdUpdated') {
      sheetId = request.sheetId
      appliedList = request.appliedList

      performInjection(listToMap(appliedList))

      // free memory
      appliedList = []
    }
  }

  // listen to connected to google sheet message to perform injection
  // user may connect to google sheet when open a job searching page
  if (!chrome.runtime.onMessage.hasListener(sheetIdChangedEvent)) {
    chrome.runtime.onMessage.addListener(sheetIdChangedEvent)
  }

  if (!sheetId || !appliedList) {
    return
  }
  // set appliedMap for the injector
  const companyMap: AppliedMap = listToMap(appliedList)

  // unset appliedList to free memory
  appliedList = []

  performInjection(companyMap)
}

inject()

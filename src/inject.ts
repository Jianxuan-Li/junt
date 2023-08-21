import './injection/inject.css'
import { getFromSyncStorage, getFromLocalStorage } from './libs/storage'
import { SYNC_STORAGE_KEY_SHEET_ID, STORAGE_KEY_APPLIED_LIST } from './constants/storage'
import LinkedinInjector from '@/injection/injectors/linkedin'
import InjectionFactory from '@/injection/factory'
import { AppliedMap } from '@/types/appliedJob'
import { listToMap } from '@/libs/appliedJobsUtil'

// using factory to create a new instance of a injection class
let injector: null | InjectionFactory = null

const performInjection = (appliedMap: AppliedMap) => {
  // get domain name from url of current tab
  // the domain name must assigned in manifest.json, see gen-manifest.mjs
  const url = window.location.href
  const domain = url.split('/')[2]

  // destroy the old injector
  if (injector) {
    injector.destroy()
    injector = null
  }

  switch (domain) {
    case 'www.linkedin.com':
    case 'linkedin.com':
      injector = new LinkedinInjector()
      break
    default:
      break
  }

  if (!injector) {
    return
  }

  // inject to the target page
  injector.inject(url, appliedMap)

  // listen to disconnect message to destroy the injector
  //   user may disconnect from settings page in popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'disconnectedGoogleSheet') {
      injector?.destroy()
      injector = null
    }
  })

  // listen to update appliedMap message to update appliedMap
  //   user may add new applied job in popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'updateAppliedMap') {
      getFromLocalStorage(STORAGE_KEY_APPLIED_LIST).then((appliedList) => {
        if (appliedList) {
          injector?.setAppliedMap(listToMap(appliedList))
        }
      })
    }
  })
}

const inject = async () => {
  let [sheetId, appliedList] = await Promise.all([
    getFromSyncStorage(SYNC_STORAGE_KEY_SHEET_ID),
    getFromLocalStorage(STORAGE_KEY_APPLIED_LIST),
  ])

  // listen to connected to google sheet message to perform injection
  //   user may connect to google sheet when open a job searching page
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'sheetIdUpdated') {
      sheetId = request.sheetId
      appliedList = request.appliedList

      performInjection(listToMap(appliedList))

      // free memory
      appliedList = []
    }
  })

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

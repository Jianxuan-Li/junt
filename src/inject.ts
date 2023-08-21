import './injection/inject.css'
import { getFromSyncStorage, getFromLocalStorage } from './libs/storage'
import { SYNC_STORAGE_KEY_SHEET_ID, STORAGE_KEY_APPLIED_LIST } from './constants/storage'
import LinkedinInjector from '@/injection/injectors/linkedin'
import InjectionFactory from '@/injection/factory'
import { AppliedMap } from '@/types/appliedJob'

const inject = async () => {
  const [sheetId, appliedList] = await Promise.all([
    getFromSyncStorage(SYNC_STORAGE_KEY_SHEET_ID),
    getFromLocalStorage(STORAGE_KEY_APPLIED_LIST),
  ])

  if (!sheetId || !appliedList) {
    return
  }

  // get domain name from url of current tab
  // the domain name must assigned in manifest.json, see gen-manifest.mjs
  const url = window.location.href
  const domain = url.split('/')[2]

  // using factory to create a new instance of a injection class
  let injector: null | InjectionFactory = null

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

  // set appliedMap for the injector
  const companyMap: AppliedMap = new Map()
  for (const item of appliedList) {
    companyMap.set(item.company, {
      datetime: item.datetime,
      title: item.title,
      id: item.id,
    })
  }

  // inject to the target page
  injector.inject(url, companyMap)
}

inject()

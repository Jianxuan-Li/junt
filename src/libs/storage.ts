import { appliedJob } from '@/types'

export const STORAGE_KEY = 'applied'

export const saveApplied = async (applied: appliedJob): Promise<void> => {
  const appliedList = await getFromSyncStorage(STORAGE_KEY)
  if (appliedList) {
    appliedList.push(applied)
    await saveToSyncStorage(STORAGE_KEY, appliedList)
  } else {
    await saveToSyncStorage(STORAGE_KEY, [applied])
  }
}

export const saveAppliedList = async (appliedList: appliedJob[]): Promise<void> => {
  await saveToSyncStorage(STORAGE_KEY, appliedList)
}

export const getFromSyncStorage = (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get([key], (result) => {
        if (!result[key]) return resolve(null)
        return resolve(result[key])
      })
    } catch (e) {
      reject(e)
    }
  })
}

export const saveToSyncStorage = (key: string, value: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set({ [key]: value }, () => {
        return resolve()
      })
    } catch (e) {
      reject(e)
    }
  })
}

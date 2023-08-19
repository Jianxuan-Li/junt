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

export const saveToLocalStorage = (key: string, value: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ [key]: value }, () => {
        return resolve()
      })
    } catch (e) {
      reject(e)
    }
  })
}

export const getFromLocalStorage = (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([key], (result) => {
        if (!result[key]) return resolve(null)
        return resolve(result[key])
      })
    } catch (e) {
      reject(e)
    }
  })
}

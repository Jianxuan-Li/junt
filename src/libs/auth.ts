export const getGoogleAuthToken = (): Promise<string> => {
  // https://developer.chrome.com/docs/extensions/reference/identity/#method-getAuthToken
  // Chrome automatically caches tokens and automatically refreshes them when needed.
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message)
        return
      }
      resolve(token)
    })
  })
}

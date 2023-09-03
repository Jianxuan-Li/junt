export function waitForElementToExist(selector: string): Promise<NodeListOf<Element>> {
  return new Promise((resolve) => {
    if (document.querySelectorAll(selector)) {
      return resolve(document.querySelectorAll(selector))
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelectorAll(selector))
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    })

    // disconnect after 10 seconds no matter what
    setTimeout(() => {
      observer.disconnect()
    }, 10000)
  })
}

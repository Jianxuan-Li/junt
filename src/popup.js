document.getElementById('read-content').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0]

    function printTitle() {
      const desp = document.querySelectorAll('div.jobs-unified-top-card__primary-description a.app-aware-link')

      if (!desp || desp.length < 1) {
        return 'No description found'
      }

      let company = desp[0].innerText

      ;(async () => {
        const response = await chrome.runtime.sendMessage({ info: company })
        // do something with response here, not outside the function
        console.log(response)
      })()
    }

    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: printTitle,
        //        files: ['contentScript.js'],  // To call external file instead
      })
      .then(() => console.log('Injected a function!'))
  })
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? 'from a content script: ' + sender.tab.url : 'from the extension')
  var resp = request.info
  if (resp) {
    document.getElementById('result').innerText = resp

    chrome.storage.local.set({ company: resp }).then(() => {
      console.log('Value is set')
    })
  }
})

chrome.storage.local.get(['company']).then((result) => {
  console.log('Value currently is ' + result.company)
  document.getElementById('result').innerText = result.company
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it
  // send to injection
  if (changeInfo.status === 'complete') {
    console.log('url updated', tabId, tab.url)
    chrome.tabs
      .sendMessage(tabId, {
        message: 'urlUpdated',
      })
      .catch((err) => {
        console.log(err)
      })
      .then((res) => {
        console.log('message sent', res)
      })
  }
})

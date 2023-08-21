chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it
  // send to injection
  if (changeInfo.status === 'complete') {
    chrome.tabs
      .sendMessage(tabId, {
        message: 'urlUpdated',
      })
      .catch((err) => {})
      .then((res) => {})
  }
})

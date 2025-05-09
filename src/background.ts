export {}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    try {
      const behavior = await chrome.sidePanel.getPanelBehavior({ tabId })
      const isOpen = behavior?.open || false

      chrome.tabs.sendMessage(tabId, {
        type: "sidepanel_state",
        open: isOpen
      })
    } catch (e) {
      console.warn("Unable to check sidepanel state:", e)
    }
  }
})


//  sidepanel <-> background connection
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    let tabId: number | undefined

    port.onMessage.addListener((msg) => {
      if (msg.type === "init") {
        tabId = msg.tabId

        chrome.tabs.sendMessage(tabId, {
          type: "sidepanel_state",
          open: true
        })
      }
    })

    port.onDisconnect.addListener(() => {
      if (tabId !== undefined) {
        chrome.tabs.sendMessage(tabId, {
          type: "sidepanel_state",
          open: false
        })
      }
    })
  }
})

// reception on the floating button
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "open_sidepanel") {
    const tabId = sender.tab?.id
    const windowId = sender.tab?.windowId

    if (tabId && windowId) {
      chrome.sidePanel.open({ windowId, tabId })
    }
  }
})
export {}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, {
      type: "sidepanel_state",
      open: panelStateByTab[tabId] ?? false
    })
  }
})

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel") {
    let tabId: number | undefined

    port.onMessage.addListener((msg) => {
      if (msg.type === "init") {
        tabId = msg.tabId
        panelStateByTab[tabId] = true

        chrome.tabs.sendMessage(tabId, {
          type: "sidepanel_state",
          open: true
        })
      }
    })

    port.onDisconnect.addListener(() => {
      if (tabId !== undefined) {
        panelStateByTab[tabId] = false
        chrome.tabs.sendMessage(tabId, {
          type: "sidepanel_state",
          open: false
        })
      }
    })
  }
})

let panelStateByTab: Record<number, boolean> = {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id
  const windowId = sender.tab?.windowId

  if (!tabId || !windowId) {
    sendResponse({ opened: false })
    return true
  }

  if (message.type === "toggle_sidepanel") {
    console.log("[toggle] toggle requested for tab", tabId)

    if (panelStateByTab[tabId]) {
      chrome.sidePanel.close({ windowId }).then(() => {
        panelStateByTab[tabId] = false
        sendResponse({ opened: false })
      })
    } else {
      chrome.sidePanel.open({ tabId, windowId }).then(() => {
        panelStateByTab[tabId] = true
        sendResponse({ opened: true })
      })
    }

    return true
  }

  if (message.type === "check_sidepanel") {
    console.log("[check] check request from tab", tabId)
    sendResponse({ opened: panelStateByTab[tabId] ?? false })
    return true
  }

  return false
})

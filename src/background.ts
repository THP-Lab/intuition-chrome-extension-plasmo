export {}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "open_sidepanel") {
    const tabId = sender.tab?.id
    const windowId = sender.tab?.windowId

    if (!tabId || !windowId) return

    chrome.sidePanel.open({ tabId, windowId })
  }
})

chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === "complete") {
    chrome.tabs.sendMessage(tabId, { action: "REFRESH_CLAIMS" });
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { action: "REFRESH_CLAIMS" });
});
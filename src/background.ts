export {}

let pendingSidepanelRoute: string | null = null;
let sidepanelPort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel-nav") {
    sidepanelPort = port;
    port.onMessage.addListener((msg) => {
      if (msg === "SIDEPANEL_READY" && pendingSidepanelRoute) {
        port.postMessage({ action: "NAVIGATE_SIDEPANEL", route: pendingSidepanelRoute });
        pendingSidepanelRoute = null;
      }
    });
    port.onDisconnect.addListener(() => {
      sidepanelPort = null;
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "open_sidepanel") {
    const tabId = sender.tab?.id
    const windowId = sender.tab?.windowId

    if (!tabId || !windowId) return

    pendingSidepanelRoute = message.route || null;

    chrome.sidePanel.open({ tabId, windowId });
  }
});

chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === "complete") {
    chrome.tabs.sendMessage(tabId, { action: "REFRESH_CLAIMS" });
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { action: "REFRESH_CLAIMS" });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "GET_WALLET_ADDRESS") {
    chrome.storage.local.get(["metamask-account"], (localRes) => {
      const localAddr = localRes["metamask-account"]
      console.log("[BG] local metamask-account =", localAddr)

      chrome.storage.sync.get(["metamask-account"], (syncRes) => {
        const syncAddr = syncRes["metamask-account"]
        console.log("[BG] sync metamask-account =", syncAddr)

        sendResponse({ address: localAddr || syncAddr || "" })
      })
    })
    return true
  }
})


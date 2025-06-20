export {}

let pendingSidepanelRoute: string | null = null;
let sidepanelPort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidepanel-nav") {
    sidepanelPort = port;
    port.onMessage.addListener((msg) => {
      if (msg === "SIDEPANEL_READY" && pendingSidepanelRoute) {
        console.log("[BG] Port: sending NAVIGATE_SIDEPANEL", pendingSidepanelRoute);
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
  console.log("[BG] Received message:", message, "from", sender);
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
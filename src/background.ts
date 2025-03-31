export {}

console.log("Backdround worker running")

let windowId: any;
chrome.tabs.onActivated.addListener(function (activeInfo) {
  windowId = activeInfo.windowId;
});

chrome.runtime.onMessage.addListener((message, sender) => {
  (async () => {
    if (message.type === 'open_sidepanel') {
      chrome.sidePanel.open({ windowId: windowId, tabId: sender.tab?.id });
    }
  })();
});

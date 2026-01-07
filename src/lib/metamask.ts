// src/lib/metamask.ts
import createMetaMaskProvider from "metamask-extension-provider"

let providerSingleton: any | null = null
let listenersInstalled = false

export const getMetaProvider = async () => {
  if (!providerSingleton) providerSingleton = createMetaMaskProvider()
  return providerSingleton
}

function setStoredAccount(addr: string) {
  const normalized = addr ? addr.toLowerCase() : ""
  chrome.storage.sync.set({ "metamask-account": normalized })
  // optionnel: message refresh
  chrome.runtime.sendMessage({ action: "REFRESH_CLAIMS" })
}

export const setupMetaMaskListeners = async () => {
  const provider = await getMetaProvider()
  if (listenersInstalled || !provider?.on) return
  listenersInstalled = true

  provider.on("accountsChanged", (accounts: string[]) => {
    const next = (accounts?.[0] ?? "").toLowerCase()
    chrome.storage.sync.set({ "metamask-account": next })
    chrome.runtime.sendMessage({ action: "REFRESH_CLAIMS" })
  })
}

export const connectWallet = async () => {
  const provider = await getMetaProvider()
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[]
  const account = (accounts?.[0] ?? "").toLowerCase()

  chrome.storage.sync.set({ "metamask-account": account })
  await setupMetaMaskListeners()
  return account
}



export const disconnectWallet = async () => {
  // ✅ reset état app
  setStoredAccount("")

  // (optionnel) tenter revokePermissions, mais ne pas en dépendre
  try {
    const provider = await getMetaProvider()
    await provider.request({
      method: "wallet_revokePermissions",
      params: [{ eth_accounts: {} }]
    })
  } catch (e) {
    // ignore: pas supporté / pas autorisé dans ce contexte
  }
}




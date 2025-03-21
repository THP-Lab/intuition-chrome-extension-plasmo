import createMetaMaskProvider from "metamask-extension-provider";

export const getMetaProvider = async () => {
  /*
  if(typeof window !== 'undefined' && window.ethereum) {
    return window.ethereum
  }
  */

  const provider = createMetaMaskProvider()
  return provider
}

export const connectWallet = async () => {
  try {
    const provider = await getMetaProvider()
    console.log(provider);
    const accounts = await provider.request({
      method: "eth_requestAccounts"
    })
    return accounts[0]
  } catch (error) {
    console.error("Error connecting to wallet", error);
    throw error
  }
}

import createMetaMaskProvider from "metamask-extension-provider";

export const getMetaProvider = async () => {


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

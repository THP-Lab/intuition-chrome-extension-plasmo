// ~src/lib/viemClient.ts
import createMetaMaskProvider from "metamask-extension-provider"
import { createWalletClient, createPublicClient, custom, http } from "viem"
import { SELECTED_CHAIN, MULTIVAULT_ADDRESS } from "./config"

export const getClients = async () => {
  const provider = await createMetaMaskProvider()

  // Comptes
  let accounts = (await provider.request({ method: "eth_accounts" })) as string[] | undefined
  if (!accounts || accounts.length === 0) {
    accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[] | undefined
  }
  if (!accounts || accounts.length === 0) throw new Error("No accounts returned from MetaMask provider.")
  const account = accounts[0] as `0x${string}`

  // WalletClient (writes)
  let walletClient = createWalletClient({
    account,
    chain: SELECTED_CHAIN,
    transport: custom(provider),
  })

  // Switch chain si besoin
  const currentChainIdHex = (await provider.request({ method: "eth_chainId" })) as `0x${string}`
  const currentChainId = parseInt(currentChainIdHex, 16)
  if (currentChainId !== SELECTED_CHAIN.id) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${SELECTED_CHAIN.id.toString(16)}` }],
      })
    } catch (e: any) {
      if (e?.code === 4902 || /Unrecognized chain ID/i.test(e?.message)) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${SELECTED_CHAIN.id.toString(16)}`,
              chainName: SELECTED_CHAIN.name,
              nativeCurrency: SELECTED_CHAIN.nativeCurrency,
              rpcUrls: SELECTED_CHAIN.rpcUrls.default.http,
              blockExplorerUrls: [SELECTED_CHAIN.blockExplorers?.default?.url].filter(Boolean),
            },
          ],
        })
      } else {
        throw e
      }
    }

    walletClient = createWalletClient({
      account,
      chain: SELECTED_CHAIN,
      transport: custom(provider),
    })
  }

  // PublicClient (reads & simulate) via HTTP RPC
  const publicClient = createPublicClient({
    chain: SELECTED_CHAIN,
    transport: http(SELECTED_CHAIN.rpcUrls.default.http[0]),
  })

  return { walletClient, publicClient, multivaultAddress: MULTIVAULT_ADDRESS, account }
}

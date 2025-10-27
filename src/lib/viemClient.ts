// ~src/lib/viemClient.ts
import createMetaMaskProvider from "metamask-extension-provider"
import { createWalletClient, createPublicClient, custom, http } from "viem"
import { SELECTED_CHAIN } from "./config"

export const getClients = async () => {
  // 1) Provider MetaMask (EIP-1193)
  const provider = await createMetaMaskProvider()

  // 2) Comptes: privilégie eth_accounts, puis demande si vide
  let accounts = (await provider.request({ method: "eth_accounts" })) as string[] | undefined
  if (!accounts || accounts.length === 0) {
    accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[] | undefined
  }
  if (!accounts || accounts.length === 0) throw new Error("No accounts returned from MetaMask provider.")
  const address = accounts[0] as `0x${string}`

  // 3) WalletClient (writes ONLY) via MetaMask
  let walletClient = createWalletClient({
    account: address,
    chain: SELECTED_CHAIN,
    transport: custom(provider),
  })

  // 4) S’assurer qu’on est sur la bonne chain (switch ou add)
  const currentChainIdHex = (await provider.request({ method: "eth_chainId" })) as `0x${string}`
  const currentChainId = parseInt(currentChainIdHex, 16)
  if (currentChainId !== SELECTED_CHAIN.id) {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${SELECTED_CHAIN.id.toString(16)}` }],
      })
    } catch (e: any) {
      // 4902 = chain non ajoutée
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
    // Recrée le walletClient après switch
    walletClient = createWalletClient({
      account: address,
      chain: SELECTED_CHAIN,
      transport: custom(provider),
    })
  }

  // 5) PublicClient (reads & simulate) via HTTP RPC (PAS MetaMask)
  const publicClient = createPublicClient({
    chain: SELECTED_CHAIN,
    transport: http(SELECTED_CHAIN.rpcUrls.default.http[0]), // ✅ HTTP pur → plus de -32603 MetaMask en console
  })

  return { walletClient, publicClient }
}

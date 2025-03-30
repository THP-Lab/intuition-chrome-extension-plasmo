import createMetaMaskProvider from 'metamask-extension-provider'
import { createWalletClient, custom, createPublicClient, http } from 'viem'
import { SELECTED_CHAIN } from './config'

export const getClients = async () => {
  const provider = await createMetaMaskProvider()

  // Demander les comptes au wallet
  const accounts = await provider.request({
    method: 'eth_requestAccounts',
  })
  const address = accounts[0]

  // Créer le walletClient AVANT de l'utiliser
  const walletClient = createWalletClient({
    account: address,
    chain: SELECTED_CHAIN,
    transport: custom(provider),
  })

  // Vérifie la chaîne actuelle du wallet
  const chainId = await walletClient.getChainId()
  console.log("🔗 Wallet chain ID:", chainId)
  console.log("🎯 Expected chain ID:", SELECTED_CHAIN.id)

  // Tente un switch si nécessaire
  if (chainId !== SELECTED_CHAIN.id) {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${SELECTED_CHAIN.id.toString(16)}` }],
    })
  }

  // Création du public client
  const publicClient = createPublicClient({
    chain: SELECTED_CHAIN,
    transport: http(),
  })

  console.log("✅ Clients ready.")
  return { walletClient, publicClient }
}

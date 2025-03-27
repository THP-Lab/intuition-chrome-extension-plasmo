import createMetaMaskProvider from 'metamask-extension-provider';
import { createWalletClient, custom, createPublicClient, http } from 'viem';
import { SELECTED_CHAIN } from './config';

export const getClients = async () => {
  const provider = await createMetaMaskProvider();

  
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${SELECTED_CHAIN.id.toString(16)}` }] // 84532 → 0x14a74
  })
  
  const accounts = await provider.request({
    method: 'eth_requestAccounts',
  });

  const address = accounts[0];

  const walletClient = createWalletClient({
    account: address,
    chain: SELECTED_CHAIN, 
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain: SELECTED_CHAIN,
    transport: http(), 
  });


  return { walletClient, publicClient };
};



import createMetaMaskProvider from 'metamask-extension-provider';
import { createWalletClient, custom, createPublicClient, http } from 'viem';
import { baseSepolia, mainnet } from 'viem/chains';

export const getClients = async () => {
  const provider = await createMetaMaskProvider();

  const accounts = await provider.request({
    method: 'eth_requestAccounts',
  });

  const address = accounts[0];

  const walletClient = createWalletClient({
    account: address,
    chain: baseSepolia, 
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(), 
  });

  return { walletClient, publicClient };
};



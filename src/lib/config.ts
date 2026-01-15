// ~src/lib/config.ts
import { intuitionTestnet, getMultiVaultAddressFromChainId } from "@0xintuition/protocol"
import { defineChain } from "viem"

const CURRENT_ENV = process.env.NODE_ENV
export const IS_DEV = CURRENT_ENV !== "production"

// Define Intuition Mainnet chain
export const intuitionMainnet = defineChain({
  id: 1155,
  name: "intuition-mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Trust",
    symbol: "TRUST",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.intuition.systems"],
      webSocket: ["wss://rpc.intuition.systems"],
    },
    public: {
      http: ["https://rpc.intuition.systems"],
      webSocket: ["wss://rpc.intuition.systems"],
    },
  },
  blockExplorers: {
    default: {
      name: "Intuition Explorer",
      url: "https://explorer.intuition.systems",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    },
  },
})

// Network type
export type NetworkType = "mainnet" | "testnet"

// Determine network based on environment
// Use testnet only if explicitly set via PLASMO_PUBLIC_NETWORK=testnet
// Otherwise default to mainnet in production
export function getSelectedNetwork(): NetworkType {
  const envNetwork = process.env.PLASMO_PUBLIC_NETWORK
  if (envNetwork === "mainnet") {
    return "mainnet"
  }
  // Default to testnet until mainnet atoms are created
  // TODO: Change default to "mainnet" when base atoms exist on mainnet
  return "testnet"
}

// Current network (computed once at startup)
export const CURRENT_NETWORK = getSelectedNetwork()

// Get the chain configuration based on selected network
export function getChainByNetwork(network: NetworkType) {
  return network === "mainnet" ? intuitionMainnet : intuitionTestnet
}

// Get GraphQL endpoints based on network
export function getGraphQLEndpoints(network: NetworkType) {
  const baseUrl = network === "mainnet" 
    ? "https://mainnet.intuition.sh" 
    : "https://testnet.intuition.sh"
  
  return {
    http: `${baseUrl}/v1/graphql`,
    ws: `${baseUrl.replace("https://", "wss://")}/v1/graphql`,
  }
}

// Get MultiVault contract address based on network
export function getMultiVaultAddress(network: NetworkType): string {
  // TODO: Update with actual mainnet address when deployed
  if (network === "mainnet") {
    return "0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e" // Placeholder
  }
  return "0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91" // Testnet
}

// Dynamic exports based on current network
export const SELECTED_CHAIN = getChainByNetwork(CURRENT_NETWORK)
export const DEFAULT_CHAIN_ID = SELECTED_CHAIN.id.toString()
export const MULTIVAULT_ADDRESS = getMultiVaultAddress(CURRENT_NETWORK) as `0x${string}`

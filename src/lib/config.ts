import { base, baseSepolia } from "viem/chains"
import { defineChain } from "viem"


const CURRENT_ENV = process.env.NODE_ENV

// 🔹 Définition de la chaîne Intuition Testnet (ID 13579)
export const intuitionTestnet = defineChain({
  id: 13579,
  name: "Intuition Testnet",
  network: "intuition-testnet",
  nativeCurrency: {
    name: "Trust Native",
    symbol: "tTRUST",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.rpc.intuition.systems/http"],
    },
    public: {
      http: ["https://testnet.rpc.intuition.systems/http"],
    },
  },
  blockExplorers: {
    default: {
      name: "Intuition Explorer",
      url: "https://explorer.testnet.intuition.systems", // à remplacer si tu as l’URL exacte
    },
  },
})

// 🔹 Choix de la chaîne selon l’environnement
export const IS_DEV = CURRENT_ENV !== "production"

export const SELECTED_CHAIN = IS_DEV ? intuitionTestnet : intuitionTestnet

export const DEFAULT_CHAIN_ID = SELECTED_CHAIN.id.toString()

export const MULTIVAULT_CONTRACT_ADDRESS = IS_DEV
  ? "0xB92EA1B47E4ABD0a520E9138BB59dBd1bC6C475B" // Intuition testnet
  : "0xB92EA1B47E4ABD0a520E9138BB59dBd1bC6C475B" // Base mainnet
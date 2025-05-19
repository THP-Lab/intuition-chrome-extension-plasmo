import { base, baseSepolia } from "viem/chains"

const CURRENT_ENV = process.env.NODE_ENV

export const IS_DEV = CURRENT_ENV !== "production"

export const SELECTED_CHAIN = IS_DEV ? baseSepolia : base

export const DEFAULT_CHAIN_ID = SELECTED_CHAIN.id.toString()

export const MULTIVAULT_CONTRACT_ADDRESS = IS_DEV
  ? "0x63B90A9c109fF8f137916026876171ffeEdEe714" // baseSepolia
  : "0x430BbF52503Bd4801E51182f4cB9f8F534225DE5" // base

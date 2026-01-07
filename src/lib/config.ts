// ~src/lib/config.ts
import { intuitionTestnet, getMultiVaultAddressFromChainId } from "@0xintuition/protocol"

const CURRENT_ENV = process.env.NODE_ENV
export const IS_DEV = CURRENT_ENV !== "production"

export const SELECTED_CHAIN = intuitionTestnet

export const DEFAULT_CHAIN_ID = SELECTED_CHAIN.id.toString()

export const MULTIVAULT_ADDRESS = "0x2Ece8D4dEdcB9918A398528f3fa4688b1d2CAB91"

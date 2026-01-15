// ~src/lib/atoms.ts
// Centralized atom IDs for mainnet and testnet networks

// Hex32 type for 32-byte hex strings
type Hex32 = `0x${string}`

/**
 * Network-specific atom IDs
 */
export const ATOM_IDS = {
  testnet: {
    // "I" subject atom - represents the user identity
    I_SUBJECT: "0x7ab197b346d386cd5926dbfeeb85dade42f113c7ed99ff2046a5123bb5cd016b" as Hex32,
    
    // "follows" predicate - used for following relationships
    FOLLOWS_PREDICATE: "0xffd07650dc7ab341184362461ebf52144bf8bcac5a19ef714571de15f1319260" as Hex32,
    
    // "is" predicate - used for identity claims
    IS: "0xdd4320a03fcd85ed6ac29f3171208f05418324d6943f1fac5d3c23cc1ce10eb3" as Hex32,
    
    // "scam" predicate - used to flag scam content
    SCAM: "0xb1b69b106ec87313af64debf2a0f48718f40cb08a9ed73eb1e5dcbebb2d63d2e" as Hex32,
    
    // "trustworthy" predicate - used to flag trustworthy content
    TRUSTWORTHY: "0xc8328e91eecabf6bdfc9416b544a7aa2de98e74fa62a84863085ce6d893609b3" as Hex32,
    
    // "hashtag" predicate - used for tagging (also called HAS_TAG)
    HASHTAG_PREDICATE: "0x7ec36d201c842dc787b45cb5bb753bea4cf849be3908fb1b0a7d067c3c3cc1f5" as Hex32,
  },
  
  mainnet: {
    // TODO: Replace these with actual mainnet IDs once deployed
    // For now, using testnet IDs as placeholders
    I_SUBJECT: "0x7ab197b346d386cd5926dbfeeb85dade42f113c7ed99ff2046a5123bb5cd016b" as Hex32,
    FOLLOWS_PREDICATE: "0xffd07650dc7ab341184362461ebf52144bf8bcac5a19ef714571de15f1319260" as Hex32,
    IS: "0xdd4320a03fcd85ed6ac29f3171208f05418324d6943f1fac5d3c23cc1ce10eb3" as Hex32,
    SCAM: "0xb1b69b106ec87313af64debf2a0f48718f40cb08a9ed73eb1e5dcbebb2d63d2e" as Hex32,
    TRUSTWORTHY: "0xc8328e91eecabf6bdfc9416b544a7aa2de98e74fa62a84863085ce6d893609b3" as Hex32,
    HASHTAG_PREDICATE: "0x7ec36d201c842dc787b45cb5bb753bea4cf849be3908fb1b0a7d067c3c3cc1f5" as Hex32,
  }
} as const

/**
 * Get atom IDs for the currently selected network
 */
export function getAtomIds(network: "mainnet" | "testnet" = "testnet") {
  return ATOM_IDS[network]
}

// Convenience exports for backward compatibility
export const {
  I_SUBJECT: I_SUBJECT_ID,
  FOLLOWS_PREDICATE: FOLLOWS_PREDICATE_ID,
  IS: IS_ID,
  SCAM: SCAM_ID,
  TRUSTWORTHY: TRUSTWORTHY_ID,
  HASHTAG_PREDICATE: HASHTAG_PREDICATE_ID,
} = ATOM_IDS.testnet

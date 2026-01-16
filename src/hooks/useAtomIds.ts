// ~src/hooks/useAtomIds.ts
import { getAtomIds } from "~src/lib/atoms"
import { CURRENT_NETWORK } from "~src/lib/config"

/**
 * Hook to get network-specific atom IDs
 * Based on environment configuration
 */
export function useAtomIds() {
  return getAtomIds(CURRENT_NETWORK)
}

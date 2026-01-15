// ~src/hooks/useNetwork.ts
import { useState, useEffect } from "react"
import { getSelectedNetwork, setSelectedNetwork, type NetworkType } from "~src/lib/config"

/**
 * Hook to manage network selection (mainnet/testnet)
 */
export function useNetwork() {
  const [network, setNetwork] = useState<NetworkType>("testnet")
  const [isLoading, setIsLoading] = useState(true)

  // Load network on mount
  useEffect(() => {
    const net = getSelectedNetwork()
    setNetwork(net)
    setIsLoading(false)
  }, [])

  // Switch network
  const switchNetwork = (newNetwork: NetworkType) => {
    setIsLoading(true)
    try {
      setSelectedNetwork(newNetwork)
      setNetwork(newNetwork)
      
      // Reload the page to apply network changes across all components
      window.location.reload()
    } catch (error) {
      console.error("Failed to switch network:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleNetwork = () => {
    const newNetwork = network === "mainnet" ? "testnet" : "mainnet"
    switchNetwork(newNetwork)
  }

  return {
    network,
    isLoading,
    switchNetwork,
    toggleNetwork,
    isMainnet: network === "mainnet",
    isTestnet: network === "testnet",
  }
}

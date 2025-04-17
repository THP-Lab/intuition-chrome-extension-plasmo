import React, from "react"
import { Button } from "~src/components/ui/button"
import { connectWallet } from "../lib/metamask"
import { useStorage } from "@plasmohq/storage/hook"

const WalletConnectionButton = () => {
  const [account, setAccount] = useStorage<string>("metamask-account")

  const handleConnect = async () => {
    try {
      const accountAddress = await connectWallet()
      setAccount(accountAddress)
    } catch (error) {
      console.error("Failed to connect to wallet: ", error)
    }
  }

  const handleDisconnect = () => {
    setAccount("");
  }

  const sliceAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div>
      {!account ? (
        <Button variant="successOutline" onClick={handleConnect}>Connect to Metamask</Button>
      ) : (
        <div>
          <Button variant="destructiveOutline" onClick={handleDisconnect}>Disconnect</Button>
        </div>
      )}
    </div>
  )
}

export default WalletConnectionButton

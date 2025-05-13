import React from "react"
import { Button } from "~src/components/ui/button"
import { connectWallet, disconnectWallet } from "../lib/metamask"
import { useStorage } from "@plasmohq/storage/hook"
import { PowerOff } from 'lucide-react';

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
    disconnectWallet()
  }

  return (
    <div>
      {!account ? (
        <Button variant="successOutline" onClick={handleConnect}>Connect to Metamask</Button>
      ) : (
        <div>
          <button
            onClick={handleDisconnect}
            className="p-1 text-red-500 transition-transform duration-200 transform hover:scale-110"
          >
            <PowerOff />
          </button>
        </div>
      )}
    </div>
  )
}

export default WalletConnectionButton

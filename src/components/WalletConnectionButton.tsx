import React, { useEffect } from "react"
import { Button } from "~src/components/ui/button"
import { connectWallet, disconnectWallet, setupMetaMaskListeners  } from "../lib/metamask"
import { PowerOff } from 'lucide-react';
import { useWalletAddress } from "~src/hooks/useWalletAddress";


const WalletConnectionButton = () => {
  const address = useWalletAddress();

  const handleConnect = async () => {
    const accountAddress = (await connectWallet()).toLowerCase()
    chrome.storage.sync.set({ "metamask-account": accountAddress })
  }

  const handleDisconnect = async () => {
    chrome.storage.sync.set({ "metamask-account": "" })
    await disconnectWallet()
  }

    useEffect(() => {
    setupMetaMaskListeners()
  }, [])

  return (
    <div>
      {!address ? (
        <Button variant="successOutline" onClick={handleConnect}>Connect to Metamask</Button>
      ) : (
        <div>
          <button
            title="Disconnect"
            onClick={handleDisconnect}
            className="p-1 text-grey-400 transition-transform duration-200 transform hover:scale-110"
          >
            <PowerOff className="h-4 w-4"/>
          </button>
        </div>
      )}
    </div>
  )
}

export default WalletConnectionButton

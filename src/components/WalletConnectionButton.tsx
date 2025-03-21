import React, { useEffect, useState } from "react"
import {Button} from "~src/components/ui/button"
import { connectWallet } from "../lib/metamask"

const WalletConnectionButton = () => {
  const [account, setAccount] = useState<string>("")

  useEffect(() => {
    const storedAccount = localStorage.getItem("metamask-account")
    console.log("Stored Account: ", storedAccount)
    storedAccount ? setAccount(storedAccount) : setAccount("")
  }, [])

  const handleConnect = async () => {
    try {
      const accountAddress = await connectWallet()
      setAccount(accountAddress)
      localStorage.setItem("metamask-account", accountAddress)
    } catch (error) {
      console.error("Failed to connect to wallet: ", error)
    }
  }

  const handleDisconnect = () => {
    setAccount("");
    localStorage.removeItem("metamask-account");
  }

  const sliceAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }



  return (
    <div>
      {!account ? (
        <Button variant="default" onClick={handleConnect}>Connect to Metamask</Button>
      ) : (
        <div>
          <p>Connected account : {sliceAddress(account)}</p>
          <Button variant="destructive" onClick={handleDisconnect}>Disconnect</Button>
        </div>
      )}
    </div>
  )
}

export default WalletConnectionButton

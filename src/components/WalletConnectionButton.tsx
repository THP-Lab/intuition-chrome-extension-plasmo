import { useEffect, useState } from "react"

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

  const sliceAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div>
      {!account ? (
        <button onClick={handleConnect}>Connect to Metamask</button>
      ) : (
        <div>
          <p>Connected account : {sliceAddress(account)}</p>
        </div>
      )}
    </div>
  )
}

export default WalletConnectionButton

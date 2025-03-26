import React from "react"
import { useStorage } from "@plasmohq/storage/hook"

const IdentityTab = () => {
  const [address] = useStorage<string>("metamask-account")  
 return (
    <div>
      <h2>Identity Tab</h2>
      <p>Wallet address : {address || "Not connected"}</p>
    </div>

  )
};

export default IdentityTab;

import React from "react";
import { useStorage } from "@plasmohq/storage/hook";

const YourClaimsTab = () => {
  const [address] = useStorage<string>("metamask-account")  
  return(
    <div>
      <h2>Your Claims Tab</h2>
      <p>Wallet address : {address || "Not connected"}</p>
    </div>
  )
};

export default YourClaimsTab;


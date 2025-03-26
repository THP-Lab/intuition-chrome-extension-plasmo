import React from "react";
import { useStorage } from "@plasmohq/storage/hook";


const RelatedClaimsTab = () => {
  const [address] = useStorage<string>("metamask-account")

  return(
    <div>
      <h2>Related Claims</h2>
      <p>Wallet address : {address || "Not connected"}</p>
    </div>
  )
};

export default RelatedClaimsTab;
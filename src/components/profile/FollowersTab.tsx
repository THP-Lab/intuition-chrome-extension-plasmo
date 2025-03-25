import React from "react";
import { useStorage } from "@plasmohq/storage/hook";

const FollowersTab = () => {
  const [address] = useStorage<string>("metamask-account")  
  return(
    <div>
      <h2>Follower Tab</h2>
      <p>Wallet address : {address || "Not connected"}</p>
    </div>
  )
};

export default FollowersTab;

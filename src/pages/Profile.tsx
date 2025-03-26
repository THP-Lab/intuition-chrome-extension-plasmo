import React, { useEffect, useState } from "react"
import WalletConnectionButton from "~src/components/WalletConnectionButton"
import ProfileTabs from "~src/components/profile/ProfileTabs"
import { Outlet } from "react-router-dom"
import { useStorage } from "@plasmohq/storage/hook";

function Profile() {
  const [address] = useStorage<string>("metamask-account")

  if (!address) {
    return (
      <div className="bg-background">
        Please link your metamask account then re-open this page
        <WalletConnectionButton />
      </div>
    )
  }

  return (
    <div className="bg-background">
      <WalletConnectionButton/>
      <ProfileTabs />
      <Outlet />
    </div>
  )
}

export default Profile;

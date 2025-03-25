import React, { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { useStorage } from "@plasmohq/storage/hook";

function Profile() {
  const [address, setAddress] = useState(
    localStorage.getItem("metamask-account")
  )

  const handleClick = () => {
    setAddress(localStorage.getItem("metamask-account"))
  }

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
      <WalletConnectionButton onClick={handleClick} />
      <ProfileTabs />
      <Outlet />
    </div>
  )
}

export default Profile

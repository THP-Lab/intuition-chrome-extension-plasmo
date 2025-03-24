
import React, { useEffect, useState } from "react"
import WalletConnectionButton from "~src/components/WalletConnectionButton"
import ProfileTabs from "~src/components/profile/ProfileTabs"
import { Outlet } from "react-router-dom"

function Profile() {
  const [address, setAddress] = useState(localStorage.getItem("metamask-account"))

  const handleClick = () => {
    setAddress(localStorage.getItem("metamask-account"))
  }

  if (!address) {
    return (
      <div>
        Please link your metamask account then re-open this page
        <WalletConnectionButton onClick={handleClick} />
      </div>
    )
  }

  return (
    <div>
      <WalletConnectionButton onClick={handleClick} />
      <ProfileTabs />
      <Outlet />
    </div>
  )
}

export default Profile;

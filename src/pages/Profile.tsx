
import React, { useEffect, useState } from "react"
import WalletConnectionButton from "~src/components/WalletConnectionButton"
import YourClaimsTab from "~src/components/profile/YourClaimsTab"

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
      <YourClaimsTab account={ address } />
    </div>
  )
}

export default Profile;

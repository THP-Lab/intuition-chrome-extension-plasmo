import React from "react"
import WalletConnectionButton from "~src/components/WalletConnectionButton"
import ProfileTabs from "~src/components/profile/ProfileTabs"
import { Outlet } from "react-router-dom"
import { useStorage } from "@plasmohq/storage/hook"
import AccountSection from "~src/components/profile/AccountSection"
import AtomProfileSection from "~src/components/profile/AtomProfileSection"

function Profile() {
  const [address] = useStorage<string>("metamask-account")

  if (!address) {
    return (
      <div className="flex flex-col items-center space-y-4 p-4">
        <p className="text-foreground">Please link your Metamask account, then re-open this page.</p>
        <WalletConnectionButton />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
      <WalletConnectionButton />
      <AccountSection />
      <AtomProfileSection />
      <ProfileTabs />
      <Outlet />
    </div>
  )
}

export default Profile
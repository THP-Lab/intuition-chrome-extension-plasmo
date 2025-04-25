import React, { useState } from "react"
import {
  useGetAccountByIdQuery,
  useGetClaimsByAddressQuery,
  useGetPersonsByIdentifierQuery
} from "~src/graphql/src"

import WalletConnectionButton from "~src/components/WalletConnectionButton"
import ProfileTabs from "~src/components/profile/ProfileTabs"
import { Outlet } from "react-router-dom"
import { useStorage } from "@plasmohq/storage/hook"
import AccountSection from "~src/components/profile/AccountSection"
import AtomProfileSection from "~src/components/profile/AtomProfileSection"
import IntuitionNavSwitch from "~src/components/layout/IntuitionNavSwitch"
import { Button } from "~src/components/ui/button"
import { cn } from "~src/lib/utils"

const ProfileLayout = () => {
  const [position, setPosition] = useState({ x: 0, y: -3 })
  const [address] = useStorage<string>("metamask-account")
  const [editMode, setEditMode] = useState(false)

  const { data: personData } = useGetPersonsByIdentifierQuery(
    { identifier: address || "" },
    { enabled: !!address }
  )
  const person = personData?.persons?.[0]

  const { data: accountData } = useGetAccountByIdQuery({ id: address || "" })
  const { data: claimsData } = useGetClaimsByAddressQuery({ address: address || "" })

  const account = accountData?.account

  const [navType, setNavType] = useStorage<"classic" | "arc">("navbar-type", "classic")
  
  const toggleNavType = () => {
    setNavType(navType === "classic" ? "arc" : "classic")
  }

  if (!address) {
    return (
      <div className="flex flex-col items-center space-y-4 p-4">
        <p className="text-foreground">
          Please link your Metamask account, then re-open this page.
        </p>
        <WalletConnectionButton />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <WalletConnectionButton />
      </div>
      <Button
            variant="ghost"
            size="sm"
            onClick={toggleNavType}
            className={cn(
              "flex items-center justify-center p-2",
              "hover:bg-accent hover:text-accent-foreground",
              "transition-colors"
            )}
            title={`Switch to ${navType === "classic" ? "Arc" : "Classic"} Navigation`}>
            <IntuitionNavSwitch size={20} />
      </Button>
      <p>{address}</p>


      <AccountSection
        account={account}
        person={person}
        editMode={editMode}
        setEditMode={setEditMode}
      />

      {person && <AtomProfileSection person={person} />}

      <ProfileTabs />
      <Outlet />
    </div>
  )
}

export default ProfileLayout

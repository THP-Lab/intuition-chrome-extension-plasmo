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

function Profile() {
  const [position, setPosition] = useState({ x: -0, y: -3 });
  const [address] = useStorage<string>("metamask-account")
  const [editMode, setEditMode] = useState(false)

  const { data: personData } = useGetPersonsByIdentifierQuery(
    { identifier: address || "" },
    { enabled: !!address }
  )

  //teeeeeeeeeeest :
  console.log("Person Data from query:", personData)

  

  const person = personData?.persons?.[0]

  const { data: accountData } = useGetAccountByIdQuery({ id: address || "" })
  const { data: claimsData } = useGetClaimsByAddressQuery({ address: address || "" })

  const account = accountData?.account

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


      <AccountSection account={account} person={person} editMode={editMode} setEditMode={setEditMode} />

      {person && <AtomProfileSection person={person} />}

      <ProfileTabs />
      <Outlet />
    </div>
  )
}

export default Profile

import React, { useState } from "react"

import { useGetAccountByIdQuery, useGetClaimsByAddressQuery } from "~src/graphql/src"

import { Claim } from "@0xintuition/1ui"
import WalletConnectionButton from "~src/components/WalletConnectionButton"
import ProfileTabs from "~src/components/profile/ProfileTabs"
import { Outlet } from "react-router-dom"
import { useStorage } from "@plasmohq/storage/hook";
import SignUpForm from "../components/SignUpForm"

function Profile() {
  const [address] = useStorage<string>("metamask-account")


  const [editMode, setEditMode] = useState(false)

  

  //  Get account info (profile)
  const { data: accountData, isLoading: accountLoading } = useGetAccountByIdQuery({
    id: address || ""
  })

  //  Get claims for this address
  const { data: claimsData, isLoading: claimsLoading } = useGetClaimsByAddressQuery({
    address: address || ""
  })

  const account = accountData?.account

  if (!address) {
    return (
      <div>
        <p>Please link your Metamask account, then re-open this page.</p>
        <WalletConnectionButton />
      </div>
    )
  }



  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <WalletConnectionButton  />

      <section className="border rounded-lg p-4 bg-gray-100">
        <h2 className="text-xl font-semibold mb-2">Account Info</h2>

        {!account || editMode ? (
          <SignUpForm
            defaultValues={
              account
                ? {
                    name: account.label,
                    image: account.image || "",
                    description: "",
                    url: "",
                    email: "",
                    identifier: ""
                  }
                : undefined
            }
            onSuccess={() => setEditMode(false)}
          />
        ) : (
          <div className="space-y-2">
            <p><strong>Label:</strong> {account.label}</p>
            {account.image && (
              <div>
                <strong>Image:</strong>
                <img src={account.image} alt="profile" className="w-24 h-24 rounded" />
              </div>
            )}
            <button
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </section>

     
  
      <WalletConnectionButton />
      <ProfileTabs />
      <Outlet />
    </div>
  )
}

export default Profile;

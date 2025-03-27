import React, { useState } from "react"

import { useGetAccountByIdQuery, useGetClaimsByAddressQuery } from "~src/graphql/src"

import WalletConnectionButton from "~src/components/WalletConnectionButton"
import ProfileTabs from "~src/components/profile/ProfileTabs"
import { Outlet } from "react-router-dom"
import { useStorage } from "@plasmohq/storage/hook";
import SignUpForm from "../components/SignUpForm"
import { cn } from "~src/lib/utils"
import { Button } from "~src/components/ui/button"

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
      <div className="flex flex-col items-center space-y-4 p-4">
        <p className="text-foreground">Please link your Metamask account, then re-open this page.</p>
        <WalletConnectionButton />
      </div>
    )
  }



  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
      <WalletConnectionButton  />

      <section className={cn(
        "border rounded-lg p-4",
        "bg-background text-foreground",
        "shadow-sm hover:shadow-md transition-shadow"
      )}>
        <h2 className="text-xl font-semibold mb-4">Account Info</h2>

        {!account || editMode ? (
          <SignUpForm
            defaultValues={
              account
                ? {
                    name: account.name,
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

          <div className="space-y-4">
            <p className="flex items-center gap-2">
              <span className="font-medium">Label:</span> 
              <span className="text-muted-foreground">{account.label}</span>
              <span className="text-muted-foreground">{account.name}</span>
            </p>

            {account.image && (
              <div className="space-y-2">
                <span className="font-medium">Image:</span>
                <img 
                  src={account.image} 
                  alt="profile" 
                  className="w-24 h-24 rounded-md object-cover border border-border" 
                />
              </div>
            )}
            <button

              className={cn(
                "w-full px-4 py-2 bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded"
              )}

              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </section>

      <ProfileTabs />
      <Outlet />
    </div>
  )
}

export default Profile;

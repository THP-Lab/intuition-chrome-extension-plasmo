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
  const [position, setPosition] = useState({ x: -0, y: -3 });
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
            <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute p-2"
            style={{
              right: `${position.x}rem`,
              top: `${position.y}rem`
            }}
            onClick={() => setEditMode(false)}
          >
              <svg 
                width="30" 
                height="30" 
                viewBox="0 0 15 15" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-muted-foreground hover:text-foreground"
              >
                <path 
                  d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" 
                  fill="currentColor" 
                  fillRule="evenodd" 
                  clipRule="evenodd"
                />
              </svg>
            </Button>
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
          </div>
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

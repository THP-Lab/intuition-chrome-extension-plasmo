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

  const [address, setAddress] = useState<string | null>(
    localStorage.getItem("metamask-account")
  )

  const [editMode, setEditMode] = useState(false)

  const handleClick = () => {
    const addr = localStorage.getItem("metamask-account")
    setAddress(addr)
  }

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
        <WalletConnectionButton onClick={handleClick} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <WalletConnectionButton onClick={handleClick} />

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
                    url: ""
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

      <section>
        <h2 className="text-xl font-semibold">
          Your Claims ({claimsData?.claims_aggregate.aggregate.count || 0})
        </h2>

        {claimsData?.claims_aggregate.nodes.map(({ triple }) => (
          <div
            key={triple.id}
            style={{
              padding: "10px",
              backgroundColor: "black",
              color: "white"
            }}
          >
            <Claim
              orientation="horizontal"
              subject={{
                variant: triple.subject.type === "Account" ? "user" : "non-user",
                label: triple.subject?.label || "N/A",
                imgSrc:
                  triple.subject?.image ||
                  "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
              }}
              predicate={{
                variant: triple.predicate.type === "Account" ? "user" : "non-user",
                label: triple.predicate?.label || "N/A",
                imgSrc:
                  triple.predicate?.image ||
                  "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
              }}
              object={{
                variant: triple.object.type === "Account" ? "user" : "non-user",
                label: triple.object?.label || "N/A",
                imgSrc:
                  triple.object?.image ||
                  "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
              }}
            />
          </div>
        ))}
      </section>
    </div>
  )
}

export default Profile;

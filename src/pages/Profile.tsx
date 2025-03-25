import { Claim } from "@0xintuition/1ui"
import SignUpForm from "../components/SignUpForm"


import React, { useEffect, useState } from "react"

import WalletConnectionButton from "~src/components/WalletConnectionButton"
import { useGetClaimsByAddressQuery } from "~src/graphql/src"

function Profile() {
  const [address, setAddress] = useState(
    localStorage.getItem("metamask-account")
  )

  const handleClick = () => {
    setAddress(localStorage.getItem("metamask-account"))
  }

  const { data, isLoading } = useGetClaimsByAddressQuery({
    address: address
  })
  if (!address) {
    return (
      <div>
        Please link your metamask account then re-open this page
        <WalletConnectionButton onClick={handleClick} />
      </div>
    )
  }

  if (isLoading) return <div>Loading...</div>

  console.log(data.claims_aggregate.nodes)

  return (
    <>
      <div>
      <h1>My Profile</h1>

        <h2>Your Claims ( {data.claims_aggregate.aggregate.count} )</h2>

        <WalletConnectionButton onClick={handleClick} />

        <h2>Register a new Person</h2>
        <SignUpForm />

        {!isLoading &&
          data.claims_aggregate.nodes.map(
            ({ triple, shares, counter_shares }) => (
              <div
                key={triple.id}
                style={{
                  padding: "10px",
                  backgroundColor: "black",
                  color: "white"
                }}>
                <Claim
                  orientation="horizontal"
                  subject={{
                    variant:
                      triple.subject.type === "Account" ? "user" : "non-user",
                    label: triple.subject?.label || "N/A",
                    imgSrc:
                      triple.subject?.image ||
                      "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
                  }}
                  predicate={{
                    variant:
                      triple.predicate.type === "Account" ? "user" : "non-user",
                    label: triple.predicate?.label || "N/A",
                    imgSrc:
                      triple.predicate?.image ||
                      "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
                  }}
                  object={{
                    variant:
                      triple.object.type === "Account" ? "user" : "non-user",
                    label: triple.object?.label || "N/A",
                    imgSrc:
                      triple.object?.image ||
                      "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
                  }}
                />
              </div>
            )
          )}
      </div>
    </>
  )
}

export default Profile
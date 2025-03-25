import React, { useEffect, useState } from "react"

// UI component to display claims
import { Claim } from "@0xintuition/1ui"

// Form to register a new person
import SignUpForm from "../components/SignUpForm"

// Button to connect a Metamask wallet
import WalletConnectionButton from "~src/components/WalletConnectionButton"

// GraphQL query to get all claims associated with an address
import { useGetClaimsByAddressQuery } from "~src/graphql/src"

function Profile() {
  // Store the currently connected wallet address (from localStorage)
  const [address, setAddress] = useState(
    localStorage.getItem("metamask-account")
  )

  // Called when the user clicks "Connect Wallet"
  const handleClick = () => {
    // Refresh the address from localStorage after wallet connection
    setAddress(localStorage.getItem("metamask-account"))
  }

  // Run a GraphQL query to get claims for the given address
  const { data, isLoading } = useGetClaimsByAddressQuery({
    address: address
  })

  // If no address is connected, ask the user to connect their wallet
  if (!address) {
    return (
      <div>
        <p>Please link your Metamask account, then re-open this page.</p>
        <WalletConnectionButton onClick={handleClick} />
      </div>
    )
  }

  // If the query is still loading, show a loading state
  if (isLoading) return <div>Loading...</div>

  // Optional: log the claims to the console for debugging
  console.log(data.claims_aggregate.nodes)

  return (
    <>
      <div>
        <h1>My Profile</h1>

        {/* Show how many claims this user has */}
        <h2>Your Claims ( {data.claims_aggregate.aggregate.count} )</h2>

        {/* Wallet button to refresh account address manually */}
        <WalletConnectionButton onClick={handleClick} />

        {/* Form to register a new person into the system */}
        <h2>Register a new Person</h2>
        <SignUpForm />

        {/* Display all claims from the query */}
        {!isLoading &&
          data.claims_aggregate.nodes.map(
            ({ triple, shares, counter_shares }) => (
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
                    // Choose the correct visual style for the subject
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

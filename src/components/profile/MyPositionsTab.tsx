import React from "react"
import { useStorage } from "@plasmohq/storage/hook"
import ClaimRowLite from "../ui/ClaimRowLite"
import { useGetClaimsByAddressQuery } from "~src/graphql/src"

const MyPositionsTab = () => {
  const [account] = useStorage<string>("metamask-account")

  const { data, isLoading, isError, error } = useGetClaimsByAddressQuery(
    { address: account ?? "" },
    { enabled: !!account }
  )

  const claims = data?.claims_aggregate?.nodes ?? []
  const filteredClaims = claims.filter(
    (c) => Number(c.shares) > 0 || Number(c.counter_shares) > 0
  )

  if (!account) return <div>No connected wallet</div>
  if (isLoading) return <div>Loading your positions...</div>
  if (isError) return <div>Error: {(error as any)?.message}</div>
  if (filteredClaims.length === 0) return <div>No positions found</div>

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 font-medium mt-2 mb-1 flex justify-start items-center gap-2">
        Claims
        <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {filteredClaims.length}
        </span>
      </p>

      {filteredClaims.map((claim, index) => {

        console.log("CLAIM DEBUG", {
          shares: claim.shares,
          counter_shares: claim.counter_shares,
          userStake: Number(claim.shares ?? 0),
          userCounterStake: Number(claim.counter_shares ?? 0)
        })

        const triple = claim.triple
        
        
          return (
            <ClaimRowLite
              key={`${triple.id}-${index}`}
              claim={triple}
            />  
          )
      })}
    </div>
  )
}

export default MyPositionsTab

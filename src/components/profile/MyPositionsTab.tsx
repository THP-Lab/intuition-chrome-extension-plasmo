import {
  useGetClaimsByAddressQuery,
  useGetTriplesByCreatorQuery,
  useGetTriplesWithPositionsQuery
} from "@warzieram/graphql"
import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import ClaimRowLite from "../ui/ClaimRowLite"

const MyPositionsTab = () => {
  const [account] = useStorage<string>("metamask-account")

  const { data, loading, error } = useGetTriplesWithPositionsQuery({
    variables: { address: account ?? "" }
  })

  const claims = data?.triples ?? []
  const filteredClaims = claims.filter(
    (c) =>
      Number(c.term?.positions_aggregate.aggregate?.count) > 0 ||
      Number(c.counter_term?.positions_aggregate.aggregate?.count) > 0
  )

  if (!account) return <div>No connected wallet</div>
  if (loading) return <div>Loading your positions...</div>
  if (error) return <div>Error: {(error as any)?.message}</div>
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
        /* console.log("CLAIM DEBUG", {
          shares: claim.shares,
          counter_shares: claim.counter_shares,
          userStake: Number(claim.shares ?? 0),
          userCounterStake: Number(claim.counter_shares ?? 0)
        })*/

        const triple = claim

        return (
          <ClaimRowLite key={`${triple.term_id}-${index}`} claim={triple} />
        )
      })}
    </div>
  )
}

export default MyPositionsTab

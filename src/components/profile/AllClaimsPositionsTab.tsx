import React from "react"
import {
  useGetTriplesWithPositionsQuery
} from "@warzieram/graphql"

import ClaimRowLite from "../ui/ClaimRowLite"
import { useWalletAddress } from "~src/hooks/useWalletAddress";

const AllClaimsPositionsTab: React.FC = () => {
  const walletAddress = useWalletAddress()

  const { data, loading, error } = useGetTriplesWithPositionsQuery({
    variables: {
      where: {},      
      address: walletAddress ?? "" 
    }
  })

  if (!walletAddress) {
    return <div>No connected wallet</div>
  }

  if (loading) {
    return <div>Loading your positions…</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  const claims = data?.triples ?? []
  if (claims.length === 0) {
    return <div>No positions found</div>
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 font-medium mt-2 mb-1 flex items-center gap-2">
        Claims
        <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {claims.length}
        </span>
      </p>

      {claims.map((claim, idx) => (
        <ClaimRowLite
          key={`${claim.term_id}-${idx}`}
          claim={claim}
        />
      ))}
    </div>
  )
}

export default AllClaimsPositionsTab

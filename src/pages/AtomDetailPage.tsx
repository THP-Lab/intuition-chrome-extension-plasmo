import { useGetAtomQuery } from "@0xintuition/graphql"
import React from "react"
import { useParams } from "react-router-dom"

import { useStorage } from "@plasmohq/storage/hook"

import AtomDisplay from "~src/components/ui/AtomDisplay"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { useGetClaimsByAtomQuery } from "~src/graphql/src"

const AtomDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const atomId = id ?? ""
  const [walletAddress] = useStorage<string>("metamask-account")
  console.log("wallet address :", walletAddress)

  const { data, isLoading, isError, error } = useGetAtomQuery(
    { id: atomId },
    { enabled: !!atomId }
  )

  const {
    data: claimsData,
    isLoading: isLoadingClaims,
    isError: isClaimsError
  } = useGetClaimsByAtomQuery(
    { id: Number(atomId), address: walletAddress },
    { enabled: !!atomId && !!walletAddress }
  )

  const claims =
    claimsData?.claims_aggregate?.nodes.map((claim) => ({
      ...claim,
      ...claim.triple
    })) ?? []

  console.log("ClaimsData", claimsData?.claims_aggregate?.nodes)
  console.log("Claims:", claims)

  if (isLoading) return <div className="p-4">Loading identity...</div>
  if (isError)
    return (
      <div className="p-4 text-red-500">Error: {(error as any)?.message}</div>
    )
  if (!data?.atom) return <div className="p-4">No identity found</div>

  return (
    <div className="p-4 space-y-6">
      <AtomDisplay atom={data.atom} />

      <div>
        <div className="flex items-center mt-2 mb-1">
          <span className="text-sm text-gray-400">Claims</span>
          <span className="px-2 py-0.5 text-xs font semi-bold text-white bg-gray-700 rounded-full ml-2">
            {claimsData?.claims_aggregate?.aggregate?.count ?? 0}
          </span>
        </div>

        {isLoadingClaims ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Loading related claims...
          </p>
        ) : isClaimsError ? (
          <p className="mt-2 text-sm text-red-500">Error loading claims</p>
        ) : (
          <div className="mt-3 space-y-2">
            {claims.map((claim, index) => (
              <ClaimRowLite key={`${claim.id}-${index}`} claim={claim} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AtomDetailPage

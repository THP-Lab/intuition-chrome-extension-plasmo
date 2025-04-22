import { useGetAtomQuery } from "@0xintuition/graphql"
import React from "react"
import { useParams } from "react-router-dom"
import { useStorage } from "@plasmohq/storage/hook"

import AtomDisplay from "~src/components/ui/AtomDisplay"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { useGetClaimsByAtomQuery } from "~src/graphql/src"

const AtomDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const parsedAtomId = Number(id)

  const [walletAddress] = useStorage<string>("metamask-account")
  const [hasRefetched, setHasRefetched] = React.useState(false)

  const shouldRender = id && !isNaN(parsedAtomId) && walletAddress

  const { data, isLoading, isError, error } = useGetAtomQuery(
    { id: id ?? "" },
    { enabled: !!id && id.trim().length > 0 }
  )

  const {
    data: claimsData,
    isLoading: isLoadingClaims,
    isError: isClaimsError,
    refetch: refetchClaims
  } = useGetClaimsByAtomQuery(
    { id: parsedAtomId, address: walletAddress },
    { enabled: false }
  )

  React.useEffect(() => {
    setHasRefetched(false)
  }, [id])

  React.useEffect(() => {
    if (shouldRender && !hasRefetched) {
      console.log("🔁 Refetch claims triggered")
      refetchClaims()
      setHasRefetched(true)
    }
  }, [shouldRender, hasRefetched, refetchClaims])

  const claims =
    claimsData?.claims_aggregate?.nodes.map((claim) => ({
      ...claim,
      ...claim.triple
    })) ?? []

  console.log("walletAddress:", walletAddress)
  console.log("atomId:", id)
  console.log("ClaimsData", claimsData?.claims_aggregate?.nodes)
  console.log("Claims:", claims)

  if (!shouldRender) {
    return <div className="p-4">Loading identity...</div>
  }

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
          <p className="mt-2 text-sm text-muted-foreground">Loading related claims...</p>
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

export default AtomDetailPage;
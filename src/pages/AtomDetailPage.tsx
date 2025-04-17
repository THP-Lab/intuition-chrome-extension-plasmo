import React from "react"
import { useParams } from "react-router-dom"
import { useGetAtomQuery } from "@0xintuition/graphql"
import { useGetClaimsByAtomQuery }from "~src/graphql/src"
import AtomDisplay from "~src/components/ui/AtomDisplay"

const AtomDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const atomId = id ?? ""

  const { data, isLoading, isError, error } = useGetAtomQuery(
    { id: atomId },
    { enabled: !!atomId }
  )

  const {
    data: claimsData,
    isLoading: isLoadingClaims,
    isError: isClaimsError
  } = useGetClaimsByAtomQuery(
    { id: Number(atomId) },
    { enabled: !!atomId }
  )

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
          <ul className="mt-3 space-y-2">
            {claimsData?.claims_aggregate?.nodes.map((claim, index) => {
              const subject = claim.triple?.subject?.label ?? "?"
              const predicate = claim.triple?.predicate?.label ?? "?"
              const object = claim.triple?.object?.label ?? "?"
              const account = claim.account?.label ?? "Unknown"

              return (
                <li
                  key={index}
                  className="p-3 border border-border rounded-md text-sm text-muted-foreground bg-background/40"
                >
                  <strong>{account}</strong> claims that{" "}
                  <span className="text-white font-medium">{subject}</span>{" "}
                  <span className="text-pink-400">{predicate}</span>{" "}
                  <span className="text-blue-400">{object}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AtomDetailPage

import React from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { ClaimRow } from "@0xintuition/1ui"
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
      <h2 className="text-xl font-semibold">Your Positions</h2>
      {filteredClaims.map((claim, i) => {
        const triple = claim.triple
        const vault = triple?.vault
        const counter = triple?.counter_vault

        const totalTVL =
          Number(vault?.total_shares ?? 0) +
          Number(counter?.total_shares ?? 0)

        return (
          <ClaimRow
            key={claim.id}
            userPosition={claim.shares ?? "0"}
            positionDirection={"FOR"} // ou "AGAINST" si tu veux l’inférer via counter_shares
            numPositionsFor={
              vault?.position_aggregate?.aggregate?.count ?? 0
            }
            numPositionsAgainst={
              counter?.position_aggregate?.aggregate?.count ?? 0
            }
            totalTVL={totalTVL}
            tvlFor={vault?.total_shares ?? 0}
            tvlAgainst={counter?.total_shares ?? 0}
            isFirst={i === 0}
            isLast={i === filteredClaims.length - 1}
          >
            {triple?.subject?.label ?? "No subject"} -{" "}
            {triple?.predicate?.label ?? "No predicate"} -{" "}
            {triple?.object?.label ?? "No object"}
          </ClaimRow>
        )
      })}
    </div>
  )
}

export default MyPositionsTab

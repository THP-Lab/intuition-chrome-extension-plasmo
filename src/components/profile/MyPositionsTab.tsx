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
      <h2 className="text-xl font-semibold">Your Positions</h2>
      {filteredClaims.map((claim, i) => {

        console.log("CLAIM DEBUG", {
          shares: claim.shares,
          counter_shares: claim.counter_shares,
          userStake: Number(claim.shares ?? 0),
          userCounterStake: Number(claim.counter_shares ?? 0)
        })

        const triple = claim.triple

        const vault = triple?.vault
        const counterVault = triple?.counter_vault

        const numVotesFor = vault?.positions_aggregate?.aggregate?.count ?? 0
        const numVotesAgainst = counterVault?.positions_aggregate?.aggregate?.count ?? 0

        const userPosition = Number(claim.shares) > 0 ? "FOR" : "AGAINST"

        
        
          return (
            <ClaimRowLite
              key={claim.id}
              subjectLabel={triple?.subject?.label ?? "No subject"}
              subjectImage={triple?.subject?.image ?? undefined}
              predicateLabel={triple?.predicate?.label ?? "No predicate"}
              predicateImage={triple?.predicate?.image ?? undefined}
              objectLabel={triple?.object?.label ?? "No object"}
              objectImage={triple?.object?.image ?? undefined}
              numPositionsFor={numVotesFor}
              numPositionsAgainst={numVotesAgainst}
              userStake={Number(claim.shares ?? 0)}
              userCounterStake={Number(claim.counter_shares ?? 0)}
              isFirst={i === 0}
              isLast={i === filteredClaims.length - 1}
              vaultId={triple.vault?.id}
              counterVaultId={triple.counter_vault?.id}
            />
          )
      })}
    </div>
  )
}

export default MyPositionsTab

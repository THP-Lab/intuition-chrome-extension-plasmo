import React from "react"
import { useGetClaimsByAddressQuery } from "~src/graphql/src"
import { useStorage } from "@plasmohq/storage/hook"
import ClaimRowLite from "../ui/ClaimRowLite"

const RelatedClaims = () => {
  const [account] = useStorage<string>("metamask-account")

  const { data, isLoading, isError, error } = useGetClaimsByAddressQuery(
    { address: account ?? "" }, 
    { enabled: !!account }      
  )

  if (!account) return <div>No connected wallet</div>
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {(error as any)?.message}</div>
  if (!data?.claims_aggregate?.nodes?.length) return <div>No claims found</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Related Claims ({data.claims_aggregate.aggregate?.count ?? 0})
      </h2>
      
      <div className="space-y-2">
        {data.claims_aggregate.nodes.map(({ triple, shares, counter_shares }) => (
          <div key={triple.id} className="transition-colors hover:bg-accent/5 rounded-md">
            <ClaimRowLite
              subjectLabel={triple.subject?.label ?? "N/A"}
              subjectImage={triple.subject?.image ?? undefined}
              predicateLabel={triple.predicate?.label ?? "N/A"}
              predicateImage={triple.predicate?.image ?? undefined}
              objectLabel={triple.object?.label ?? "N/A"}
              objectImage={triple.object?.image ?? undefined}
              numPositionsFor={triple.vault?.positions_aggregate?.aggregate?.count ?? 0}
              numPositionsAgainst={triple.counter_vault?.positions_aggregate?.aggregate?.count ?? 0}
              userStake={Number(shares ?? 0)}
              userCounterStake={Number(counter_shares ?? 0)}
              vaultId={triple.vault?.id ?? ""}
              counterVaultId={triple.counter_vault?.id ?? ""}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedClaims
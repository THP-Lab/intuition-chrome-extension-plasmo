
import React from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { useGetTriplesByCreatorQuery } from "~src/graphql/src"
import ClaimRowLite from "../ui/ClaimRowLite"


const YourClaimsTab = () => {
  const [account] = useStorage<string>("metamask-account")

  const { data, isLoading, isError, error } = useGetTriplesByCreatorQuery(
    { address: account ?? "" },
    { enabled: !!account }
  )

  if (!account) return <div>No connected wallet</div>
  if (isLoading) return <div>Loading your claims...</div>
  if (isError) return <div>Error: {(error as any)?.message}</div>
  if (!data?.triples?.length) return <div>No claims created yet.</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Claims</h2>
      {data.triples.map((triple, i) => {
        const numPositionsFor =
          triple.vault?.positions_aggregate?.aggregate?.count ?? 0
        const numPositionsAgainst =
          triple.counter_vault?.positions_aggregate?.aggregate?.count ?? 0

        return (
          <ClaimRowLite
          key={triple.id}
          subjectLabel={triple.subject?.label}
          predicateLabel={triple.predicate?.label}
          objectLabel={triple.object?.label}
          numPositionsFor={numPositionsFor}
          numPositionsAgainst={numPositionsAgainst}
          isFirst={i === 0}
          isLast={i === data.triples.length - 1}
        />        
        )
      })}
    </div>
  )
}

  export default YourClaimsTab;


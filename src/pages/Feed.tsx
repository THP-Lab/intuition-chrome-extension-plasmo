import React, { useEffect, useState } from "react"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"

import { useGetFollowingsFromAddressQuery } from "~src/graphql/src"

function Feed() {
  const accountId = "0x25d5c9dbc1e12163b973261a08739927e4f72ba8"
  const { data, isLoading, isError } = useGetFollowingsFromAddressQuery({
    address: accountId
  })

  const followings = data?.following ?? []

  const default_img = "https://i.seadn.io/gae/PWDq8erM2dMscd99OntjFRJFfvtvki7uxeYiBUT8e59Kdbn8s34dM59kCkVZ66b687B6i8KXMDspRfnU-JbLcB9Kc23EoSydJNkmgA?auto=format&dpr=1&w=1000"
  if (!accountId) return <p>Connect your wallet</p>
  if (isLoading) return <p>Loading who you follow...</p>
  if (isError) return <p>Error loading followings</p>

  return (
    <div>
      <h1> Feed page </h1>
      {followings.map((following) => {
        const positions = following.positions_aggregate.nodes
        return (
          <>
         <p>{following.label} staked:</p>
          {positions.map((position) => (
          <>
            <p>{position.shares} ETH</p>
            <p>On :</p>
            <ClaimRowLite
              key={position.vault.triple.object.id} 
              subjectLabel={claim.subject.label ?? "No subject"}
              subjectImage={claim.subject?.image ?? undefined}
              predicateLabel={claim.predicate?.label ?? "No predicate"}
              predicateImage={claim.predicate?.image ?? undefined}
              objectLabel={claim.object?.label ?? "No object"}
              objectImage={claim.object?.image ?? undefined}
              numPositionsFor={claim.vault.positions_aggregate.aggregate?.count ?? 0}
              numPositionsAgainst={claim.counter_vault.positions_aggregate.aggregate?.count ?? 0}
              userStake={Number(claim.shares ?? 0)}
              userCounterStake={Number(claim.counter_shares ?? 0)}
              isFirst={index === 0}
              isLast={index === claims.length - 1}
            />
          </>
          ))}
          </>
        )
      })}
    </div>
  )
}

export default Feed

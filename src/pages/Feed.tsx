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
         <img src={following.image ?? default_img} className="w-8 h-8 rounded-full mt-1"/><p>{following.label} staked:</p> 
          {positions.map((position, index) => (
          <>
            <p>{position.shares} ETH</p>
            <p>On :</p>
            <ClaimRowLite
              key={position.vault.triple?.id} 
              subjectLabel={position.vault.triple?.subject.label ?? "No subject"}
              subjectImage={position.vault.triple?.subject?.image ?? undefined}
              predicateLabel={position.vault.triple?.predicate?.label ?? "No predicate"}
              predicateImage={position.vault.triple?.predicate?.image ?? undefined}
              objectLabel={position.vault.triple?.object?.label ?? "No object"}
              objectImage={position.vault.triple?.object?.image ?? undefined}
              numPositionsFor={position.vault.triple?.vault?.positions_aggregate.aggregate?.count ?? 0}
              numPositionsAgainst={position.vault.triple?.counter_vault?.positions_aggregate.aggregate?.count ?? 0}
              userStake={Number(0)}
              userCounterStake={Number(0)}
              isFirst={index === 0}
              isLast={index === positions.length - 1}
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

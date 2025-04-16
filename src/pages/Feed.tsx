import React from "react"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { useStorage } from "@plasmohq/storage/dist/hook"
import { useGetFollowingsFromAddressQuery } from "~src/graphql/src"

function Feed() {
  const [walletAddress] = useStorage<string>("metamask-account")

  const { data, isLoading, isError } = useGetFollowingsFromAddressQuery({
    address: walletAddress
  })

  const default_img = "https://i.seadn.io/gae/PWDq8erM2dMscd99OntjFRJFfvtvki7uxeYiBUT8e59Kdbn8s34dM59kCkVZ66b687B6i8KXMDspRfnU-JbLcB9Kc23EoSydJNkmgA?auto=format&dpr=1&w=1000"

  if (!walletAddress) return <p>Connect your wallet</p>
  if (isLoading) return <p>Loading who you follow...</p>
  if (isError) return <p>Error loading followings</p>

  const actions = data?.following.flatMap((user) =>
    user.positions_aggregate.nodes
      .filter((pos) => pos.vault?.triple !== null)
      .map((pos) => ({
        user,
        position: pos,
        triple: pos.vault.triple
      }))
  ) ?? []

  const sortedActions = actions.reverse()

  return (
<div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-2">Your Feed</h1>

      {sortedActions.map(({ user, position, triple }, index) => {
        if (!triple) return null

        const isFor = position.vault?.id === triple.vault?.id

          return (
          <div key={`${triple.id}-${index}`} className="border-b pb-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={user.image ?? default_img}
                alt={user.label}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium">
                {user.label}
              </span>
              <span className={`text-sm ${isFor ? "text-green-600" : "text-red-600"}`}>
                {isFor ? "voted FOR this claim:" : "voted AGAINST this claim:"}
              </span>
            </div>

            <ClaimRowLite claim={triple} />
          </div>
          )
        })
      }
    </div>
  )
}

export default Feed

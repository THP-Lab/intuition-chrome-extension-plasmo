import React from "react"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { useStorage } from "@plasmohq/storage/dist/hook"
import { useGetFollowingsFromAddressQuery } from "~src/graphql/src"

function Feed() {
  const [walletAddress] = useStorage<string>("metamask-account")

  const { data, isLoading, isError } = useGetFollowingsFromAddressQuery({
    address: walletAddress
  })

  const followings = data?.following ?? []
  const default_img = "https://i.seadn.io/gae/PWDq8erM2dMscd99OntjFRJFfvtvki7uxeYiBUT8e59Kdbn8s34dM59kCkVZ66b687B6i8KXMDspRfnU-JbLcB9Kc23EoSydJNkmgA?auto=format&dpr=1&w=1000"

  if (!walletAddress) return <p>Connect your wallet</p>
  if (isLoading) return <p>Loading who you follow...</p>
  if (isError) return <p>Error loading followings</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-2">Your Feed</h1>

      {followings.map((following) => {
        const positions = following.positions_aggregate.nodes.filter((position) => position.vault.triple !== null)

        return (
          <div key={following.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={following.image ?? default_img}
                alt={following.label}
                className="w-8 h-8 rounded-full"
              />
              <p className="font-semibold">{following.label}</p>
            </div>

            {positions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              positions.map((position, index) => {
                const triple = position.vault.triple

                if (!triple) return null

                return (
                  <div key={`${triple.id}-${index}`} className="ml-4">
                    <p className="text-sm text-gray-500 mb-1">
                      {position.shares} ETH on:
                    </p>
                    <ClaimRowLite claim={triple} />
                  </div>
                )
              })
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Feed

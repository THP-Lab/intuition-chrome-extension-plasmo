import React, { useState } from "react"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { useStorage } from "@plasmohq/storage/dist/hook"
import { useGetFollowingsFromAddressQuery } from "~src/graphql/src"

function Feed() {
  const [walletAddress] = useStorage<string>("metamask-account")
  const [filter, setFilter] = useState<"vote" | "create">("vote")

  const { data, isLoading, isError } = useGetFollowingsFromAddressQuery({
    address: walletAddress
  })

  const default_img =
    "https://i.seadn.io/gae/PWDq8erM2dMscd99OntjFRJFfvtvki7uxeYiBUT8e59Kdbn8s34dM59kCkVZ66b687B6i8KXMDspRfnU-JbLcB9Kc23EoSydJNkmgA?auto=format&dpr=1&w=1000"

  if (!walletAddress) return <p>Connect your wallet</p>
  if (isLoading) return <p>Loading who you follow...</p>
  if (isError) return <p>Error loading followings</p>

  const followings = data?.following ?? []

  const actions = followings.flatMap((user) => {
    const votes = user.positions_aggregate.nodes
      .filter((pos) => pos.vault?.triple !== null)
      .map((pos) => ({
        type: "vote",
        user,
        triple: pos.vault.triple,
        isFor: pos.vault?.id === pos.vault.triple?.vault?.id
      }))

    const creations = (user.triples || []).map((triple) => ({
      type: "create",
      user,
      triple
    }))

    return [...votes, ...creations]
  })

  const sortedActions = actions.reverse()

  const filteredActions =
    filter === "vote"
      ? sortedActions.filter((action) => action.type === "vote")
      : sortedActions.filter((action) => action.type === "create")

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold mb-4">Your Feed</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("vote")}
          className={`px-3 py-1 rounded-full border text-xs italic ${
            filter === "vote" ? "bg-white text-black font-semibold" : "border-gray-600 text-gray-400 hover:bg-gray-800"
          }`}
        >
          Votes
        </button>
        <button
          onClick={() => setFilter("create")}
          className={`px-3 py-1 rounded-full border text-xs italic ${
            filter === "create" ? "bg-white text-black font-semibold" : "border-gray-600 text-gray-400 hover:bg-gray-800"
          }`}
        >
          Creations
        </button>
      </div>

      
      {filteredActions.map((action, index) => (
        <div key={`${action.triple.id}-${index}`} className="border-b pb-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={action.user.image ?? default_img}
              alt={action.user.label}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium">{action.user.label}</span>
            {action.type === "vote" ? (
              <span
                className={`text-xs ${action.isFor ? "text-green-400" : "text-red-400"}`}
              >
                {action.isFor ? "voted FOR this claim:" : "voted AGAINST this claim:"}
              </span>
            ) : (
              <span className="text-xs">created this claim:</span>
            )}
          </div>

          <ClaimRowLite claim={action.triple} />
        </div>
      ))}
    </div>
  )
}

export default Feed

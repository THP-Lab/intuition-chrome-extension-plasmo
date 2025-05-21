import React from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { useGetFollowersFromAddressQuery } from "@warzieram/graphql"

const FollowersTab = () => {
  const [walletAddress] = useStorage<string>("metamask-account")
  //const walletAddress = "0x25d5c9dbc1e12163b973261a08739927e4f72ba8"

  const isAddressReady = !!walletAddress

  const { data, isLoading, isError, error } = useGetFollowersFromAddressQuery(
    { address: walletAddress },
    { enabled: isAddressReady } 
  )

  const followers =
  data?.triples
    ?.flatMap((t) => [
      ...(t.term?.positions ?? []),
      ...(t.counter_term?.positions ?? [])
    ])
    ?.filter((p) => p.account?.id !== walletAddress)
    ?.map((p) => p.account) ?? []

  const default_img =
    "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"

  if (!walletAddress) return <p>Connect your wallet</p>
  if (isLoading) return <p>Loading your followers...</p>
  if (isError) {
    console.error("GraphQL error", error)
    return <p>Error loading followers</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Followers</h2>
      {followers.length === 0 ? (
        <p>You don’t have any followers yet.</p>
      ) : (
        <ul className="space-y-2">
          {followers.map((follower) => (
            <li
              key={follower.id}
              className="border p-3 rounded flex items-center gap-3"
            >
              <img
                src={follower.image || default_img}
                alt={follower.label}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium text-sm">
                {follower.label || follower.id}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FollowersTab

import React from "react"
import { useWalletAddress } from "~src/hooks/useWalletAddress";
import { useGetFollowersFromAddressQuery } from "@warzieram/graphql"
import defaultImg from "~src/assets/User.jpg

const FollowersTab = () => {
  const walletAddress = useWalletAddress();
  //const walletAddress = "0x25d5c9dbc1e12163b973261a08739927e4f72ba8"

  const { data, loading, error } = useGetFollowersFromAddressQuery(
    {variables: { address: walletAddress || "" }},
  )

  const followers =
  data?.triples
    ?.flatMap((t) => [
      ...(t.term?.positions ?? []),
      ...(t.counter_term?.positions ?? [])
    ])
    ?.filter((p) => p.account?.id !== walletAddress)
    ?.map((p) => p.account) ?? []


  if (!walletAddress) return <p>Connect your wallet</p>
  if (loading) return <p>Loading your followers...</p>
  if (error) {
    console.error("GraphQL error", error)
    return <p>Error loading followers</p>
  }

  return (
    <div className="space-y-4">
      {followers.length === 0 ? (
        <p>You don’t have any followers yet.</p>
      ) : (
        <ul className="space-y-2">
          {followers.map((follower) => (
            <li
              key={follower?.id}
              className="border p-3 rounded flex items-center gap-3"
            >
              <img
                src={follower?.image || defaultImg}
                alt={follower?.label}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium text-sm">
                {follower?.label || follower?.id}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FollowersTab

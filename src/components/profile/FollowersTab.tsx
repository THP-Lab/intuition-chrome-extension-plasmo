import React from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { useGetFollowersTriplesQuery } from "~src/graphql/src"

const FollowersTab = () => {
  const [account] = useStorage<string>("metamask-account")
  // const account = "0x746e4d35f62a62c2c1b2c4c3b9d780319d887080"

  const { data } = useGetFollowersTriplesQuery(
    { accountId: account },
    { enabled: true }
  )

  console.log("QUERY KEY", useGetFollowersTriplesQuery.getKey({ accountId: account }))
  console.log("FOLLOWERS DATA", data)

  const followers = data?.triples
    .map((triple) => triple.subject)
    .filter((subject) => !!subject) ?? []

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Followers</h2>
      {followers.length === 0 && <div>No followers found</div>}
      {followers.map((follower, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 border p-2 rounded shadow-sm"
        >
          <img
            src={
              follower.image ??
              "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
            }
            alt={follower.label}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">{follower.label}</span>
        </div>
      ))}
    </div>
  )
}

export default FollowersTab

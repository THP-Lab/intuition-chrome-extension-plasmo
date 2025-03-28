import React from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { useGetFollowingsTriplesQuery } from "~src/graphql/src"

const FollowingTab = () => {
  const accountId = "0x25d5c9dbc1e12163b973261a08739927e4f72ba8"

  const { data, isLoading, isError, error} = useGetFollowingsTriplesQuery(
    { accountId },
    { enabled: !!accountId }
  )

  if (!accountId) return <p>Connect your wallet</p>
  if (isLoading) return <p>Loading who you follow...</p>
  if (isError) return <p>Error loading followings</p>

  const triples = data?.triples ?? []

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">People You Follow</h2>
      {triples.length === 0 ? (
        <p>You’re not following anyone yet.</p>
      ) : (
        <ul className="space-y-2">
          {triples.map((triple) => {
            const account = triple.object?.accounts?.[0]
            return (
              <li key={triple.id} className="border p-3 rounded">
                <p className="font-semibold">
                  {account?.id || triple.object.label}
                </p>
                {triple.object.image && (
                  <img
                    src={triple.object.image}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mt-1"
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default FollowingTab

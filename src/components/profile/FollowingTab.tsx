import React from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { useGetFollowingsFromAddressQuery, useGetFollowingsTriplesQuery } from "~src/graphql/src"

const FollowingTab = () => {
  //const walletAddress = "0x25d5c9dbc1e12163b973261a08739927e4f72ba8"
  const [walletAddress] = useStorage<string>("metamask-account")

  const { data, isLoading, isError} = useGetFollowingsFromAddressQuery({address: walletAddress});

  if (!walletAddress) return <p>Connect your wallet</p>
  if (isLoading) return <p>Loading who you follow...</p>
  if (isError) return <p>Error loading followings</p>

  const followings = data?.following ?? []
  const default_img = "https://i.seadn.io/gae/PWDq8erM2dMscd99OntjFRJFfvtvki7uxeYiBUT8e59Kdbn8s34dM59kCkVZ66b687B6i8KXMDspRfnU-JbLcB9Kc23EoSydJNkmgA?auto=format&dpr=1&w=1000"

  console.log(followings)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">People You Follow</h2>
      {followings.length === 0 ? (
        <p>You’re not following anyone yet.</p>
      ) : (
        <ul className="space-y-2">
          {followings.map((following) => {
            return (
              <li key={following.id} className="border p-3 rounded">
                <p className="font-semibold">
                  {following?.label || following.id}
                </p>
                {(
                  <img
                    src={following.image || default_img}
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

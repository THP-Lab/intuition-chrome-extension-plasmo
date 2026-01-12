import React, { useEffect, useState } from "react"
import { useGetFollowingsFromAddressQuery } from "@warzieram/graphql"
import { getAddress } from "viem"
import { useWalletAddress } from "~src/hooks/useWalletAddress";

const FollowingTab: React.FC = () => {
  const walletAddress = useWalletAddress();
  const [checksumAddress, setChecksumAddress] = useState<string | null>(null)

  useEffect(() => {
    if (!walletAddress) {
      setChecksumAddress(null)
      return
    }
    try {
      setChecksumAddress(getAddress(walletAddress))
    } catch (err) {
      console.error("Adresse invalide :", err)
      setChecksumAddress(null)
    }
  }, [walletAddress])

  const { data, loading, error } = useGetFollowingsFromAddressQuery({
    variables:  { address: checksumAddress! },
    skip: !checksumAddress
  })
  console.log("Followings data:", data)
  if (!walletAddress) {
    return <p>Connect your wallet</p>
  }
  if (loading) {
    return <p>Loading who you follow…</p>
  }
  if (error) {
    return <p>Error loading followings: {error.message}</p>
  }

  const followings = data?.following ?? []
  if (followings.length === 0) {
    return <p>You’re not following anyone yet.</p>
  }

  const defaultImg =
    "https://i.seadn.io/gae/PWDq8erM2dMscd99OntjFRJFfvtvki7uxeYiBUT8e59Kdbn8s34dM59kCkVZ66b687B6i8KXMDspRfnU-JbLcB9Kc23EoSydJNkmgA?auto=format&dpr=1&w=1000"

  return (
    <ul className="space-y-2">
      {followings.map((f) => (
        <li key={f.id} className="flex items-center gap-2 p-2 border rounded">
          <img
            src={f.image || defaultImg}
            alt={f.label || f.id}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-sm">
            {f.label || f.id}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default FollowingTab

import { useGetAtomsWithPositionsQuery } from "@0xintuition/graphql"
import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import AtomCard from "../AtomCard"

const IdentitiesVotedTab = () => {
  const [account] = useStorage<string>("metamask-account")

  const { data, isLoading, error } = useGetAtomsWithPositionsQuery(
    {
      address: account,
      where: {
        vault: {
          positions: {
            account_id: { _eq: account }
          }
        }
      }
    },
    { enabled: !!account }
  )

  console.log("Wallet:", account)
  console.log("Data:", data)

  if (!account) return <div>No connected wallet</div>
  if (isLoading) return <div>Loading your voted identities...</div>
  if (error) return <div>Error: {(error as any)?.message}</div>

  const atoms = data?.atoms
  if (!atoms?.length) return <div>You haven’t voted on any identities yet.</div>

  console.log("Atoms:", atoms)

  return (
    <div>
      <div className="flex items-center mt-2 mb-1">
        <span className="text-xs text-gray-400">Identities</span>
        <span className="px-2 py-0.5 text-xs font-semibold text-white bg-gray-700 rounded-full ml-2">
          {atoms.length}
        </span>
      </div>

      {atoms.map((atom) =>
        atom?.id ? <AtomCard key={atom.id} atom={atom} /> : null
      )}
    </div>
  )
}

export default IdentitiesVotedTab

import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { useGetAtomsWithPositionsQuery } from "@warzieram/graphql"

import AtomCard from "../AtomCard"

const IdentitiesVotedTab = () => {
  const [account] = useStorage<string>("metamask-account")

  const { data, isLoading, error } = useGetAtomsWithPositionsQuery(
    {
      address: account,
      where: {
        term: {
          positions: {
            account_id: { _eq: account }
          }
        }
      }
    },
    { enabled: !!account }
  )

  const atomsWithTags = data?.atoms.map((atom) => {
    const tags = atom.as_subject_triples_aggregate?.nodes
      ?.filter((claim) => claim.predicate.label === "has tag")
      .map((claim) => claim.object)
      .filter(Boolean)

    const uniqueTags = Array.from(
      new Map(tags.map(tag => [tag.term_id, tag])).values()
    )

    return {
      ...atom,
      tags: uniqueTags
    }
  })

  console.log("Wallet:", account)
  console.log("Data:", data)
  console.log("Atoms with Claims:", data?.atoms)

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

      {atomsWithTags.map((atom) =>
        atom?.term_id ? (
          <AtomCard key={atom.term_id} atom={atom} tags={atom.tags} />
        ) : null
      )}
    </div>
  )
}

export default IdentitiesVotedTab

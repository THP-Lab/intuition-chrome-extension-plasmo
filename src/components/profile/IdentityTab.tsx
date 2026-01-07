import React from "react"
import { useGetAtomsByCreatorQuery } from "@warzieram/graphql"
import AtomCard from "~src/components/AtomCard"
import { useWalletAddress } from "~src/hooks/useWalletAddress";

const IdentityTab = () => {
  const walletAddress = useWalletAddress();

  const { data, loading, error } = useGetAtomsByCreatorQuery(
    {variables: { address: walletAddress ?? "" }},
  )

  if (!walletAddress) return <div>No connected wallet</div>
  if (loading) return <div>Loading your atoms...</div>
  if (error) return <div>Error: {(error as any)?.message}</div>
  if (!data?.atoms?.length) return <div>No atoms created yet.</div>

  const atoms = data.atoms

  const AtomsWithTags = atoms.map((atom) => {
    const tags = atom.as_subject_triples_aggregate.nodes
    .filter(claim => claim.predicate.label === "has tag")
    .map(claim => claim.object)
    .map(claim => claim.object)
    .filter(Boolean)

    const uniqueTags = Array.from(
      new Map(tags.map(tag => [tag?.term_id, tag])).values()
    )

    return {
      ...atom,
      tags: uniqueTags
    }
  })


  console.log("Atoms with claims:", AtomsWithTags)


  return (
    <div>
      <p className="text-xs text-gray-400 font-medium mt-2 mb-1 flex justify-start items-center gap-2">
        Identities
        <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {atoms.length}
        </span>
      </p>

      {AtomsWithTags.map((atom) => (
        <AtomCard key={atom.term_id} atom={atom} tags={atom.tags} />
      ))}
    </div>
  )
}

export default IdentityTab

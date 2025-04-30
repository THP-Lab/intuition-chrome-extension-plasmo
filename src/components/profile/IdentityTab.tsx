import React from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { useGetAtomsByCreatorQuery } from "~src/graphql/src"
import AtomCard from "~src/components/AtomCard"

const IdentityTab = () => {
  const [walletAddress] = useStorage<string>("metamask-account")

  const { data, isLoading, isError, error } = useGetAtomsByCreatorQuery(
    { address: walletAddress ?? "" },
    { enabled: !!walletAddress }
  )

  if (!walletAddress) return <div>No connected wallet</div>
  if (isLoading) return <div>Loading your atoms...</div>
  if (isError) return <div>Error: {(error as any)?.message}</div>
  if (!data?.atoms?.length) return <div>No atoms created yet.</div>

  const atoms = data.atoms

  const AtomsWithTags = atoms.map((atom) => {
    const tags = atom.
    as_subject_claims_aggregate.nodes
    .filter(claim => claim.predicated.label === "has tag")
    .map(claim => claim.object?.label)
    .filter(Boolean)

    const uniqueTags = [...new Set(tags)]
  })

  console.log("Atoms with claims:", data.atoms)


  return (
    <div>
      <p className="text-xs text-gray-400 font-medium mt-2 mb-1 flex justify-start items-center gap-2">
        Identities
        <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {atoms.length}
        </span>
      </p>

      {AtomsWithTags.map((atom) => (
        <AtomCard key={atom.id} atom={atom} tags={uniqueTags} />
      ))}
    </div>
  )
}

export default IdentityTab

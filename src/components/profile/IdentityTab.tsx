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

  return (
    <div>
      {atoms.map((atom) => (
        <AtomCard key={atom.id} atom={atom} />
      ))}
    </div>
  )
}

export default IdentityTab

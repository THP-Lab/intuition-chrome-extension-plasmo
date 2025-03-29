import React, { useState } from "react"
import { useCreatePosition } from "~src/hooks/useCreatePosition"

export function VoteButtons({
  vaultId,
  counterVaultId
}: {
  vaultId: bigint
  counterVaultId: bigint
}) {
  const { createPosition } = useCreatePosition()
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVote = async (isFor: boolean) => {
    setIsVoting(true)
    setError(null)
    try {
      const targetVault = isFor ? vaultId : counterVaultId
      await createPosition({ vaultId: targetVault })
      alert(`Vote ${isFor ? "pour" : "contre"} enregistré !`)
    } catch (err: any) {
      setError(err.message || "Erreur lors du vote")
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleVote(true)}
        disabled={isVoting}
        className="text-for border border-for rounded-md px-2 py-1 hover:bg-for hover:text-white"
      >
        Pour
      </button>
      <button
        onClick={() => handleVote(false)}
        disabled={isVoting}
        className="text-against border border-against rounded-md px-2 py-1 hover:bg-against hover:text-white"
      >
        Contre
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

export default VoteButtons

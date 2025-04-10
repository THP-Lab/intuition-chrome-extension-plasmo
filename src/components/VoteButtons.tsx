import React, { useState } from "react"
import { useCreatePosition } from "~src/hooks/useCreatePosition"

export function VoteButtons({
  vaultId,
  counterVaultId,
  numPositionsFor,
  numPositionsAgainst
}: {
  vaultId: bigint
  counterVaultId: bigint
  numPositionsFor?: number
  numPositionsAgainst?: number
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
      alert(`Vote ${isFor ? "for" : "against"} save !`)
    } catch (err: any) {
      setError(err.message || "Error when voting")
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => handleVote(true)}
          disabled={isVoting}
          className="text-for border border-for rounded-md px-2 py-1 hover:bg-for hover:text-white"
        >
          <span className="text-for">↑ {numPositionsFor ?? 0}</span>
          
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={isVoting}
          className="text-against border border-against rounded-md px-2 py-1 hover:bg-against hover:text-white"
        >
          <span className="text-against">↓ {numPositionsAgainst ?? 0}</span>
        </button>
      </div>
      <div className="flex gap-4 text-sm">
        
      </div>
      {error && <p className="text-red-500 text-sm mt-1">Transaction failed</p>}

    </>
  )
}

export default VoteButtons

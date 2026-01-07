import React, { useState, useEffect } from "react"
import { useDepositTerm } from "~src/hooks/useDepositTerm"
import { cn } from "~src/lib/utils"

export type VoteChoice = "for" | "against"

export function VoteButtons({
  vaultId,
  counterVaultId,
  numPositionsFor,
  numPositionsAgainst,
  initialVote,
}: {
  vaultId: `0x${string}` // en réalité term_id bytes32
  counterVaultId: `0x${string}`
  numPositionsFor?: number
  numPositionsAgainst?: number
  initialVote?: VoteChoice
}) {
  const { depositTerm } = useDepositTerm()

  const [voteChoice, setVoteChoice] = useState<VoteChoice | null>(initialVote ?? null)
  const [hasLocalVote, setHasLocalVote] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // ✅ n’écrase pas un vote local tant que GraphQL n’est pas à jour
    if (!hasLocalVote) setVoteChoice(initialVote ?? null)
  }, [initialVote, hasLocalVote])

  const handleVote = async (isFor: boolean) => {
    setIsVoting(true)
    setError(null)
    try {
      const targetTerm = isFor ? vaultId : counterVaultId
      await depositTerm(targetTerm)
      setHasLocalVote(true)
      setVoteChoice(isFor ? "for" : "against")
    } catch (err: any) {
      setError(err?.message || "Error when voting")
    } finally {
      setIsVoting(false)
    }
  }

  const forDisabled = isVoting || voteChoice === "against"
  const againstDisabled = isVoting || voteChoice === "for"

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => handleVote(true)}
          disabled={forDisabled}
          className={cn(
            "border rounded-md px-2 py-1 text-sm transition-transform duration-200 ease-in-out",
            voteChoice === "for"
              ? "bg-gray-400 text-black scale-110"
              : "border-gray-400 text-white hover:bg-gray-400 hover:text-black hover:scale-110",
            forDisabled && voteChoice !== "for" ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          ↑ {numPositionsFor ?? 0}
        </button>

        <button
          onClick={() => handleVote(false)}
          disabled={againstDisabled}
          className={cn(
            "border rounded-md px-2 py-1 text-sm transition-transform duration-200 ease-in-out",
            voteChoice === "against"
              ? "bg-gray-400 text-black scale-110"
              : "border-gray-400 text-white hover:bg-gray-400 hover:text-black hover:scale-110",
            againstDisabled && voteChoice !== "against" ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          ↓ {numPositionsAgainst ?? 0}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>
  )
}

export default VoteButtons

import React, { useState } from "react"
import { useCreatePosition } from "~src/hooks/useCreatePosition"
import VoteButtons from "./ui/VoteButtons"


interface ClaimVoteButtonsProps {
  vaultId: bigint
  counterVaultId: bigint
}

export const ClaimVoteButtons = ({ vaultId, counterVaultId }: ClaimVoteButtonsProps) => {
  const [isVoting, setIsVoting] = useState<"for" | "against" | null>(null)
  const { createPosition } = useCreatePosition()

  const handleVote = async (direction: "for" | "against") => {
    setIsVoting(direction)
    try {
      await createPosition({
        vaultId: direction === "for" ? vaultId : counterVaultId
      })
    } catch (err) {
      console.error("Vote failed:", err)
    } finally {
      setIsVoting(null)
    }
  }

  return (
    <div className="flex gap-2">
      <VoteButtons
        onVoteFor={() => console.log("Vote FOR", subjectLabel)}
        onVoteAgainst={() => console.log("Vote AGAINST", subjectLabel)}
      />
    </div>
  )
}

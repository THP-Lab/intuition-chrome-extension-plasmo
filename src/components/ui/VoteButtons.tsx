import React, { useState } from "react"

function VoteButtons({
  onVoteFor,
  onVoteAgainst,
  disabled = false
}: {
  onVoteFor: () => void
  onVoteAgainst: () => void
  disabled?: boolean
}) {
  const [voted, setVoted] = useState<"for" | "against" | null>(null)

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          onVoteFor()
          setVoted("for")
        }}
        disabled={disabled || voted === "for"}
        className="text-xs px-2 py-1 rounded border border-for text-for hover:bg-for hover:text-white transition"
      >
        👍 
      </button>

      <button
        onClick={() => {
          onVoteAgainst()
          setVoted("against")
        }}
        disabled={disabled || voted === "against"}
        className="text-xs px-2 py-1 rounded border border-against text-against hover:bg-against hover:text-white transition"
      >
        👎
      </button>
    </div>
  )
}

export default VoteButtons
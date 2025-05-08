import React, { useState } from "react"
import AtomAutocompleteInput from "./AtomAutocompleteInput"
import { useCreateTriples } from "~src/hooks/useCreateTriples"
import { useCreatePosition } from "~src/hooks/useCreatePosition"
import { Multivault } from "@0xintuition/protocol"
import { getClients } from "~src/lib/viemClient"

interface TagCreatorProps {
  subjectAtom: {
    id: string
    label: string
    vault_id: string
  }
  onTagCreated?: () => void
}

const TagCreator: React.FC<TagCreatorProps> = ({ subjectAtom, onTagCreated }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<any | null>(null)
  const [vote, setVote] = useState<"for" | "against" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { addTriple, createTriples, clearTriples } = useCreateTriples()
  const { createPosition } = useCreatePosition()

  const handleSubmit = async () => {
    if (!selectedTag || !vote) return 

    setIsSubmitting(true)
    setError(null)

    try {
      addTriple([
        BigInt(subjectAtom.vault_id),
        BigInt(4),
        BigInt(selectedTag.vault_id)
      ])

      const { vaultIds } = await createTriples()

      const { walletClient, publicClient } = await getClients()
      const multivault = new Multivault({ walletClient, publicClient })

      let targetVaultId = vaultIds[0]
      if (vote === "against") {
        const counterId = await multivault.getCounterIdFromTriple(vaultIds[0])
        if (!counterId) throw new Error("No counter vault for triple")
        targetVaultId = counterId
      }
      
      await createPosition({ vaultId: targetVaultId })

      // Reset local state
      setIsOpen(false)
      setSelectedTag(null)
      setVote(null)
      clearTriples()
      onTagCreated?.()

    } catch (err: any) {
      setError(err.message || "An error occurred")
    }
    
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-4 space-y-2">
      {!isOpen ? (
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        className="text-xs text-blue-400 hover:underline"
      >
        + Add a tag
      </button>
      ) : (
        <div className="space-y-2">
          <AtomAutocompleteInput
            label="Tag"
            onSelect={setSelectedTag}
            selected={selectedTag}
          />
        </div>  
      )}

      {selectedTag && (
        <div className="flex gap-4 items-center">
          <label className="flex gap-2 items-center text-sm">
            <input
              type="radio"
              name="vote"
              value="for"
              checked={vote === "for"}
              onChange={() => setVote("for")}
            />
            FOR
          </label>

          <label className="flex gap-2 items-center text-sm">
            <input
              type="radio"
              name="vote"
              value="against"
              checked={vote === "against"}
              onChange={() => setVote("against")}
              />
              AGAINST
          </label>
        </div>
      )}

      {vote && (
        <button
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      )}
    </div>
  )
}


export default TagCreator; 
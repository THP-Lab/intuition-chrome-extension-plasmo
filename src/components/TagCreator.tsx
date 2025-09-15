import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import AtomAutocompleteInput from "./AtomAutocompleteInput"
import { useCreateTriples } from "~src/hooks/useCreateTriples"
import { useCreatePosition } from "~src/hooks/useCreatePosition"
import { MultiVaultAbi } from "@0xintuition/protocol"
import { getClients } from "~src/lib/viemClient"

interface AtomProps {
  term_id: string
  label?: string | null
  vault_id?: string
}

interface TagCreatorProps {
  subjectAtom: AtomProps;
  onTagCreated?: () => void
}

const TagCreator: React.FC<TagCreatorProps> = ( {subjectAtom, onTagCreated} ) => {

  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<any | null>(null)
  const [vote, setVote] = useState<"for" | "against" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { addTriple, createTriples, clearTriples } = useCreateTriples()
  const { createPosition } = useCreatePosition()

  useLayoutEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])
  
  useEffect(() => {
    console.log('Reset on atom change');
    setIsOpen(false);
    setSelectedTag(null);
    setVote(null);
  }, [subjectAtom]);

  
  const handleSubmit = async () => {
    if (!selectedTag || !vote) return 

    const subjectVault = subjectAtom.vault_id ?? subjectAtom.term_id;
    const objectVault = selectedTag.vault_id ?? selectedTag.term_id;

    if (!subjectVault || !objectVault) {
      setError("Missing vault_id");
      return;
    }

    const subjectId = BigInt(subjectVault);
    const predicateId = 4n;
    const objectId = BigInt(objectVault);

    setIsSubmitting(true)
    setError(null)

    try {
      addTriple([subjectId, predicateId, objectId]);

      const { vaultIds } = await createTriples()

      const { walletClient, publicClient } = await getClients()
      const multivault = new MultiVaultAbi({ walletClient, publicClient })

      let targetVaultId = vaultIds[0]
      if (vote === "against") {
        const counterId = await multivault.getCounterIdFromTriple(vaultIds[0])
        if (!counterId) throw new Error("No counter vault for triple")
        targetVaultId = counterId
      }
      
      console.log("▶️ TagCreator: calling createPosition on vault", targetVaultId); 
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
    <>
      {!isOpen ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full border border-gray-600
                    hover:bg-gray-400 hover:text-black hover:scale-110
                    transition-all duration-200 ease-in-out"
        >
          +
        </button>
      ) : (
        <div className="w-full mt-1">
          <AtomAutocompleteInput
            label="Tag"
            onSelect={setSelectedTag}
            selected={selectedTag}
            inputRef={inputRef}
          />
          {selectedTag && (
            <div className="mt-3 flex gap-4 items-center mt-2">
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
              className="mt-3 w-20 px-4 py-2 btn-atom-form-hover-effect text-foreground bg-[hsl(var(--btn-atom-form-bg))] text-center rounded-xl"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          )}
        </div>
      )}
    </>

  )
}


export default TagCreator; 

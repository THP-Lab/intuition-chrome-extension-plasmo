import React, { useState } from 'react'
import AtomAutocompleteInput from './AtomAutocompleteInput'
import { useCreateTriples } from '~src/hooks/useCreateTriples'
import { useCreatePosition } from '~src/hooks/useCreatePosition'
import { getClients } from "~src/lib/viemClient"
import { Multivault } from "@0xintuition/protocol"

interface Atom {
  id: string
  label: string
  vault_id: string
}

type TripleWithVote = {
  triple: [Atom, Atom, Atom]
  vote: "for" | "against" | null
}

const TripleForm: React.FC = () => {
  const [subject, setSubject] = useState<Atom | null>(null)
  const [predicate, setPredicate] = useState<Atom | null>(null)
  const [object, setObject] = useState<Atom | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [progressMessage, setProgressMessage] = useState<string | null>(null)
  const [labeledTriples, setLabeledTriples] = useState<TripleWithVote[]>([])
  const { createPosition } = useCreatePosition()

  const updateVote = (index: number, newVote: "for" | "against") => {
    setLabeledTriples(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, vote: newVote } : item
      )
    )
  }

  const canSubmit = labeledTriples.length > 0 && labeledTriples.every(t => t.vote !== null)

  const {
    addTriple,
    clearTriples,
    removeTriple,
    triples,
    createTriples,
    isLoading,
    error,
    txHash,
    vaultIds
  } = useCreateTriples()

  const handleRemoveTriple = (index: number) => {
    setLabeledTriples((prev) => prev.filter((_, i) => i !== index))
    removeTriple(index)
  }

  const handleAddTriple = () => {
    if (!subject || !predicate || !object) {
      setErrorMessage("All three atoms must be selected.")
      return
    }
  
    try {
      addTriple([
        BigInt(subject.vault_id),
        BigInt(predicate.vault_id),
        BigInt(object.vault_id)
      ])
      setLabeledTriples((prev) => [
        ...prev,
        {
          triple: [subject, predicate, object],
          vote: null
        }
      ])
      setSubject(null)
      setPredicate(null)
      setObject(null)
      setErrorMessage(null)
    } catch (err: any) {
      setErrorMessage("Invalid vault IDs or atoms.")
    }
  }


  const handleSubmitAll = async () => {
    setErrorMessage(null)
  
    try {
      if (triples.length === 0) {
        setErrorMessage("Please add at least one triple to submit.")
        return
      }
  
      setProgressMessage("Transaction 1/2: Creating triples...")
      const { vaultIds: createdVaultIds } = await createTriples()
  
      if (!createdVaultIds || createdVaultIds.length !== labeledTriples.length) {
        throw new Error("Mismatch between created triples and local list")
      }
  
      setProgressMessage("Triples created. Preparing to vote...")
  
      const { walletClient, publicClient } = await getClients()
      const multivault = new Multivault({ walletClient, publicClient })

      setProgressMessage("Transaction 2/2: Voting on your claims...")
  
      for (let i = 0; i < createdVaultIds.length; i++) {
        const vote = labeledTriples[i].vote
        const vaultId = createdVaultIds[i]
  
        let targetVaultId = vaultId
  
        if (vote === "against") {
          const counterId = await multivault.getCounterIdFromTriple(vaultId)
          if (!counterId) throw new Error("No counter vault for triple")
          targetVaultId = counterId
        }
  
        await createPosition({ vaultId: targetVaultId })
      }
  
      setProgressMessage("✅ All votes submitted!")
      setLabeledTriples([])
      clearTriples()
      setSubject(null)
      setPredicate(null)
      setObject(null)
    } catch (err: any) {
      setErrorMessage(err.message || "An unknown error occurred.")
    }
  }
  

  return (
    <div className="space-y-6">
      {labeledTriples.map((item, i) => {
        const triple = item.triple ?? [null, null, null]
        const vote = item.vote ?? null

        const [s, p, o] = triple

        if (!s || !p || !o) return null

        return (
          <li key={i} className="flex flex-col gap-2 border-b pb-2">
            <div className="flex justify-between items-center">
              <span>{s.label} → {p.label} → {o.label}</span>
              <button
                onClick={() => handleRemoveTriple(i)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-4 pl-4">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name={`vote-${i}`}
                  value="for"
                  checked={vote === "for"}
                  onChange={() => updateVote(i, "for")}
                />
                FOR
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name={`vote-${i}`}
                  value="against"
                  checked={vote === "against"}
                  onChange={() => updateVote(i, "against")}
                />
                AGAINST
              </label>
            </div>
          </li>
        )
      })}

      <form
        className="space-y-4 p-4 bg-background rounded"
        onSubmit={(e) => e.preventDefault()}
      >
        <AtomAutocompleteInput label="Subject" onSelect={setSubject} selected={subject} />
        <AtomAutocompleteInput label="Predicate" onSelect={setPredicate} selected={predicate} />
        <AtomAutocompleteInput label="Object" onSelect={setObject} selected={object} />

        <div className="flex gap-8 justify-center">
          <button
            type="button"
            onClick={handleAddTriple}
            className="w-20 px-4 py-2 btn-atom-form-hover-effect text-foreground bg-[hsl(var(--btn-atom-form-bg))] text-center rounded-xl"
          >
            Add
          </button>

          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={isLoading || !canSubmit}
            className="w-20 px-4 py-2 btn-atom-form-hover-effect text-foreground bg-[hsl(var(--btn-atom-form-bg))] text-center rounded-xl"
          >
            {isLoading ? "Send..." : triples.length > 1 ? "Submit all" : "Submit"}
          </button>
        </div>

        {txHash && <p className="text-green-600 text-sm">Tx: {txHash}</p>}
        {vaultIds && <p className="text-green-600 text-sm">Vaults: {vaultIds.join(', ')}</p>}
        {progressMessage && <p className="text-green-600 text-sm">{progressMessage}</p>}
        {(errorMessage || error) && (
          <p className="text-red-600 text-sm">{errorMessage || error}</p>
        )}
      </form>
    </div>
  )
}

export default TripleForm
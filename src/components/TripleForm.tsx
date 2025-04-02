import React, { useState } from 'react'
import AtomAutocompleteInput from './AtomAutocompleteInput'
import { useCreateTriples } from '~src/hooks/useCreateTriples'

interface Atom {
  id: string
  label: string
  vault_id: string
}

type LabeledTriple = [Atom, Atom, Atom]

const TripleForm: React.FC = () => {
  const [subject, setSubject] = useState<Atom | null>(null)
  const [predicate, setPredicate] = useState<Atom | null>(null)
  const [object, setObject] = useState<Atom | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [progressMessage, setProgressMessage] = useState<string | null>(null)
  const [labeledTriples, setLabeledTriples] = useState<LabeledTriple[]>([])

  const {
    addTriple,
    triples,
    createTriples,
    isLoading,
    error,
    txHash,
    vaultIds
  } = useCreateTriples()

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
      setLabeledTriples((prev) => [...prev, [subject, predicate, object]])

      setSubject(null)
      setPredicate(null)
      setObject(null)
      setErrorMessage(null)
    } catch (err: any) {
      setErrorMessage("Invalid vault IDs or atoms.")
    }
  }

  const handleRemoveTriple = (index: number) => {
    setLabeledTriples((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitAll = async () => {
    if (triples.length === 0) {
      setErrorMessage("No triples to submit.")
      return
    }

    try {
      setProgressMessage("Submitting triples...")
      await createTriples()
      setProgressMessage("Triples submitted successfully!")
    } catch (err: any) {
      setErrorMessage(err.message || 'An unknown error occurred.')
    }
  }

  return (
    <div className="space-y-6">
      {labeledTriples.length > 0 && (
        <div className="bg-muted p-4 rounded">
          <h3 className="font-semibold mb-2">Triples en attente :</h3>
          <ul className="list-disc pl-6 space-y-1">
            {labeledTriples.map(([s, p, o], i) => (
              <li key={i} className="flex justify-between items-center">
              <span>{s.label} → {p.label} → {o.label}</span>
              <button
                onClick={() => handleRemoveTriple(i)}
                className="ml-4 text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form className="space-y-4 p-4 bg-background rounded" onSubmit={(e) => e.preventDefault()}>
        <AtomAutocompleteInput label="Subject" onSelect={setSubject} selected={subject} />
        <AtomAutocompleteInput label="Predicate" onSelect={setPredicate} selected={predicate} />
        <AtomAutocompleteInput label="Object" onSelect={setObject} selected={object} />

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleAddTriple}
            className="px-4 py-2 bg-accent hover:bg-accent-foreground text-white rounded"
          >
            Add</button>

          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={isLoading}
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded"
          >
            {isLoading ? "Send..." : "Submit all triples"}
          </button>
        </div>

        {txHash && <p className="text-green-600 text-sm">Transaction hash: {txHash}</p>}
        {vaultIds && <p className="text-green-600 text-sm">Vault IDs: {vaultIds.join(', ')}</p>}
        {progressMessage && <p className="text-green-600 text-sm">{progressMessage}</p>}
        {errorMessage || error ? <p className="text-red-600 text-sm">{errorMessage || error}</p> : null}
      </form>
    </div>
  )
}

export default TripleForm

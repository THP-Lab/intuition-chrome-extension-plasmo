import React, { useState } from 'react'
import { useCreateTriple } from '../hooks/useCreateTriple'

const CreateTripleForm: React.FC = () => {
  const [subjectId, setSubjectId] = useState('')
  const [predicateId, setPredicateId] = useState('')
  const [objectId, setObjectId] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const { createTriple, isLoading, error, txHash } = useCreateTriple()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Création du triple...')

    try {
      const { vaultId, hash } = await createTriple(
        BigInt(subjectId),
        BigInt(predicateId),
        BigInt(objectId)
      )

      setStatus(`Triple créé ! Vault ID: ${vaultId} | Tx: ${hash}`)
    } catch (err) {
      setStatus('Erreur lors de la création du triple.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <input
        placeholder="Subject ID"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        placeholder="Predicate ID"
        value={predicateId}
        onChange={(e) => setPredicateId(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        placeholder="Object ID"
        value={objectId}
        onChange={(e) => setObjectId(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Création en cours...' : 'Créer le triple'}
      </button>

      {status && <p className="text-sm mt-2">{status}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}

export default CreateTripleForm

import React, { useState } from 'react'
import AtomAutocompleteInput from './AtomAutocompleteInput'
import { Multivault } from '@0xintuition/protocol'
import { getClients } from '../lib/viemClient'

interface Atom {
  id: string;
  label: string;
}

const CreateTripleForm: React.FC = () => {
  const [subject, setSubject] = useState<Atom | null>(null)
  const [predicate, setPredicate] = useState<Atom | null>(null)
  const [object, setObject] = useState<Atom | null>(null)

  const [progressMessage, setProgressMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setProgressMessage('Creating triple...')
    setErrorMessage(null)

    try {
      if (!subject || !predicate || !object) {
        throw new Error('All three atoms must be selected.')
      }

      const { walletClient, publicClient } = await getClients()
      const multivault = new Multivault({ walletClient, publicClient })

      const tripleCost = await multivault.getTripleCost()

      const existing = await multivault.getTripleIdFromAtoms(
        BigInt(subject.id),
        BigInt(predicate.id),
        BigInt(object.id)
      )
      if (existing) {
        throw new Error("Triple already exists with vault ID " + existing.toString());
      }


      const { vaultId, hash } = await multivault.createTriple({
        subjectId: BigInt(subject.id),
        predicateId: BigInt(predicate.id),
        objectId: BigInt(object.id),
        initialDeposit: 0n,
        wait: true,
      })

      setProgressMessage(`Triple created with vault ID ${vaultId.toString()} (tx: ${hash})`)
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 rounded">
      <AtomAutocompleteInput
        label="Subject"
        onSelect={(atom) => {
          console.log("Subject sélectionné :", atom.id);
          setSubject(atom)
        }}
      />
      <AtomAutocompleteInput
        label="Prédicat"
        onSelect={(atom) => {
          console.log("Prédicat sélectionné :", atom.id);
          setPredicate(atom);
        }}
      />
      <AtomAutocompleteInput
        label="Objet"
        onSelect={(atom) => {
          console.log("Objet sélectionné :", atom.id);
          setObject(atom);
        }}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        {isSubmitting ? 'Creating...' : 'Create Triple'}
      </button>

      {progressMessage && <p className="text-green-600 text-sm">{progressMessage}</p>}
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
    </form>
  )
}

export default CreateTripleForm

import React, { useState } from 'react'
import AtomAutocompleteInput from './AtomAutocompleteInput'
import { Multivault } from '@0xintuition/protocol'
import { getClients } from '../lib/viemClient'

interface Atom {
  id: string
  label: string
}

const TripleForm: React.FC = () => {
  const [subject, setSubject] = useState<Atom | null>(null)
  const [predicate, setPredicate] = useState<Atom | null>(null)
  const [object, setObject] = useState<Atom | null>(null)

  const [progressMessage, setProgressMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checkVaultExists = async (
    multivault: Multivault,
    vaultId: bigint,
    label: string
  ): Promise<boolean> => {
    try {
      await multivault.getVaultState(vaultId)
      console.log(` Vault "${label}" (${vaultId}) exists.`)
      return true
    } catch (err) {
      console.warn(` Vault "${label}" (${vaultId}) does NOT exist.`)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setProgressMessage('Checking inputs...')
    setErrorMessage(null)


    try {
      if (!subject || !predicate || !object) {
        throw new Error('All three atoms must be selected.')
      }

      const { walletClient, publicClient } = await getClients()
      const multivault = new Multivault({ walletClient, publicClient })

      const balance = await publicClient.getBalance({
        address: walletClient.account.address,
      })

      const tripleCost = await multivault.getTripleCost()

      if (balance < tripleCost) {
        throw new Error(
          `Insufficient funds: you need at least ${tripleCost} wei`,
        )
      }

      const subjectId = BigInt(subject.vault_id)
      const predicateId = BigInt(predicate.vault_id)
      const objectId = BigInt(object.vault_id)


      const [subjectExists, predicateExists, objectExists] = await Promise.all([
        checkVaultExists(multivault, subjectId, subject.label),
        checkVaultExists(multivault, predicateId, predicate.label),
        checkVaultExists(multivault, objectId, object.label),
      ])
      
      if (!subjectExists || !predicateExists || !objectExists) {
        throw new Error('One or more of the selected atoms do not exist on-chain.')
      }

      
      const existing = await multivault.getTripleIdFromAtoms(
        subjectId,
        predicateId,
        objectId,
      )

      if (existing) {
        throw new Error(
          `Triple already exists with vault ID ${existing.toString()}`,
        )
      }

      setProgressMessage('Creating triple...')

      const { vaultId, hash } = await multivault.createTriple({
        subjectId,
        predicateId,
        objectId,
        initialDeposit: tripleCost,
        wait: true,
      })

      setProgressMessage(
        `Triple created with vault ID ${vaultId.toString()} (tx: ${hash})`,
      )
    } catch (err: any) {
      console.error('Error:', err)
      if (err?.walk) {
        const revert = err.walk((e: any) => e.name === 'ContractFunctionRevertedError')
        if (revert) {
          console.error('Smart contract reverted with error:', revert)
        }
      }
      setErrorMessage(err.message || 'An unknown error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 rounded">
      <AtomAutocompleteInput
        label="Subject"
        onSelect={(atom) => setSubject(atom)}
      />
      <AtomAutocompleteInput
        label="Predicate"
        onSelect={(atom) => setPredicate(atom)}
      />
      <AtomAutocompleteInput
        label="Object"
        onSelect={(atom) => setObject(atom)}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        {isSubmitting ? 'Creating...' : 'Create Triple'}
      </button>

      {progressMessage && (
        <p className="text-green-600 text-sm">{progressMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}
    </form>
  )
}

export default TripleForm

import { useState, useCallback } from 'react'
import { Multivault } from '@0xintuition/protocol'
import { getClients } from '../lib/viemClient'

type TripleInput = [bigint, bigint, bigint]

export const useCreateTriples = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<any>(null)
  const [vaultIds, setVaultIds] = useState<bigint[] | null>(null)

  const createTriples = useCallback(async (triples: TripleInput[]) => {
    setIsLoading(true)
    setError(null)
    setTxHash(null)
    setReceipt(null)
    setVaultIds(null)

    try {
      const { walletClient, publicClient } = await getClients()
      const multivault = new Multivault({ walletClient, publicClient })

      const costPerTriple = await multivault.getTripleCost()
      const totalCost = costPerTriple * BigInt(triples.length)

      const triplesFormatted = triples.map(([s, p, o]) => ({
        subjectId: s,
        predicateId: p,
        objectId: o,
      }))

      const { hash, vaultIds, events } = await multivault.batchCreateTriple(triplesFormatted)

      setTxHash(hash)
      setVaultIds(vaultIds)
      setReceipt(events)

      return { hash, vaultIds }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Unknown error')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    createTriples,
    isLoading,
    error,
    txHash,
    receipt,
    vaultIds,
  }
}

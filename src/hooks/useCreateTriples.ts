import { useState, useCallback } from 'react'
import { Multivault } from '@0xintuition/protocol'
import { getClients } from '../lib/viemClient'
import { parseEventLogs } from 'viem'
import { abi } from '@0xintuition/protocol'

export type TripleInput = [bigint, bigint, bigint]

export const useCreateTriples = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<any>(null)
  const [termIds, setTermIds] = useState<bigint[] | null>(null)
  const [triples, setTriples] = useState<TripleInput[]>([])

  const addTriple = (triple: TripleInput) => {
    setTriples((prev) => [...prev, triple])
  }

  const removeTriple = (index: number) => {
    setTriples((prev) => prev.filter((_, i) => i !== index))
  }

  const clearTriples = () => {
    setTriples([])
  }

  const createTriples = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setTxHash(null)
    setReceipt(null)
    setTermIds(null)

    try {
      const { walletClient, publicClient } = await getClients()
      const multivault = new Multivault({ walletClient, publicClient })

      if (triples.length === 0) throw new Error("No triples to create")

      const costPerTriple = await multivault.getTripleCost()
      const totalCost = costPerTriple * BigInt(triples.length)

      const subjectIds = triples.map(([s]) => s)
      const predicateIds = triples.map(([, p]) => p)
      const objectIds = triples.map(([, , o]) => o)

      const hash = await multivault.contract.write.batchCreateTriple(
        [subjectIds, predicateIds, objectIds],
        {
          value: totalCost,
          account: walletClient.account.address,
        }
      )

      const { logs, status } = await publicClient.waitForTransactionReceipt({ hash })
      if (status === 'reverted') throw new Error('Triple creation tx reverted')

      const parsed = parseEventLogs({ abi, logs, eventName: 'TripleCreated' })

      const createdVaultIds = parsed.map((e) => e.args.vaultID)

      if (createdVaultIds.length !== triples.length) {
        throw new Error("Mismatch between created triples and local list")
      }

      setTermIds(createdVaultIds)
      setTxHash(hash)
      setReceipt(parsed)

      return { hash, termIds: createdVaultIds }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Unknown error')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [triples])

  return {
    addTriple,
    removeTriple,
    clearTriples,
    createTriples,
    triples,
    isLoading,
    error,
    txHash,
    receipt,
    termIds,
  }
}


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
    setVaultIds(null)
  
    try {
      const { walletClient, publicClient } = await getClients()
      const multivault = new Multivault({ walletClient, publicClient })
  
      const costPerTriple = await multivault.getTripleCost()
      const totalCost = costPerTriple * BigInt(triples.length)
  
      const subjectIds = triples.map(([s]) => s)
      const predicateIds = triples.map(([, p]) => p)
      const objectIds = triples.map(([, , o]) => o)
  
      await multivault.contract.simulate.batchCreateTriple(
        [subjectIds, predicateIds, objectIds],
        {
          value: totalCost,
          account: walletClient.account.address,
        }
      )
  
      const { hash } = await multivault.contract.write.batchCreateTriple(
        [subjectIds, predicateIds, objectIds],
        {
          value: totalCost,
        }
      )
  
      const { logs, status } = await publicClient.waitForTransactionReceipt({ hash })
      if (status === 'reverted') {
        throw new Error('Transaction reverted')
      }
  
      const vaultIds = logs
        .filter((log) => log.eventName === 'TripleCreated')
        .map((log) => log.args.vaultID)
  
      setTxHash(hash)
      setVaultIds(vaultIds)
      setReceipt(logs)
  
      return { hash, vaultIds }
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
    vaultIds,
  }
}

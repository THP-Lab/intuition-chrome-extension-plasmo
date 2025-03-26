import { useCallback, useState } from 'react'
import { parseEther } from 'viem'
import { getClients } from '../lib/viemClient'
import { Multivault } from '@0xintuition/protocol'

export const useCreateTriple = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)
  const [receipt, setReceipt] = useState<any>(null)

  const createTriple = useCallback(async (subjectId: bigint, predicateId: bigint, objectId: bigint) => {
    setIsLoading(true)
    setError(null)
    setTxHash(null)
    setReceipt(null)

    try {
      const { walletClient, publicClient } = await getClients()
      const multivault = new Multivault({ walletClient, publicClient })

      const tripleCost = await multivault.getTripleCost()
      const deposit = parseEther('0.00001') 

      const { vaultId, hash, events } = await multivault.createTriple({
        subjectId,
        predicateId,
        objectId,
        initialDeposit: deposit,
        wait: true,
      })

      setTxHash(hash)
      setReceipt(events)
      return { vaultId, hash }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Unknown error')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    createTriple,
    isLoading,
    error,
    txHash,
    receipt,
  }
}

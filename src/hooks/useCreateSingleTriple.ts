// src/hooks/useCreateSingleTriple.ts
import { useCallback, useState } from "react"
import { EthMultiVault } from "@0xintuition/protocol"
import { getClients } from "../lib/viemClient"

export function useCreateSingleTriple() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [vaultId, setVaultId] = useState<bigint | null>(null)

  const createSingleTriple = useCallback(
    async (tripleInput: [bigint, bigint, bigint]) => {
      setIsLoading(true)
      setError(null)
      setTxHash(null)
      setVaultId(null)
      try {
        const { walletClient, publicClient } = await getClients()
        const multivault = new EthMultiVault({ walletClient, publicClient })
        const cost = await multivault.getTripleCost()
        const { vaultId, hash } = await multivault.createTriple({
          subjectId: tripleInput[0],
          predicateId: tripleInput[1],
          objectId: tripleInput[2],
          initialDeposit: cost,
          wait: true
        })
        setVaultId(vaultId)
        setTxHash(hash)
        return { vaultId, hash }
      } catch (e: any) {
        setError(e.message || "Erreur inconnue")
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return { createSingleTriple, isLoading, error, txHash, vaultId }
}
import { useCallback } from "react"
import { Multivault } from "@0xintuition/protocol"
import { getClients } from "~src/lib/viemClient"

export function useCreatePosition() {
  const createPosition = useCallback(
    async ({
      vaultId,
      amount = 1_000_000_000_000n // Valeur par défaut, à ajuster si nécessaire
    }: {
      vaultId: bigint
      amount?: bigint
    }) => {
      try {
        const { walletClient, publicClient } = await getClients()
        const multivault = new Multivault({ walletClient, publicClient })

        const balance = await publicClient.getBalance({
          address: walletClient.account.address
        })

<<<<<<< HEAD
        if (balance < amount) { 
=======
        if (balance < amount) {
>>>>>>> 5e66094 (add voting system)
          throw new Error("Insufficient balance to create a position")
        }

        // Simulate the deposit to catch potential errors early
        await multivault.contract.simulate.depositAtom([
          walletClient.account.address,
          vaultId
        ], {
          value: amount,
          account: walletClient.account.address
        })

        const txHash = await multivault.contract.write.depositAtom([
          walletClient.account.address,
          vaultId
        ], {
          value: amount
        })

        return txHash
      } catch (err: any) {
        console.error("Error creating position:", err)
        throw err
      }
    },
    []
  )

  return { createPosition }
}

import { useCallback } from "react"
import { Multivault } from "@0xintuition/protocol"
import { getClients } from "~src/lib/viemClient"

export function useCreateAtomPosition() {
  const createAtomPosition = useCallback(
    async ({
      vaultId,
      amount = 30_000_000_000_000n
    }: {
      vaultId: bigint
      amount?: bigint
    }) => {
      try {
        console.log("🔵 Starting atom position creation")
        const { walletClient, publicClient } = await getClients()
        const address = walletClient.account.address

        const balance = await publicClient.getBalance({ address })
        if (balance < amount) {
          throw new Error("Insufficient balance")
        }

        const multivault = new Multivault({ walletClient, publicClient })

        await multivault.contract.simulate.depositAtom([address, vaultId], {
          value: amount,
          account: address,
        })

        const txHash = await multivault.contract.write.depositAtom(
          [address, vaultId],
          { value: amount }
        )

        console.log("Atom vote submitted. Tx:", txHash)
        return txHash
      } catch (err: any) {
        console.error("Error voting on atom:", err)
        throw err
      }
    },
    []
  )

  return { createAtomPosition }
}

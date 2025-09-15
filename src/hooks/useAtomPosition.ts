import { useCallback, useState } from "react"
import { EthMultiVault } from "@0xintuition/protocol"
import { getClients } from "~src/lib/viemClient"

export function useAtomPosition() {
  const [isVoting, setIsVoting] = useState(false)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)
  const [error, setError] = useState<string | null>(null)


  const atomPosition = useCallback(
    async (vaultId: bigint) => {
      setIsVoting(true)
      setTxHash(null)
      setError(null)

      try {
        console.log("🔵 Starting atom position creation")

        const { walletClient, publicClient } = await getClients()
        const multivault = new EthMultiVault({ walletClient, publicClient })
        const address = walletClient.account.address

        const config = await multivault.getGeneralConfig()
        const amount = config.minDeposit

        const balance = await publicClient.getBalance({ address })
        if (balance < amount) {
          throw new Error("Insufficient balance")
        }


        await multivault.contract.simulate.depositAtom([address, vaultId], {
          value: amount,
          account: address,
        })

        const txHash = await multivault.contract.write.depositAtom(
          [address, vaultId], { 
            value: amount,
            account: address,
          })

        console.log("Atom vote submitted. Tx:", txHash)
        return txHash
      } catch (err: any) {
        console.error("Error voting on atom:", err)
        throw err
      } finally {
        setIsVoting(false)
      }
    },
    []
  )

  return {
    atomPosition,
    isVoting,
    txHash,
    error
  }
}

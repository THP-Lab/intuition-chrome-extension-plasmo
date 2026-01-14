// ~src/hooks/useAtomPosition.ts
import { useCallback, useState } from "react"
import { decodeErrorResult } from "viem"
import { getClients } from "~src/lib/viemClient"
import { MultiVaultAbi, deposit } from "@0xintuition/protocol"
import { MULTIVAULT_ADDRESS, SELECTED_CHAIN } from "~src/lib/config"
import { toBytes32, type Hex32 } from "~src/lib/utils"

type Address = `0x${string}`

type AtomPositionOpts = {
  assets?: bigint
  curveId?: bigint
  minShares?: bigint
  receiver?: Address
  wait?: boolean
}

type Precheck = {
  minDeposit: bigint | "unknown"
  termExists: boolean | "unknown"
  vaultOpen: boolean | "unknown"
  standardOpen: boolean | "unknown"
  curveOk: boolean | "unknown"
}

// ... garde tes helpers precheckDeposit + getMinDepositSafe tels quels

export function useAtomPosition() {
  const [isVoting, setIsVoting] = useState(false)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)
  const [error, setError] = useState<string | null>(null)

  const atomPosition = useCallback(
    async (termIdInput: string | bigint | Hex32, opts: AtomPositionOpts = {}) => {
      setIsVoting(true)
      setTxHash(null)
      setError(null)

      try {
        const { walletClient, publicClient } = await getClients()
        if (!walletClient || !publicClient) throw new Error("Wallet not connected")

        // ✅ caller = address directe
        const caller = walletClient.account as Address
        if (!caller) throw new Error("No wallet account")

        const chainId = publicClient.chain?.id
        if (!chainId) throw new Error("Unknown chain id")
        if (chainId !== SELECTED_CHAIN.id) {
          throw new Error(`Wrong chain: expected ${SELECTED_CHAIN.id}, got ${chainId}.`)
        }

        // ✅ MV address = config (option A)
        const mvAddress = MULTIVAULT_ADDRESS as Address

        const termId = toBytes32(termIdInput)
        const receiver = (opts.receiver ?? caller) as Address
        const curveId = opts.curveId ?? 0n
        const minShares = opts.minShares ?? 0n

        // Montant à déposer
        let assets = opts.assets
        if (assets === undefined) {
          assets = await getMinDepositSafe(publicClient, mvAddress)
        }

        // Balance check si assets > 0
        if (assets > 0n) {
          const balance = await publicClient.getBalance({ address: caller })
          if (balance < assets) {
            throw new Error(`Insufficient balance: need ${assets} wei`)
          }
        }

        const report = await precheckDeposit(publicClient, mvAddress, termId, curveId)
        console.info("[deposit precheck]", report)

        if (report.termExists === false) throw new Error("Term not found (create the atom first).")
        if (report.curveOk === false) throw new Error(`Curve ${curveId} not enabled.`)
        if (report.vaultOpen === false || report.standardOpen === false) {
          throw new Error("Vault/standard not open for deposits.")
        }
        if (typeof report.minDeposit === "bigint" && report.minDeposit > 0n) {
          if ((assets ?? 0n) < report.minDeposit) {
            throw new Error(`MinDepositNotMet: need at least ${report.minDeposit} wei`)
          }
        }

        // Simulation
        await publicClient.simulateContract({
          address: mvAddress,
          abi: MultiVaultAbi,
          functionName: "deposit",
          account: caller,
          args: [receiver, termId, curveId, minShares],
          value: assets,
        })

        // ✅ Write via protocol helper (homogène v2)
        const hash = await deposit(
          { address: mvAddress, walletClient, publicClient },
          { args: [receiver, termId, curveId, minShares], value: assets }
        )

        setTxHash(hash)
        if (opts.wait) {
          await publicClient.waitForTransactionReceipt({ hash })
        }
        return hash
      } catch (err: any) {
        let msg = err?.shortMessage || err?.message || "Transaction failed"
        const data = err?.data ?? err?.cause?.data
        if (data) {
          try {
            const decoded = decodeErrorResult({ abi: MultiVaultAbi, data })
            const name = decoded?.errorName || "Reverted"
            const argsStr = decoded?.args
              ?.map((a: any) => (typeof a === "bigint" ? a.toString() : String(a)))
              .join(", ")
            msg = argsStr ? `${name}(${argsStr})` : name
          } catch {}
        }
        setError(msg)
        throw new Error(msg)
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
    error,
    reset() {
      setIsVoting(false)
      setTxHash(null)
      setError(null)
    },
  }
}

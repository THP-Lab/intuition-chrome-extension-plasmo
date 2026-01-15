import { useCallback, useState } from "react"
import type { Account } from "viem"
import { getClients } from "~src/lib/viemClient"
import { deposit, MultiVaultAbi } from "@0xintuition/protocol"
import { MULTIVAULT_ADDRESS, SELECTED_CHAIN } from "../lib/config"
import { decodeErrorResult } from "viem"

type Hex32 = `0x${string}`
type Address = `0x${string}`


function accountToAddress(account: Account | Address | undefined): Address {
  if (!account) throw new Error("No wallet account")
  return (typeof account === "string" ? account : (account.address as Address))
}

const ABI_READ = [
  {
    type: "function",
    name: "previewDeposit",
    stateMutability: "view",
    inputs: [{ type: "bytes32" }, { type: "uint256" }, { type: "uint256" }],
    outputs: [{ type: "uint256" }, { type: "uint256" }],
  },
] as const

function isBelowMinDeposit(e: any): boolean {
  const m = (e?.shortMessage || e?.message || "").toLowerCase()
  return m.includes("depositbelowminimumdeposit") || m.includes("below minimum deposit")
}

function normalizeTermId32(termId: Hex32): Hex32 {
  if (termId.length === 66) return termId
  throw new Error(`Invalid termId: expected bytes32, got "${termId}"`)
}

async function getDefaultCurveId(publicClient: any, mvAddress: Address): Promise<bigint> {
  try {
    const res: any = await publicClient.readContract({
      address: mvAddress,
      abi: MultiVaultAbi,
      functionName: "getBondingCurveConfig",
      args: [],
    })
    const id = (res?.defaultCurveId ?? res?.[0] ?? 1n) as bigint
    return id > 0n ? id : 1n
  } catch {
    return 1n
  }
}

async function resolveCurveId(
  publicClient: any,
  mvAddress: Address,
  account: Address,
  termId32: Hex32,
  defaultCurveId: bigint | null
): Promise<bigint> {
  const candidates = [2n, defaultCurveId ?? 0n, 1n, 0n]
    .filter((x, i, a) => a.indexOf(x as bigint) === i) as bigint[]

  for (const cid of candidates) {
    try {
      await publicClient.simulateContract({
        address: mvAddress,
        abi: [
          {
            type: "function",
            name: "deposit",
            stateMutability: "payable",
            inputs: [
              { name: "receiver", type: "address" },
              { name: "termId", type: "bytes32" },
              { name: "curveId", type: "uint256" },
              { name: "minShares", type: "uint256" },
            ],
            outputs: [{ type: "uint256" }],
          },
        ] as const,
        functionName: "deposit",
        account,
        args: [account, termId32, cid, 0n],
        value: 1_000_000_000_000_000n, // 0.001
      })
      return cid
    } catch {}
  }
  return defaultCurveId ?? 1n
}

async function getMinAcceptedDepositWei(
  publicClient: any,
  mvAddress: Address,
  account: Address,
  receiver: Address,
  termId32: Hex32,
  curveId: bigint
): Promise<bigint> {
  const balance = await publicClient.getBalance({ address: account })
  const cap = (balance * 95n) / 100n

  let value = 10_000_000_000_000_000n // 0.01 ETH starting point
  let attempts = 0

  console.log(`[getMinAcceptedDepositWei] Starting with ${value} wei (${Number(value) / 1e18} ETH)`)
  console.log(`[getMinAcceptedDepositWei] Balance: ${balance} wei, Cap: ${cap} wei`)

  while (attempts++ < 20) {
    try {
      console.log(`[getMinAcceptedDepositWei] Attempt ${attempts}: Trying with ${value} wei (${Number(value) / 1e18} ETH)`)
      
      await publicClient.simulateContract({
        address: mvAddress,
        abi: [
          {
            type: "function",
            name: "deposit",
            stateMutability: "payable",
            inputs: [
              { name: "receiver", type: "address" },
              { name: "termId", type: "bytes32" },
              { name: "curveId", type: "uint256" },
              { name: "minShares", type: "uint256" },
            ],
            outputs: [{ type: "uint256" }],
          },
        ] as const,
        functionName: "deposit",
        account,
        args: [receiver, termId32, curveId, 0n],
        value,
      })
      
      const buffer = value / 100n + 1n // +1%
      const res = value + buffer
      console.log(`[getMinAcceptedDepositWei] ✅ Success! Minimum deposit: ${res} wei (${Number(res) / 1e18} ETH)`)
      return res <= cap ? res : cap
    } catch (e: any) {
      if (isBelowMinDeposit(e)) {
        console.log(`[getMinAcceptedDepositWei] ⚠️ Below minimum, doubling value...`)
        value *= 2n
        if (value > cap) {
          console.error(`[getMinAcceptedDepositWei] ❌ Minimum exceeds balance!`)
          const err: any = new Error(`Minimum deposit exceeds available balance. Required: ${value} wei (${Number(value) / 1e18} ETH), Available: ${balance} wei`)
          err.code = "INSUFFICIENT_BALANCE_FOR_MIN"
          err.requiredWei = value
          err.balanceWei = balance
          throw err
        }
        continue
      }

      console.error(`[getMinAcceptedDepositWei] ❌ Unexpected error:`, e)
      const data = e?.data || e?.cause?.data
      if (data) {
        try { 
          const decoded = decodeErrorResult({ abi: MultiVaultAbi, data })
          console.warn("Decoded error:", decoded) 
        } catch {}
      }
      throw e
    }
  }

  throw new Error("Failed to find a policy-accepted minimum within 20 attempts.")
}

export function useDepositTerm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)
  const [error, setError] = useState<string | null>(null)

  const depositTerm = useCallback(
    async (termId: Hex32, opts?: { amountWei?: bigint; receiver?: Address }) => {
      setIsSubmitting(true)
      setTxHash(null)
      setError(null)

      try {
        const termId32 = normalizeTermId32(termId)
        const { walletClient, publicClient } = await getClients()
        if (!walletClient || !publicClient) throw new Error("Wallet not connected")

        // ✅ IMPORTANT: account est une address (pas .address)
        const caller = accountToAddress(walletClient.account)
        if (!caller) throw new Error("No wallet account")

        const chainId = publicClient.chain?.id
        if (!chainId) throw new Error("Unknown chain id")
        if (chainId !== SELECTED_CHAIN.id) {
          throw new Error(`Wrong chain: expected ${SELECTED_CHAIN.id}, got ${chainId}.`)
        }

        const mvAddress = MULTIVAULT_ADDRESS as Address

        console.log(`[depositTerm] Starting deposit:`, {
          termId: termId32,
          caller,
          chainId,
          mvAddress,
          network: SELECTED_CHAIN.name
        })

        // sanity-check
        await publicClient.readContract({
          address: mvAddress,
          abi: MultiVaultAbi,
          functionName: "getBondingCurveConfig",
          args: [],
        })

        const receiver = opts?.receiver ?? caller

        // curve
        const defaultCurveId = await getDefaultCurveId(publicClient, mvAddress)
        const usedCurveId = await resolveCurveId(publicClient, mvAddress, caller, termId32, defaultCurveId)
        console.log(`[depositTerm] Curve ID: ${usedCurveId}`)

        // amount
        const valueWei =
          opts?.amountWei ??
          (await getMinAcceptedDepositWei(publicClient, mvAddress, caller, receiver, termId32, usedCurveId))

        console.log(`[depositTerm] Final deposit amount: ${valueWei} wei (${Number(valueWei) / 1e18} ETH)`)

        // minShares (slippage)
        let minShares = 0n
        try {
          const [shares] = await publicClient.readContract({
            address: mvAddress,
            abi: ABI_READ,
            functionName: "previewDeposit",
            args: [termId32, usedCurveId, valueWei],
          })
          minShares = (shares * 9900n) / 10_000n // 1%
        } catch {
          minShares = 0n
        }

        // simulate
        try {
          console.log(`[depositTerm] Simulating deposit...`)
          await publicClient.simulateContract({
            address: mvAddress,
            abi: MultiVaultAbi,
            functionName: "deposit",
            account: caller,
            args: [receiver, termId32, usedCurveId, minShares],
            value: valueWei,
          })
          console.log(`[depositTerm] ✅ Simulation successful`)
        } catch (e: any) {
          console.error(`[depositTerm] ❌ Simulation failed:`, e)
          const data = e?.data || e?.cause?.data
          if (data) {
            try { 
              const decoded = decodeErrorResult({ abi: MultiVaultAbi, data })
              console.warn("Decoded simulation error:", decoded)
            } catch {}
          }
          throw e
        }

        // send
        console.log(`[depositTerm] Sending transaction...`)
        const hash = await deposit(
          { address: mvAddress, walletClient, publicClient },
          { args: [receiver, termId32, usedCurveId, minShares], value: valueWei }
        )

        console.log(`[depositTerm] ✅ Transaction sent: ${hash}`)
        setTxHash(hash)
        return hash
      } catch (err: any) {
        console.error(`[depositTerm] ❌ Error:`, err)
        const msg = err?.shortMessage || err?.message || "Transaction failed"
        setError(msg)
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    []
  )

  return {
    depositTerm,
    isSubmitting,
    txHash,
    error,
    reset() {
      setIsSubmitting(false)
      setTxHash(null)
      setError(null)
    },
  }
}

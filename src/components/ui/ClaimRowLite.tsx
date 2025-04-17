import React from "react"

import VoteButtons from "~src/components/VoteButtons"
import { cn } from "~src/lib/utils"

import { PopupAtom } from "./PopupAtom"

interface ClaimRowLiteProps {
  claim: {
    id: string
    subject: any
    predicate: any
    object: any
    vault?: {
      id?: string
      positions?: any[]
      positions_aggregate?: {
        aggregate?: {
          count?: number
        } | null
      }
    } | null
    counter_vault?: {
      id?: string
      positions?: any[]
      positions_aggregate?: {
        aggregate?: {
          count?: number
        } | null
      }
    } | null
  }
}

const ClaimRowLite = ({ claim }: ClaimRowLiteProps) => {
  const {
    subject,
    predicate,
    object,
    id,
    vault: maybeVault,
    counter_vault: maybeCounterVault
  } = claim

  const vault = maybeVault || {}
  const counterVault = maybeCounterVault || {}

  const numPositionsFor =
    vault.positions_aggregate?.aggregate?.count ?? vault.positions?.length ?? 0

  const numPositionsAgainst =
    counterVault.positions_aggregate?.aggregate?.count ??
    counterVault.positions?.length ??
    0

  const userStake = Number(vault?.positions?.[0]?.shares ?? 0)
  const userCounterStake = Number(counterVault?.positions?.[0]?.shares ?? 0)

  const vaultId = vault.id
  const counterVaultId = counterVault.id

  return (
    <div
      className={cn(
        "flex justify-between items-center p-3 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl mt-3 claims-hover-effect"
      )}>
      <div className="flex gap-1 items-center flex-wrap flex-1 min-w-0">
        <PopupAtom key={`${id}-subject`} atom={subject} />
        <PopupAtom key={`${id}-predicate`} atom={predicate} />
        <PopupAtom key={`${id}-object`} atom={object} />
      </div>

      {vaultId && counterVaultId ? (
        <div className="flex flex-col items-end gap-1">
          <VoteButtons
            vaultId={BigInt(vaultId)}
            counterVaultId={BigInt(counterVaultId)}
            numPositionsFor={numPositionsFor}
            numPositionsAgainst={numPositionsAgainst}
          />
          {userStake > 0 ? (
            <div className="text-sm text-green-600">You have voting FOR</div>
          ) : userCounterStake > 0 ? (
            <div className="text-sm text-red-600">You have voting AGAINST</div>
          ) : null}
        </div>
      ) : (
        <div className="text-xs text-gray-500">Missing ID</div>
      )}
    </div>
  )
}

export default ClaimRowLite

import React from "react"
import { cn } from "~src/lib/utils"
import { PopupAtom } from "./PopupAtom"
import VoteButtons from "~src/components/VoteButtons"

interface ClaimRowLiteProps {
  claim: any
}

export const ClaimRowLite = ({ claim }: ClaimRowLiteProps) => {
  const triple = claim ?? claim.triple

  // Extraction sécurisée du créateur
  const creator = (claim as any)?.triple.creator

  const vault = triple.vault ?? {}
  const counterVault = triple.counter_vault ?? {}

  const subject = triple.subject ?? claim.subject
  const predicate = triple.predicate ?? claim.predicate
  const object = triple.object ?? claim.object

  const vaultId = vault.id ?? claim.vault_id
  const counterVaultId = counterVault.id ?? claim.counter_vault_id

  const numPositionsFor =
    vault.positions_aggregate?.aggregate?.count ??
    vault.position_count ??
    vault.positions?.length ?? 0

  const numPositionsAgainst =
    counterVault.positions_aggregate?.aggregate?.count ??
    counterVault.position_count ??
    counterVault.positions?.length ?? 0

  const userStake = Number(vault?.positions?.[0]?.shares ?? 0)
  const userCounterStake = Number(counterVault?.positions?.[0]?.shares ?? 0)


  console.log("LE CREATOOOOOOOOOOOOOOOOOOOORR",creator)

  return (
    <div
      className={cn(
        "flex justify-between items-center p-3 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl mt-3 claims-hover-effect"
      )}>
      <div className="flex gap-1 items-center flex-wrap flex-1 min-w-0">
        <PopupAtom key={`${claim.id}-subject`} atom={subject} />
        <PopupAtom key={`${claim.id}-predicate`} atom={predicate} />
        <PopupAtom key={`${claim.id}-object`} atom={object} />
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
      <div>
        <p>create by {creator.label}</p>
      </div>
    </div>
  )
}

export default ClaimRowLite

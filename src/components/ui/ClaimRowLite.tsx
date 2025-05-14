import React from "react"
import { Link } from "react-router-dom"
import { cn } from "~src/lib/utils"
import { PopupAtom } from "./PopupAtom"
import VoteButtons from "~src/components/VoteButtons"

interface ClaimRowLiteProps {
  claim: any
}

export const ClaimRowLite = ({ claim }: ClaimRowLiteProps) => {
  try {
    // Guard against missing claim
    if (!claim) {
      console.error("ClaimRowLite: missing claim, raw data:", claim)
      return <div className="text-xs text-gray-500">Invalid claim data</div>
    }

    const triple = (claim.triple as any) ?? claim


    const subject = triple.subject ?? claim.subject
    const predicate = triple.predicate ?? claim.predicate
    const object = triple.object ?? claim.object

    const creator = (triple as any)?.creator ?? (claim as any)?.creator

    const vault = claim.vault ?? (claim.triple as any)?.vault ?? {}
    const counterVault = claim.counter_vault ?? (claim.triple as any)?.counter_vault ?? {}

    const vaultId = vault.id ?? (claim as any).vault_id
    const counterVaultId = counterVault.id ?? (claim as any).counter_vault_id

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

    const initialVote: VoteChoice | undefined =
      userStake > 0
        ? "for"
        : userCounterStake > 0
        ? "against"
        : undefined
        
    return (
      <div
        className={cn(
          "flex justify-between items-center p-3 border border-border/10 bg-[hsl(var(--claims-bg))] rounded-xl mt-3 claims-hover-effect"
        )}>

        <div className="flex flex-col">
          <div className="flex gap-1 items-center flex-wrap">
            
            <PopupAtom key={`${claim.id}-subject`} atom={subject} />
            <PopupAtom key={`${claim.id}-predicate`} atom={predicate} />
            <PopupAtom key={`${claim.id}-object`} atom={object} />
          </div>
          {creator && (
            <p className="mt-2 text-xs text-gray-500">
            Created by{' '}
            <a
              href={`https://portal.intuition.systems/app/atom/${creator.id}?tab=portfolio`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {creator.label}
            </a>
          </p>
          )}
        </div>
        <div>
        {vaultId && counterVaultId ? (
          <div className="flex">
            <VoteButtons
              vaultId={BigInt(vaultId)}
              counterVaultId={BigInt(counterVaultId)}
              numPositionsFor={numPositionsFor}
              numPositionsAgainst={numPositionsAgainst}
              initialVote={initialVote}
            />
          </div>
        ) : (
          <div className="text-xs text-gray-500">Missing ID</div>
        )}
        </div>
      </div>
    )
  } catch (err) {
    console.error("ClaimRowLite: error rendering claim, raw data:", claim, err)
    // Optionally show raw JSON on error
    return (
      <pre className="p-2 bg-red-100 text-red-700 overflow-auto">
        {JSON.stringify(claim, null, 2)}
      </pre>
    )
  }
}

export default ClaimRowLite

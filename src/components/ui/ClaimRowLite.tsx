import React from "react"
import { Link } from "react-router-dom"
import { cn } from "~src/lib/utils"
import { PopupAtom } from "./PopupAtom"
import VoteButtons, { type VoteChoice } from "~src/components/VoteButtons"
import type { GetTriplesWithPositionsQuery, Triples } from "~node_modules/@warzieram/graphql/dist"

interface ClaimRowLiteProps {
  claim: GetTriplesWithPositionsQuery['triples'][number]
}

export const ClaimRowLite = ({ claim }: ClaimRowLiteProps) => {
  try {
    // Guard against missing claim
    if (!claim) {
      console.error("ClaimRowLite: missing claim, raw data:", claim)
      return <div className="text-xs text-gray-500">Invalid claim data</div>
    }

    const triple = claim


    const subject = triple.subject ?? claim.subject
    const predicate = triple.predicate ?? claim.predicate
    const object = triple.object ?? claim.object

    const creator = (triple as any)?.creator ?? (claim as any)?.creator

    const vault = triple?.term?.vaults.at(0)
    const counterVault = triple.counter_term?.vaults.at(0)

    const vaultId = triple.term_id
    const counterVaultId = triple?.counter_term_id

    const numPositionsFor = vault?.position_count

    const numPositionsAgainst = counterVault?.position_count

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
              href={`https://portal.intuition.systems/app/atom/${creator.term_id}?tab=portfolio`}
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

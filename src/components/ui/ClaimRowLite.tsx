import React from "react"
import { cn } from "~src/lib/utils"
import { PopupAtom } from "./PopupAtom"
import VoteButtons, { type VoteChoice } from "~src/components/VoteButtons"
import type { AtomProps } from "~src/components/AtomCard"

interface VaultProps {
  total_shares?: string | null
  position_count?: number | null
  positions?: Array<{ shares?: string | null }>
}

interface TermWithVaults {
  vaults?: VaultProps[] | null
  positions_aggregate?: {
    aggregate?: {
      count?: number | null
    }
  } | null
}

interface ClaimRowLiteProps {
  claim: {
    term_id: string
    counter_term_id?: string
    subject: AtomProps
    predicate: AtomProps
    object: AtomProps
    positions_aggregate?: {
      aggregate?: {
        count?: number | null
      }
    } | null
    counter_positions_aggregate?: {
      aggregate?: {
        count?: number | null
      }
    } | null
    positions?: Array<{ shares?: string | null }>
    counter_positions?: Array<{ shares?: string | null }>

    creator?: {
      id: string
      label?: string | null
      type?: string | null
    }
    term?: TermWithVaults | null
    counter_term?: TermWithVaults | null
  }
}

export const ClaimRowLite = ({ claim }: ClaimRowLiteProps) => {
  try {
    if (!claim) {
      console.error("ClaimRowLite: missing claim, raw data:", claim)
      return <div className="text-xs text-gray-500">Invalid claim data</div>
    }

    const triple = claim
    console.log("VUE TRIPLE CLAIMROWLITE",triple)

    const subject = triple.subject ?? claim.subject
    const predicate = triple.predicate ?? claim.predicate
    const object = triple.object ?? claim.object

    const creator = (triple as any)?.creator ?? (claim as any)?.creator


    const vaultId = triple.term_id
    const counterVaultId = triple?.counter_term_id 
    console.log("VAULT ID", vaultId)
    console.log("COUNTER VAULT ID", counterVaultId)

    const numPositionsFor =
      triple?.term?.positions_aggregate?.aggregate?.count

    const numPositionsAgainst =
      triple?.counter_term?.positions_aggregate?.aggregate?.count

    const userStake = Number(triple?.positions?.[0]?.shares ?? 0)
    const userCounterStake = Number(triple?.counter_positions?.[0]?.shares ?? 0)

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

            <PopupAtom key={`${claim.term_id}-subject`} atom={subject} />
            <PopupAtom key={`${claim.term_id}-predicate`} atom={predicate} />
            <PopupAtom key={`${claim.term_id}-object`} atom={object} />
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
                numPositionsFor={numPositionsFor || 0}
                numPositionsAgainst={numPositionsAgainst || 0}
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

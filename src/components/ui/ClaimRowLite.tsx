import React from "react"
import { cn } from "~src/lib/utils"
import VoteButtons from "~src/components/VoteButtons"
import { PopupAtom } from "./PopupAtom"

interface ClaimRowLiteProps {
  subjectLabel: string
  subjectImage?: string
  predicateLabel: string
  predicateImage?: string
  objectLabel: string
  objectImage?: string
  numPositionsFor: number
  numPositionsAgainst: number
  userStake: number
  userCounterStake: number
  isFirst?: boolean
  isLast?: boolean
  vaultId: string
  counterVaultId: string
  subjectId: string
  predicateId: string
  objectId: string
}

export const ClaimRowLite = ({
  subjectLabel,
  subjectImage,
  predicateLabel,
  predicateImage,
  objectLabel,
  objectImage,
  numPositionsFor,
  numPositionsAgainst,
  userStake,
  userCounterStake,
  isFirst = true,
  isLast = true,
  vaultId,
  counterVaultId,
  subjectId,
  predicateId,
  objectId
}: ClaimRowLiteProps) => {
  const isFor = userStake > 0
  return (
    <div
      className={cn(
          'flex justify-between items-center p-3 border border-border/10 bg-[oklch(var(--container-background))] rounded-xl mt-3 claims-hover-effect'
        )}
    >
      <div className="flex gap-1 items-center flex-wrap flex-1 min-w-0">
        <React.Fragment>
          {[
            { label: subjectLabel, img: subjectImage, id: subjectId },
            { label: predicateLabel, img: predicateImage, id: predicateId },
            { label: objectLabel, img: objectImage, id: objectId }
          ].map((atom, index) => {
            // Debug log pour voir ce qui est passé à PopupAtom
            console.log(`Passing to PopupAtom ${index}:`, atom);
            
            return (
              <PopupAtom
                key={`${atom.id}-${index}`}
                id={atom.id}
                label={atom.label}
                image={atom.img}
                type={atom.label}
                className="flex items-center gap-1 border border-[oklch(var(--borderAtom))] rounded-full px-2 py-1 text-sm text-foreground bg-[oklch(var(--triple-background))] w-fit flex-shrink-0"
              />
            );
          })}
        </React.Fragment>
      </div>

      <div className="flex gap-2 text-sm mr-4 flex-shrink-0">
        <span className="text-for">↑ {numPositionsFor}</span>
        <span className="text-against">↓ {numPositionsAgainst}</span>
      </div>

      {vaultId && counterVaultId ? (
        <VoteButtons
          vaultId={BigInt(vaultId)}
          counterVaultId={BigInt(counterVaultId)}
        />
      ) : (
        <div className="text-xs text-gray-500">Missing ID</div>
      )}
    </div>
  )
}

export default ClaimRowLite
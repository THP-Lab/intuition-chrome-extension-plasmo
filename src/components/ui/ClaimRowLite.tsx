import React from "react"
import { cn } from "~src/lib/utils"
import VoteButtons from "~src/components/VoteButtons"

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
  counterVaultId
}: {
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
}) => {
  return (
    <div
      className={cn(
          'flex justify-between items-center p-4 border border-border/10 gap-3 bg-[oklch(var(--container-background))]',
          isFirst && 'rounded-t-xl',
          isLast && 'rounded-b-xl'
        )}
    >
      <div className="flex gap-2 items-center flex-wrap flex-1 min-w-0">
        {[{ label: subjectLabel, img: subjectImage },
          { label: predicateLabel, img: predicateImage },
          { label: objectLabel, img: objectImage }]
          .map(({ label, img }, index) => (
            <div key={`${index}-${label}`}
              className="flex items-center gap-1 border border-border rounded-full px-2 py-1 text-sm text-foreground bg-[oklch(var(--triple-background))]"
            >
              {img && (
                <img
                  src={img}
                  alt={label}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span
                className="truncate max-w-[200px] overflow-hidden whitespace-nowrap block"
                title={label}
              >
                {label}
              </span>
            </div>
          ))}
      </div>


      {vaultId && counterVaultId ? (
        <div className="flex flex-col items-end gap-1">
          <VoteButtons
            vaultId={BigInt(vaultId)}
            counterVaultId={BigInt(counterVaultId)}
            numPositionsFor={numPositionsFor}
            numPositionsAgainst={numPositionsAgainst}
          />
          {(userStake) > 0 ? (
            <div className="text-sm text-green-600">You have voting FOR</div>
          ) : (userCounterStake) > 0 ? (
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

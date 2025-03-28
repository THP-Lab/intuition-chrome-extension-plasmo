import React from 'react'
import { cn } from '~src/lib/utils'

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
}) => {
  const isFor = userStake > 0

  return (
    <div
    className={cn(
      'flex justify-between items-center p-4 border border-border/10 gap-3 bg-[oklch(0.129_0.042_264.695)]',
      isFirst && 'rounded-t-xl',
      isLast && 'rounded-b-xl'
    )}
    >
      {/* Triple */}
      <div className="flex gap-2 items-center flex-wrap flex-1 min-w-0">
        {[{ label: subjectLabel, img: subjectImage },
          { label: predicateLabel, img: predicateImage },
          { label: objectLabel, img: objectImage }]
          .map(({ label, img }, index) => (
            <div
              key={index}
              className="flex items-center gap-1 border border-border rounded-full px-2 py-1 text-sm text-foreground"
            >
              {img && (
                <img
                  src={img}
                  alt={label}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span className="truncate">{label}</span>
            </div>
          ))}
      </div>

      {/* Votes */}
      <div className="flex gap-2 text-sm mr-4">
        <span className="text-for">↑ {numPositionsFor}</span>
        <span className="text-against">↓ {numPositionsAgainst}</span>
      </div>

      {/* User position */}
      <div
        className={cn(
          'border text-xs rounded-md px-2 py-1 cursor-default transition-colors duration-300',
          isFor
            ? 'border-for text-for hover:bg-for hover:text-white'
            : 'border-against text-against hover:bg-against hover:text-white'
        )}
      >
        ↑↓ {isFor ? 'FOR' : 'AGAINST'}
      </div>
    </div>
  )
}

export default ClaimRowLite


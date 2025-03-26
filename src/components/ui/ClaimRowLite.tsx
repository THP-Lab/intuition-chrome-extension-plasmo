import React from "react";
import { cn } from "../../lib/utils"

export const ClaimRowLite = ({
  subjectLabel,
  predicateLabel,
  objectLabel,
  numPositionsFor,
  numPositionsAgainst,
  isFirst = false,
  isLast = false
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center bg-primary/5 border border-border/10",
        isFirst && "rounded-t-xl",
        isLast && "rounded-b-xl"
      )}
      >
        <div className="w-full flex justify-between items-center p-4">
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 border rounded">{subjectLabel}</span>
          <span className="px-2 py-1 border rounded">{predicateLabel}</span>
          <span className="px-2 py-1 border rounded">{objectLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-blue-400">↑ {numPositionsFor}</span>
            <span className="text-orange-400">↓ {numPositionsAgainst}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClaimRowLite
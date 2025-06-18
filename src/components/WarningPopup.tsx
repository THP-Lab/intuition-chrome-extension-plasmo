import React, { useEffect, useState } from "react"
import { cn } from "~/src/lib/utils"
import VoteButtons from "~src/components/VoteButtons"


interface WarningPopupProps {
  message: string
  offset: number
  bgColor?: string
  vaultId?: bigint
  counterVaultId?: bigint 
  numPositionsFor?: number
  numPositionsAgainst?: number
  initialVote?: VoteChoice
}

/**
 * A small popup to display status warnings or confirmations.
 * Appears below its parent icon at a given offset.
 */
const WarningPopup: React.FC<WarningPopupProps> = ({   
  message,
  offset,
  bgColor = "red",
  vaultId,
  counterVaultId,
  numPositionsFor,
  numPositionsAgainst,
  initialVote
}) => {

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn("warning-popup", { visible })}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: offset,
        left: "50%",
        transform: "translateX(-70%)",
        background: bgColor,
        color: "white",
        padding: "4px 8px",
        marginTop: "2px",
        borderRadius: "4px",
        fontSize: "0.75rem",
        whiteSpace: "nowrap",
        opacity: visible ? 1 : 0,
        transition: "opacity 150ms ease-in",
        pointerEvents: "auto",
        zIndex: 1000
      }}
    >
      {message}

        <VoteButtons
          vaultId={BigInt(vaultId)}
          counterVaultId={BigInt(counterVaultId)}
          numPositionsFor={numPositionsFor}
          numPositionsAgainst={numPositionsAgainst}
          initialVote={initialVote}
        />
    </div>
  )
}

export default WarningPopup

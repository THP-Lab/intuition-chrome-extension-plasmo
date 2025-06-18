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

  const textColor = bgColor === "red" ? "#ef4444" : "#22c55e" // rouge-500 ou green-500
  const borderColor = bgColor === "red" ? "#dc2626" : "#16a34a" // rouge-600 ou green-600

  return (
    <div
      className={cn("warning-popup", { visible })}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: offset,
        left: "50%",
        transform: "translateX(-80%)", 
        background: "#0f0f0f", 
        color: textColor,
        padding: "4px",
        marginTop: "8px",
        borderRadius: "8px",
        fontSize: "0.875rem", 
        fontWeight: "500", 
        whiteSpace: "nowrap",
        opacity: visible ? 1 : 0,
        transition: "all 200ms ease-in-out",
        pointerEvents: "auto",
        zIndex: 1000,
        border: `1px solid ${borderColor}`,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px ${borderColor}20`,
        textAlign: "center", // Texte centré
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        letterSpacing: "0.025em",
        backdropFilter: "blur(8px)",
        minWidth: "140px"
      }}
    >
        <div style={{ 
          fontWeight: "600", 
          marginBottom: "8px",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.05em"
        }}>
          {message}
        </div>

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

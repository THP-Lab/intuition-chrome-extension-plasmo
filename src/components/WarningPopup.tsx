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
  forceVisible?: boolean
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
  initialVote,
  forceVisible = false
}) => {
  const [visible, setVisible] = useState(forceVisible)
  const [shouldRender, setShouldRender] = useState(forceVisible)

  const ANIMATION_DURATION = 500

  useEffect(() => {
    if (forceVisible) {
      setShouldRender(true)
      setVisible(true)
    } else {
      setVisible(false)
      const tm = setTimeout(() => setShouldRender(false), ANIMATION_DURATION)
      return () => clearTimeout(tm)
    }
  }, [forceVisible])

  const textColor = bgColor === "red" ? "#b50606" : "#228e01"
  const borderColor = bgColor === "red" ? "#b50606" : "#228e01"

  if (!shouldRender) return null

  return (
    <div
      className={cn("warning-popup", { visible })}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      style={{
        position: "absolute",
        top: offset,
        left: "50%",
        transform: `
          translateX(-80%)
          translateY(${visible ? 0 : '-5px'})
        `,
        background: "#0f0f0f",
        color: textColor,
        padding: "4px",
        borderRadius: "8px",
        fontSize: "0.875rem",
        fontWeight: "500",
        whiteSpace: "nowrap",
        pointerEvents: "auto",
        zIndex: 9998,
        border: `1px solid ${borderColor}`,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px ${borderColor}20`,
        textAlign: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        letterSpacing: "0.025em",
        backdropFilter: "blur(8px)",
        width: "180px",
        minWidth: undefined,
        opacity: visible ? 1 : 0,
        transition: `
          opacity ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
          transform ${ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)
        `,
        willChange: "transform, opacity"
      }}
    >
      <div style={{ 
        fontWeight: "600", 
        marginBottom: "8px",
        textTransform: "uppercase",
        fontSize: "1rem",
        letterSpacing: "0.05em"
      }}>
        {message}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <VoteButtons
          vaultId={BigInt(vaultId)}
          counterVaultId={BigInt(counterVaultId)}
          numPositionsFor={numPositionsFor}
          numPositionsAgainst={numPositionsAgainst}
          initialVote={initialVote}
        />
      </div>
    </div>
  )
}

export default WarningPopup

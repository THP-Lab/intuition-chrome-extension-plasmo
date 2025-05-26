import { useEffect, useState } from "react"
import type { Status } from "~src/hooks/useClaimDetection"

const FloatingStatusBadge = ({ status }: { status: Status }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      setVisible(true)
      return
    }

    setVisible(true)
    const timeout = setTimeout(() => setVisible(false), 6000)
    return () => clearTimeout(timeout)
  }, [status])

  if (!visible) return null

  const isLoading = status === "loading"
  const color =
    status === "found"
      ? "#22c55e"
      : status === "not_found"
      ? "#ef4444"
      : "#3b82f6"

  return (
    <span
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        backgroundColor: isLoading ? "transparent" : color,
        border: isLoading ? "2px solid #3b82f6" : "2px solid white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none"
      }}
    >
      {isLoading && (
        <span
          style={{
            width: "8px",
            height: "8px",
            border: "2px solid #3b82f6",
            borderTopColor: "transparent",
            borderRadius: "9999px",
            animation: "spin 1s linear infinite"
          }}
        />
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </span>
  )
}

export default FloatingStatusBadge

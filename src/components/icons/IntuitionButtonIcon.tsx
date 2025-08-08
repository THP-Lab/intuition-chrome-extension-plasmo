import React from "react"
import { useTheme } from "~/src/components/ThemeProvider"
import { cn } from "~/src/lib/utils"

interface IntuitionButtonIconProps {
  className?: string
  size?: number
  position?: { x?: number | string; y?: number | string }
  loading?: boolean
  highlightColor?: string
  onClick?: () => void
}

const IntuitionButtonIcon: React.FC<IntuitionButtonIconProps> = ({
  className,
  size = 50,
  position = { x: "0px", y: "0px" },
  loading = false,
  highlightColor,
  onClick
}) => {
  const { theme } = useTheme()
  const defaultStroke = theme === "dark" ? "white" : "black"
  const strokeColor = highlightColor ?? defaultStroke
  const cursor = loading ? "wait" : "pointer"

  return (
    <div
      className={cn("relative", className)}
      style={{
        width: size,
        height: size,
        transform: `translate(${position.x}, ${position.y})`,
        cursor
      }}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size }}
      >
        <circle
          className={cn("outer-circle", { loading })}
          cx="50"
          cy="50"
          r="42"
          strokeWidth="2.8"
          fill="none"
          stroke={strokeColor}
        />
        <circle
          className={cn("middle-circle", { loading })}
          cx="50"
          cy="50"
          r="34"
          strokeWidth="6"
          fill="none"
          stroke={strokeColor}
        />
      </svg>
      <style>
        {`
        .outer-circle {
          transform-origin: 50% 50%;
          stroke-linecap: round;
          stroke-dasharray: 64 8 12.6 8 64 8 12.6 8 64 8;
          animation: spinCW 12s linear infinite;
        }
        .middle-circle {
          transform-origin: 50% 50%;
          stroke-linecap: round;
          stroke-dasharray: 55 10 12 10 55 10 12 10 55 10;
          animation: spinCCW 12s linear infinite;
        }
        .outer-circle.loading {
          animation: spinACW 2s linear infinite;
        }
        .middle-circle.loading {
          animation: spinCWFast 2s linear infinite;
        }
        @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes spinACW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes spinCWFast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}
      </style>
    </div>
  )
}

export default IntuitionButtonIcon

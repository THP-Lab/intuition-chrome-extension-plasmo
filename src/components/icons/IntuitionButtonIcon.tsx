import React from "react"

import { useTheme } from "~/src/components/ThemeProvider"
import { cn } from "~/src/lib/utils"

interface IntuitionSearchIconProps {
  size?: number
  className?: string
}

const IntuitionSearchIcon: React.FC<IntuitionSearchIconProps> = ({
  size = 32,
  className
}) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}>
        <circle
          className="outer-circle"
          cx="50"
          cy="50"
          r="40"
          strokeWidth="2.8"
          fill="none"
          stroke={isDark ? "white" : "black"}
        />
        <circle
          className="middle-circle"
          cx="50"
          cy="50"
          r="36"
          strokeWidth="2.8"
          fill="none"
          stroke={isDark ? "white" : "black"}
        />
        <circle
          className="inner-circle"
          cx="50"
          cy="50"
          r="32"
          fill={isDark ? "black" : "white"}
        />
        <line
          className="handle"
          x1="78.3"
          y1="78.3"
          x2="98"
          y2="98"
          strokeWidth="6"
          stroke={isDark ? "white" : "black"}
        />
      </svg>

      <style>
        {`
          .outer-circle {
            transform-origin: 50% 50%;
            stroke-linecap: round;
            stroke-dasharray: 68.1 4.4 12.6 4.4 68.1 4.4 12.6 4.4 68.1 4.4;
            animation: spinCW 12s linear infinite;
          }

          .middle-circle {
            transform-origin: 50% 50%;
            stroke-linecap: round;
            stroke-dasharray: 68.1 4.4 12.6 4.4 68.1 4.4 12.6 4.4 68.1 4.4;
            animation: spinCCW 12s linear infinite;
          }

          /* Au hover, accélération et inversion des rotations */
          svg:hover .outer-circle {
            animation: spinACW 2s linear infinite;
          }

          svg:hover .middle-circle {
            animation: spinCWFast 2s linear infinite;
          }

          @keyframes spinCW {
            from { transform: rotate(0deg) scale(1); }
            to { transform: rotate(360deg) scale(1); }
          }

          @keyframes spinCCW {
            from { transform: rotate(0deg) scale(1); }
            to { transform: rotate(-360deg) scale(1); }
          }

          @keyframes spinACW {
            from { transform: rotate(0deg) scale(1); }
            to { transform: rotate(-360deg) scale(1); }
          }

          @keyframes spinCWFast {
            from { transform: rotate(0deg) scale(1); }
            to { transform: rotate(360deg) scale(1); }
          }

          .handle {
            stroke-linecap: round;
          }
        `}
      </style>
    </div>
  )
}

export default IntuitionSearchIcon

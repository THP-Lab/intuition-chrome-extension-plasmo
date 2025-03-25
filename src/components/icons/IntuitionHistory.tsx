import React from "react"

import { useTheme } from "~/src/components/ThemeProvider"
import { cn } from "~/src/lib/utils"

interface IntuitionHistoryProps {
  size?: number
  className?: string
}

const IntuitionHistory: React.FC<IntuitionHistoryProps> = ({
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
        {/* Cercle extérieur animé */}
        <circle
          className="outer-circle"
          cx="50"
          cy="50"
          r="40"
          strokeWidth="2.8"
          fill="none"
          stroke={isDark ? "white" : "black"}
        />
        {/* Cercle intermédiaire animé */}
        <circle
          className="middle-circle"
          cx="50"
          cy="50"
          r="36"
          strokeWidth="2.8"
          fill="none"
          stroke={isDark ? "white" : "black"}
        />
        {/* Cercle intérieur plein */}
        <circle
          className="inner-circle"
          cx="50"
          cy="50"
          r="32"
          fill={isDark ? "black" : "white"}
        />
        {/* Aiguilles de l'horloge */}
        <line
          className="clock-hand minute-hand"
          x1="50"
          y1="50"
          x2="50"
          y2="25"
          strokeWidth="2"
          stroke={isDark ? "white" : "black"}
        />
        <line
          className="clock-hand hour-hand"
          x1="50"
          y1="50"
          x2="50"
          y2="35"
          strokeWidth="2"
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

          /* Au hover, on inverse les directions et on accélère */
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
            0% { transform: rotate(0deg) scale(1); }
            20% { transform: rotate(-30deg) scale(0.95); }
            100% { transform: rotate(-360deg) scale(1); }
          }

          @keyframes spinCWFast {
            0% { transform: rotate(0deg) scale(1); }
            20% { transform: rotate(30deg) scale(0.95); }
            100% { transform: rotate(360deg) scale(1); }
          }

          /* Animation des aiguilles */
          .minute-hand {
            transform-origin: 50% 50%;
            animation: spinMinute 6s linear infinite;
          }

          .hour-hand {
            transform-origin: 50% 50%;
            animation: spinHour 72s linear infinite;
          }

          @keyframes spinMinute {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes spinHour {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default IntuitionHistory

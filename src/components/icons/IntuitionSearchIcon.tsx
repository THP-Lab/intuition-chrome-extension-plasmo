import * as React from "react"
import { useTheme } from "~/src/components/ThemeProvider"
import { cn } from "~/src/lib/utils"

interface IntuitionSearchIconProps {
  size?: number
  className?: string
}

const IntuitionSearchIcon: React.FC<IntuitionSearchIconProps> = ({
  size = 32,
  className = "",
}) => {
  const { theme } = useTheme()
  const strokeColor = theme === "dark" ? "white" : "black"

  // On double la taille de l'icône interne (24×24 → 48×48) et on la centre
  const innerSize = 24 * 2
  const offset = (100 - innerSize) / 2

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        {/* cercles animés */}
        <circle
          className="outer-circle"
          cx="50"
          cy="50"
          r="40"
          strokeWidth="2.8"
          fill="none"
          stroke={strokeColor}
        />
        <circle
          className="middle-circle"
          cx="50"
          cy="50"
          r="36"
          strokeWidth="2.8"
          fill="none"
          stroke={strokeColor}
        />
        <circle
          className="inner-circle"
          cx="50"
          cy="50"
          r="32"
          fill={theme === "dark" ? "black" : "white"}
        />

        {/* icône loupe */}
        <g transform={`translate(${offset} ${offset}) scale(2)`}>
          <path
            d="m21 21-4.34-4.34"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle
            cx="11"
            cy="11"
            r="8"
            stroke={strokeColor}
            strokeWidth="2"
            fill="none"
          />
        </g>
      </svg>

      <style>{`
        .outer-circle {
          transform-origin: 50% 50%;
          stroke-linecap: round;
          stroke-dasharray: 68.1 4.4 12.6 4.4;
          animation: spinCW 12s linear infinite;
        }
        .middle-circle {
          transform-origin: 50% 50%;
          stroke-linecap: round;
          stroke-dasharray: 68.1 4.4 12.6 4.4;
          animation: spinCCW 12s linear infinite;
        }
        /* Hover : inversion / accélération */
        svg:hover .outer-circle {
          animation: spinACW 2s linear infinite;
        }
        svg:hover .middle-circle {
          animation: spinCWFast 2s linear infinite;
        }
        @keyframes spinCW {
          from { transform: rotate(0deg) scale(1); }
          to   { transform: rotate(360deg) scale(1); }
        }
        @keyframes spinCCW {
          from { transform: rotate(0deg) scale(1); }
          to   { transform: rotate(-360deg) scale(1); }
        }
        @keyframes spinACW {
          from { transform: rotate(0deg) scale(1); }
          to   { transform: rotate(-360deg) scale(1); }
        }
        @keyframes spinCWFast {
          from { transform: rotate(0deg) scale(1); }
          to   { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default IntuitionSearchIcon

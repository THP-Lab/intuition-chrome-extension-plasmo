import * as React from "react"
import { useTheme } from "~/src/components/ThemeProvider"
import { cn } from "~/src/lib/utils"

interface IntuitionIconTagProps {
  size?: number
  className?: string
}

const IntuitionIconTag: React.FC<IntuitionIconTagProps> = ({
  size = 32,
  className= "",
}) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const strokeColor = isDark ? "white" : "black"

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
          fill={isDark ? "black" : "white"}
        />

        <g transform={`translate(${offset} ${offset}) scale(2)`}>
          <path
            d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"
            fill={strokeColor}
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <circle cx="6.5" cy="9.5" r=".5" fill={strokeColor} />
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

export default IntuitionIconTag

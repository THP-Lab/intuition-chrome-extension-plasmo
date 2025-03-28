import * as React from "react"

import { useTheme } from "~/src/components/ThemeProvider"
import { cn } from "~/src/lib/utils"

interface IntuitionIconPlusProps {
  size?: number
  className?: string
}

const IntuitionIconPlus: React.FC<IntuitionIconPlusProps> = ({
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
        <g className="small-icon">
          <svg width="70" height="70" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z" 
              fill={isDark ? "white" : "black"} 
              fillRule="evenodd" 
              clipRule="evenodd"
            />
          </svg>
        </g>
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
            0% { transform: rotate(0deg) scale(1); }
            20% { transform: rotate(-30deg) scale(0.95); }
            100% { transform: rotate(-360deg) scale(1); }
          }
          
          @keyframes spinCWFast {
            0% { transform: rotate(0deg) scale(1); }
            20% { transform: rotate(30deg) scale(0.95); }
            100% { transform: rotate(360deg) scale(1); }
          }
          
          /* Style pour l'icône centrale */
          .small-icon {
            transform: translate(50px,50px) translate(-35px,-35px) rotate(0deg);
            transform-origin: 35px 35px;
            transition: transform 2s ease;
          }
          
          svg:hover .small-icon {
            transform: translate(50px,50px) translate(-35px,-35px) rotate(360deg);
          }
        `}
      </style>
    </div>
  )
}

export default IntuitionIconPlus
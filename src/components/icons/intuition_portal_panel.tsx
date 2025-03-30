import React from "react"

import { useTheme } from "~/src/components/ThemeProvider"
import { cn } from "~/src/lib/utils"


const openPanelStyles = `
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

  .open-button:hover .outer-circle {
    animation: spinACW 2s linear infinite;
  }

  .open-button:hover .middle-circle {
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

  /* Adaptation pour le système de thème de Tailwind */
  :root.dark .outer-circle, 
  :root.dark .middle-circle {
    stroke: white;
  }
  
  :root.dark .text-open {
    fill: white;
  }
  
  :root:not(.dark) .outer-circle, 
  :root:not(.dark) .middle-circle {
    stroke: black;
  }
  
  :root:not(.dark) .text-open {
    fill: black;
  }
`

interface IntuitionOpenPanelProps {
  size?: number
  className?: string
  onClick?: () => void
  showStyles?: boolean
  children?: React.ReactNode
}

const IntuitionOpenPanel: React.FC<IntuitionOpenPanelProps> = ({
  size = 50,
  className = "",
  onClick,
  showStyles = true,
  children,
  ...props
}) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <>
      {showStyles && <style>{openPanelStyles}</style>}
      
      <button 
        onClick={onClick}
        className={`open-button flex items-center justify-center cursor-pointer ${className}`}
        {...props}
      >
        <svg 
          className="w-[auto] h-[auto]" 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            className="outer-circle" 
            cx="50" 
            cy="50" 
            r="40" 
            strokeWidth="2.8" 
            fill="none" 
          />
          

          <circle 
            className="middle-circle" 
            cx="50" 
            cy="50" 
            r="36" 
            strokeWidth="2.8" 
            fill="none" 
          />
          

          <text 
            className="text-open"
            x="50" 
            y="55" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            style={{ 
              fontFamily: "sans-serif", 
              fontSize: "20px", 
              fontWeight: "bold" 
            }}
          >
            Open
          </text>
        </svg>
        
        {children}
      </button>
    </>
  )
}

export default IntuitionOpenPanel
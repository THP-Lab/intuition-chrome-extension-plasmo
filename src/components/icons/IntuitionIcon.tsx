import * as React from "react"

import { useTheme } from "~/src/components/ThemeProvider"

const IntuitionIcon = ({
  className = "",
  size = 24
}: {
  className?: string
  size?: number
}) => {
  const { theme } = useTheme()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <style>
        {`
          .outer-circle {
            transform-origin: 50% 50%;
          }
          svg:hover .outer-circle {
            animation: rotateExpandCycle 3s linear infinite;
          }
          @keyframes rotateExpandCycle {
            0% {
              transform: rotate(0deg) scale(1);
            }
            10% {
              transform: rotate(150deg) scale(1.15);
            }
            25% {
              transform: rotate(270deg) scale(1.12);
            }
            33.33% {
              transform: rotate(340deg) scale(1.1);
            }
            50% {
              transform: rotate(340deg) scale(1.1);
            }
            60% {
              transform: rotate(170deg) scale(1.15);
            }
            70% {
              transform: rotate(0deg) scale(1);
            }
            100% {
              transform: rotate(0deg) scale(1);
            }
          }
        `}
      </style>
      <circle
        className="outer-circle"
        cx="50"
        cy="50"
        r="40"
        stroke={theme === "dark" ? "white" : "black"}
        strokeWidth="2.8"
        fill="none"
        strokeDasharray="68.1 4.4 12.6 4.4 68.1 4.4 12.6 4.4"
      />
      <circle
        className="circle-stroke"
        cx="50"
        cy="50"
        r="32"
        stroke={theme === "dark" ? "white" : "black"}
        strokeWidth="7"
        fill="none"
      />
    </svg>
  )
}

export default IntuitionIcon

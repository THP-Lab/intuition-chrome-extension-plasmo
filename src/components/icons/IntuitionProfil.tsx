import * as React from "react"

import { useTheme } from "~/src/components/ThemeProvider"

const IntuitionProfil = ({
  className = "",
  size = 24
}: {
  className?: string
  size?: number
}) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

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
        r="42"
        stroke={isDark ? "white" : "black"}
        strokeWidth="2.8"
        fill="none"
        strokeDasharray="68.1 4.4 12.6 4.4 68.1 4.4 12.6 4.4 68.1 4.4"
        style={{
          strokeLinecap: "round"
        }}
      />

      <circle
        className="middle-circle"
        cx="50"
        cy="50"
        r="36"
        strokeWidth="4"
        fill="none"
        stroke={isDark ? "white" : "black"}
        style={{ strokeLinecap: "round" }}
      />

      <circle
        className="inner-circle"
        cx="50"
        cy="50"
        r="32"
        fill={isDark ? "black" : "white"}
      />

      <g transform="translate(20, 20) scale(1.50)">
        <defs>
          <mask
            id="mask0"
            maskUnits="userSpaceOnUse"
            x="3"
            y="21"
            width="34"
            height="34">
            <circle cx="20" cy="38" r="16.5" fill="white" stroke="white" />
          </mask>
        </defs>

        <circle cx="20" cy="20" r="20" fill={isDark ? "white" : "black"} />

        <g mask="url(#mask0)">
          <circle
            cx="20"
            cy="20"
            r="17.5"
            fill={isDark ? "black" : "white"}
            stroke={isDark ? "black" : "white"}
          />
        </g>

        <circle cx="20" cy="10" r="5" fill={isDark ? "black" : "#D9D9D9"} />
      </g>
    </svg>
  )
}

export default IntuitionProfil

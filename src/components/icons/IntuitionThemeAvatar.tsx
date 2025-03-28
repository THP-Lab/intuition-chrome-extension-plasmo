import * as React from "react"

import { useTheme } from "~/src/components/ThemeProvider"

interface IntuitionThemeAvatarProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

const IntuitionThemeAvatar: React.FC<IntuitionThemeAvatarProps> = ({
  size = 24,
  className = "",
  ...props
}) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <circle
        className="outer-circle"
        cx="50"
        cy="50"
        r="42"
        strokeWidth="2.8"
        fill="none"
        stroke={isDark ? "white" : "black"}
        style={{
          transformOrigin: "50% 50%",
          strokeLinecap: "round",
          strokeDasharray: "68.1 4.4 12.6 4.4 68.1 4.4 12.6 4.4 68.1 4.4"
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

      <path
        d="M50 20 A30 30 0 0 1 80 50 A30 30 0 0 1 50 80 A30 30 0 0 1 20 50 A30 30 0 0 1 50 20"
        fill="none"
      />
      <path
        d="M50 20 A30 30 0 0 0 20 50 L50 50 L50 20"
        fill={isDark ? "white" : "black"}
      />
      <path
        d="M20 50 A30 30 0 0 0 50 80 L50 50 L20 50"
        fill={isDark ? "white" : "black"}
      />
      <path
        d="M50 20 A30 30 0 0 1 80 50 L50 50 L50 20"
        fill={isDark ? "black" : "white"}
      />
      <path
        d="M80 50 A30 30 0 0 1 50 80 L50 50 L80 50"
        fill={isDark ? "black" : "white"}
      />

      <style>
        {`
          @keyframes rotateExpandCycle {
            0% { transform: rotate(0deg) scale(1); }
            10% { transform: rotate(150deg) scale(1.15); }
            25% { transform: rotate(270deg) scale(1.12); }
            33.33% { transform: rotate(340deg) scale(1.1); }
            50% { transform: rotate(340deg) scale(1.1); }
            60% { transform: rotate(170deg) scale(1.15); }
            70% { transform: rotate(0deg) scale(1); }
            100% { transform: rotate(0deg) scale(1); }
          }
          svg:hover .outer-circle {
            animation: rotateExpandCycle 3s linear infinite;
          }
        `}
      </style>
    </svg>
  )
}

export default IntuitionThemeAvatar

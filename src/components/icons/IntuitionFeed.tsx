import * as React from "react"

import { useTheme } from "~/src/components/ThemeProvider"

interface IntuitionFeedProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

const IntuitionFeed: React.FC<IntuitionFeedProps> = ({
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
      <circle
        className="inner-circle"
        cx="50"
        cy="50"
        r="30"
        fill={isDark ? "black" : "white"}
      />
      <g className="profile-group" transform="translate(29,33) scale(0.8)">
        <g>
          {/* Premier profil */}
          <circle cx="13" cy="6" r="5.5" fill={isDark ? "white" : "black"} />
          <path
            d="M24.5 31.5C24.5 36.8037 23.121 41.5819 20.9179 45.0187C18.7113 48.4611 15.7233 50.5 12.5 50.5C9.27671 50.5 6.28874 48.4611 4.0821 45.0187C1.879 41.5819 0.5 36.8037 0.5 31.5C0.5 26.1963 1.879 21.4181 4.0821 17.9813C6.28874 14.5389 9.27671 12.5 12.5 12.5C15.7233 12.5 18.7113 14.5389 20.9179 17.9813C23.121 21.4181 24.5 26.1963 24.5 31.5Z"
            fill={isDark ? "white" : "black"}
          />

          {/* Deuxième profil */}
          <circle cx="42" cy="6" r="5.5" fill={isDark ? "white" : "black"} />
          <path
            d="M53.5 31.5C53.5 36.8037 52.121 41.5819 49.9179 45.0187C47.7113 48.4611 44.7233 50.5 41.5 50.5C38.2767 50.5 35.2887 48.4611 33.0821 45.0187C30.879 41.5819 29.5 36.8037 29.5 31.5C29.5 26.1963 30.879 21.4181 33.0821 17.9813C35.2887 14.5389 38.2767 12.5 41.5 12.5C44.7233 12.5 47.7113 14.5389 49.9179 17.9813C52.121 21.4181 53.5 26.1963 53.5 31.5Z"
            fill={isDark ? "white" : "black"}
          />

          {/* Troisième profil */}
          <circle cx="26" cy="13" r="5.5" fill={isDark ? "white" : "black"} />
          <path
            d="M37.5 38.5C37.5 43.8037 36.121 48.5819 33.9179 52.0187C31.7113 55.4611 28.7233 57.5 25.5 57.5C22.2767 57.5 19.2887 55.4611 17.0821 52.0187C14.879 48.5819 13.5 43.8037 13.5 38.5C13.5 33.1963 14.879 28.4181 17.0821 24.9813C19.2887 21.5389 22.2767 19.5 25.5 19.5C28.7233 19.5 31.7113 21.5389 33.9179 24.9813C36.121 28.4181 37.5 33.1963 37.5 38.5Z"
            fill={isDark ? "white" : "black"}
          />
        </g>
      </g>
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

export default IntuitionFeed

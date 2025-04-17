import React, { useEffect, useState } from "react"

import { useTheme } from "~/src/components/ThemeProvider"
import { cn } from "~/src/lib/utils"

interface IntuitionSearchIconProps {
  onSearch?: (value: string) => void
  className?: string
  size?: number
  position?: {
    x?: number | string
    y?: number | string
  }
}

const IntuitionSearchIcon: React.FC<IntuitionSearchIconProps> = ({
  onSearch,
  className,
  size = 50,
  position = { x: "150px", y: "0px" }
}) => {
  const [isInputVisible, setIsInputVisible] = useState(true)
  const [isAppeared, setIsAppeared] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const wrapper = document.querySelector(".input-wrapper:not(.appear)")
    if (wrapper) {
      setTimeout(() => {
        wrapper.classList.add("appear")
        setIsAppeared(true)
      }, 200)
    }
  }, [])

  const handleIconClick = () => {
    setIsInputVisible(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  return (
    <div
      className={cn("relative", className)}
      style={{
        width: "fit-content",
        transform: `translate(${position.x}, ${position.y})`
      }}>
      <div
        className="relative flex items-center mx-auto"
        style={{
          width: size,
          height: size
        }}>
        <div
          className="icon-container cursor-pointer"
          onClick={handleIconClick}
          style={{ width: size, height: size }}>
          <svg
            className="icon-svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: size, height: size }}>
            <circle
              className="outer-circle"
              cx="50"
              cy="50"
              r="42"
              strokeWidth="2.8"
              fill="none"
              stroke={theme === "dark" ? "white" : "black"}
            />
            <circle
              className="middle-circle"
              cx="50"
              cy="50"
              r="36"
              strokeWidth="4"
              fill="none"
              stroke={theme === "dark" ? "white" : "black"}
            />
            <circle
              className="inner-circle"
              cx="50"
              cy="50"
              r="32"
              fill={theme === "dark" ? "black" : "white"}
            />
          </svg>
        </div>

        <div
          className="absolute left-0"
          style={{
            top: size - 45,
            width: size * 3.5,
            left: size - 30
          }}>
          <div className={cn("input-wrapper", {
            "appear": isAppeared
          })}>
            <input
              className="input-bar"
              type="text"
              placeholder="Search..."
              onChange={handleInputChange}
              onFocus={() =>
                document
                  .querySelector(".icon-container")
                  ?.classList.add("active")
              }
              onBlur={() =>
                document
                  .querySelector(".icon-container")
                  ?.classList.remove("active")
              }
              style={{
                color: theme === "dark" ? "white" : "black",
                width: "100%",
                fontSize: "1.2rem",
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "5px 0",
                paddingLeft: "30px",
                fontWeight: 400
              }}
            />
          </div>
        </div>
      </div>

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

        @keyframes spinCW {
          from {
            transform: rotate(0deg) scale(1);
          }
          to {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes spinCCW {
          from {
            transform: rotate(0deg) scale(1);
          }
          to {
            transform: rotate(-360deg) scale(1);
          }
        }

        .icon-container:hover .outer-circle,
        .icon-container.active .outer-circle {
          animation: spinACW 2s linear infinite;
        }

        .icon-container:hover .middle-circle,
        .icon-container.active .middle-circle {
          animation: spinCWFast 2s linear infinite;
        }

        @keyframes spinACW {
          from {
            transform: rotate(0deg) scale(1);
          }
          to {
            transform: rotate(-360deg) scale(1);
          }
        }

        @keyframes spinCWFast {
          from {
            transform: rotate(0deg) scale(1);
          }
          to {
            transform: rotate(360deg) scale(1);
          }
        }

        .input-wrapper {
          position: relative;
          width: 100%;
          clip-path: inset(0 100% 0 0);
          opacity: 0;
          transition: clip-path 2s ease, opacity 2s ease;
        }

        .input-wrapper.appear {
          clip-path: inset(0 0 0 0);
          opacity: 1;
        }

        .input-wrapper::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 0;
          opacity: 0;
          background: ${theme === "dark" ? "white" : "black"};
          transition: width 2s ease, opacity 2s ease;
          border-radius: 1.5px;
        }

        .input-wrapper.appear::after {
          width: calc(100% - 40px);
          opacity: 1;
        }

        /* Style du placeholder */
        .input-bar::placeholder {
          color: ${theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"};
          font-size: 1rem;
          font-weight: 400;
        }

        /* Style quand l'input est focus */
        .input-bar:focus {
          border-color: transparent;
          outline: none;
        }

        /* Style quand l'input est hover */
        .input-bar:hover {
          opacity: 0.8;
        }
      `}
      </style>
    </div>
  )
}

export default IntuitionSearchIcon
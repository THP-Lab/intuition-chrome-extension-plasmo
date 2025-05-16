import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useLocation, useNavigate } from "react-router-dom"

import IntuitionIconPlus from "~/src/components/icons/intuition_icon_plus"
import IntuitionFeed from "~/src/components/icons/IntuitionFeed"
import IntuitionHistory from "~/src/components/icons/IntuitionHistory"
import IntuitionIconTag from "~/src/components/icons/IntuitionIconTag"

import IntuitionIcon from "~/src/components/icons/IntuitionIcon"
import IntuitionProfil from "~/src/components/icons/IntuitionProfil"
import IntuitionSearchIcon from "~/src/components/icons/IntuitionSearchIcon"
import { useTheme } from "~/src/components/ThemeProvider"

const getResponsiveValues = () => {
  if (typeof window === "undefined") return { radius: 188, bottomOffset: -300 } // 198 * 0.95 = 188

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  const baseRadius = 188
  const responsiveRadius = Math.min(
    baseRadius,
    screenWidth * 0.34,
    screenHeight * 0.26
  )

  // Calculate the responsive bottom offset
  const baseBottomOffset = -300
  const responsiveBottomOffset = Math.min(
    baseBottomOffset,
    -(screenHeight * 0.25)
  )

  return { radius: responsiveRadius, bottomOffset: responsiveBottomOffset }
}

const items = [
  { Icon: IntuitionIcon, label: "Home", to: "/" },
  { Icon: IntuitionSearchIcon, label: "Search", to: "/search" },
  { Icon: IntuitionProfil, label: "Profile", to: "/profile" },
  { Icon: IntuitionFeed, label: "Feed", to: "/feed" },
  { Icon: IntuitionHistory, label: "Recent", to: "/recent-activity" },
  { Icon: IntuitionIconPlus, label: "Create", to: "/page-form" },
  { Icon: IntuitionIconTag, label: "Tag", to: "/tags" }
]

const NavArc = () => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [responsiveValues, setResponsiveValues] = useState(
    getResponsiveValues()
  )

  useEffect(() => {
    const handleResize = () => {
      setResponsiveValues(getResponsiveValues())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getActiveItemIndex = () => {
    return items.findIndex((item) => {
      if (!item.to) return false
      return (
        item.to === location.pathname ||
        (item.to !== "/" && location.pathname.startsWith(item.to))
      )
    })
  }

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const newIndex = getActiveItemIndex()
    if (newIndex >= 0) {
      setActiveIndex(newIndex)
    }
  }, [location.pathname])

  const centralItem = items[activeIndex]

  const getSecondaryItems = () => {
    return items.filter((_, idx) => idx !== activeIndex)
  }

  const onHoverEnter = () => {
    setIsOpen(true)
  }

  const onHoverLeave = () => {
    setIsOpen(false)
  }

  const handleClick = (idx: number) => {
    const secondaryItems = getSecondaryItems()
    const clickedItem = secondaryItems[idx]

    if (clickedItem.label === "Theme") {
      setTheme(theme === "dark" ? "light" : "dark")
      return
    }

    if (clickedItem.to) {
      navigate(clickedItem.to)
    }

    setIsOpen(false)
  }

  type ButtonConfig = {
    top: string
    radius: number
    angleOffset?: number
  }

  type ButtonPositions = {
    [key in
      | "Home"
      | "Search"
      | "Profile"
      | "Feed"
      | "Recent"
      | "Create"
      | "Tag"]: ButtonConfig
  }

  const buttonPositions: ButtonPositions = {
    Home: { top: "36%", radius: responsiveValues.radius },

    Search: {
      top: "36%",
      radius: responsiveValues.radius - 26,
      angleOffset: -Math.PI
    },
    Tag: {
      top: "36%",
      radius: responsiveValues.radius - 26,
      angleOffset: 0
    },

    Profile: {
      top: "31%",
      radius: responsiveValues.radius - 25,
      angleOffset: -Math.PI * 0.8
    },
    Create: {
      top: "31%",
      radius: responsiveValues.radius - 25,
      angleOffset: -Math.PI * 0.2
    },

    Feed: {
      top: "36%",
      radius: responsiveValues.radius + 35,
      angleOffset: -Math.PI * 0.58
    },
    Recent: {
      top: "36%",
      radius: responsiveValues.radius + 35,
      angleOffset: -Math.PI * 0.42
    }
  }

  const getButtonPosition = (idx: number, total: number) => {
    if (idx === -1) {
      return {
        left: "50%",
        top: "36%",
        transform: "translate(-50%, -50%)"
      }
    }

    const fixedPositions = [
      { top: "36%", radius: responsiveValues.radius - 26, angle: -Math.PI },
      {
        top: "31%",
        radius: responsiveValues.radius - 25,
        angle: -Math.PI * 0.8
      },
      {
        top: "36%",
        radius: responsiveValues.radius + 35,
        angle: -Math.PI * 0.58
      },
      {
        top: "36%",
        radius: responsiveValues.radius + 35,
        angle: -Math.PI * 0.42
      },
      {
        top: "31%",
        radius: responsiveValues.radius - 25,
        angle: -Math.PI * 0.2
      },
      { top: "36%", radius: responsiveValues.radius - 26, angle: 0 }
    ]

    const activeItemOriginalIndex = items.findIndex(
      (item) => item.label === centralItem.label
    )

    const secondaryItems = getSecondaryItems()
    const currentItem = secondaryItems[idx]
    const originalIndex = items.findIndex(
      (item) => item.label === currentItem.label
    )

    let positionIndex = originalIndex
    if (originalIndex > activeItemOriginalIndex) {
      positionIndex = originalIndex - 1
    } else if (originalIndex < activeItemOriginalIndex) {
      positionIndex = originalIndex
    } else {
      positionIndex = activeItemOriginalIndex
    }

    if (positionIndex >= fixedPositions.length) {
      positionIndex = fixedPositions.length - 1
    }

    const position = fixedPositions[positionIndex]

    const x = position.radius * Math.cos(position.angle)
    const y = position.radius * Math.sin(position.angle) * 0.7

    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(${position.top} + ${y}px)`,
      transform: "translate(-50%, -50%)"
    }
  }

  if (typeof window === "undefined") return null

  const secondaryItems = getSecondaryItems()

  return createPortal(
    <>
      <div
        ref={containerRef}
        className={`arc-menu-container ${isOpen ? "is-open" : ""}`}
        style={{ bottom: `${responsiveValues.bottomOffset}px` }}
        onMouseLeave={onHoverLeave}>
        <div className="arc-interaction-zone">
          <button
            className={`arc-menu-button central-button ${isOpen ? "is-open" : ""}`}
            style={getButtonPosition(-1, 1)}
            onMouseEnter={onHoverEnter}
            title={centralItem.label}>
            <centralItem.Icon size={40} />
          </button>

          {secondaryItems.map((item, idx) => (
            <button
              key={item.label}
              className={`arc-menu-button secondary-button ${isOpen ? "is-open" : ""}`}
              style={getButtonPosition(idx, secondaryItems.length)}
              onClick={() => handleClick(idx)}
              title={item.label}>
              <item.Icon size={40} />
            </button>
          ))}
        </div>
      </div>
      <div className={`arc-overlay ${isOpen ? "is-open" : ""}`}></div>
    </>,
    document.body
  )
}

export default NavArc
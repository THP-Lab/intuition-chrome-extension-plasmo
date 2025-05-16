import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useRef, useState } from "react"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"

import { ApolloProvider, useSubscription } from "@apollo/client"
import { apolloSubscriptionClient } from "~src/graphql/src/apollo-subscription-client"
import { FollowerActivityDocument } from "~src/graphql/src/generated/subscriptions"

// This config tells Plasmo to inject this content script on all HTTPS pages
export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

// Anchors the shadow DOM to the <body> element
export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector("body")

// A unique shadow host ID for Plasmo to scope this component
export const getShadowHostId = () => "plasmo-inline-example-unique-id"

// Static list of account IDs to treat as "followers"
// When any of these perform an action, a notification is triggered
const FOLLOWER_IDS = ["0xd01cd97bf00bddfbccf0a79a2a579e8add6ac4f8"]

// Top-level wrapper that provides Apollo context to the floating UI
export default function Wrapper() {
  return (
    <ApolloProvider client={apolloSubscriptionClient}>
      <PlasmoInline />
    </ApolloProvider>
  )
}

// Main floating button component
export function PlasmoInline() {
  const [positionY, setPositionY] = useState<number>(50) // Y-axis position of the button
  const [hasNotification, setHasNotification] = useState(false) // Whether to show the badge
  const draggingRef = useRef(false)

  // Subscribes to GraphQL real-time events using the generated subscription
  const { data } = useSubscription(FollowerActivityDocument, {
    variables: { limit: 1 }
  })

  // Reacts to incoming subscription data
  useEffect(() => {
    const event = data?.events?.[0]
    const actorId = event?.account?.id
    const type = event?.type

    // Check if the actor is a follower and if they created a claim or atom
    if (
      actorId &&
      FOLLOWER_IDS.includes(actorId) &&
      (type === "ClaimCreated" || type === "AtomCreated")
    ) {
      setHasNotification(true)
    }
  }, [data])

  // Handle mouse drag interaction for repositioning the button vertically
  const handleMouseDown = (e: React.MouseEvent) => {
    const startY = e.clientY
    const startPositionY = positionY
    draggingRef.current = false

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY
      if (Math.abs(deltaY) > 5) {
        draggingRef.current = true
      }
      if (draggingRef.current) {
        const newY = startPositionY + (deltaY / window.innerHeight) * 100
        setPositionY(Math.min(90, Math.max(0, newY)))
      }
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)

      if (!draggingRef.current) {
        handleSidePanel()
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  // Opens the side panel and clears the notification badge
  const handleSidePanel = () => {
    setHasNotification(false)
    chrome.runtime.sendMessage({ type: "open_sidepanel" })
  }

  return (
    <div>
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "fixed",
          top: `${positionY}%`,
          right: "12px",
          borderRadius: 10,
          padding: 10,
          background: "black",
          color: "white",
          border: "1px solid #fff",
          cursor: "grab",
          zIndex: 9999,
          opacity: 0.2,
          transition: "opacity 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.2"
        }}
      >
        <div style={{ position: "relative" }}>
          {/* Main button icon */}
          <IntuitionSearchIcon
            onSearch={() => {}}
            size={35}
            position={{ x: 0, y: 0 }}
            className="hover:opacity-80 transition-opacity"
          />
          {/* Ping-style animated badge when a notification is active */}
          {hasNotification && (
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "12px",
                height: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "9999px",
                  backgroundColor: "#38bdf8",
                  animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
                  opacity: 0.75
                }}
              />
              <span
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "9999px",
                  backgroundColor: "#0ea5e9"
                }}
              />
            </span>
          )}
        </div>
      </div>

      {/* CSS animation for the ping effect */}
      <style>
        {`@keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }`}
      </style>
    </div>
  )
}

import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useRef, useState } from "react"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"

import { ApolloProvider, useSubscription } from "@apollo/client"
import { apolloSubscriptionClient } from "~src/graphql/src/apollo-subscription-client"
import { FollowerActivityDocument } from "~src/graphql/src/generated/subscriptions"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector("body")

export const getShadowHostId = () => "plasmo-inline-example-unique-id"

const FOLLOWER_IDS = ["0xd01cd97bf00bddfbccf0a79a2a579e8add6ac4f8"]

export default function Wrapper() {
  return (
    <ApolloProvider client={apolloSubscriptionClient}>
      <PlasmoInline />
    </ApolloProvider>
  )
}

export function PlasmoInline() {
  const [positionY, setPositionY] = useState<number>(50)
  const [hasNotification, setHasNotification] = useState(false)
  const draggingRef = useRef(false)

  const { data } = useSubscription(FollowerActivityDocument, {
    variables: { limit: 1 }
  })

  useEffect(() => {
    const event = data?.events?.[0]
    const actorId = event?.account?.id
    const type = event?.type

    if (
      actorId &&
      FOLLOWER_IDS.includes(actorId) &&
      (type === "ClaimCreated" || type === "AtomCreated")
    ) {
      setHasNotification(true)
    }
  }, [data])

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
          <IntuitionSearchIcon
            onSearch={() => {}}
            size={35}
            position={{ x: 0, y: 0 }}
            className="hover:opacity-80 transition-opacity"
          />
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

import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useRef, useState } from "react"
import {
  gql,
  useQuery,
  useSubscription,
  ApolloProvider
} from "@apollo/client"
import { apolloSubscriptionClient } from "~src/graphql/src/apollo-subscription-client"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector("body")

export const getShadowHostId = () => "plasmo-floating-button"

const EVENTS_SUBSCRIPTION = gql`
  subscription Events($limit: Int!) {
    events(
      where: { deposit: { is_atom_wallet: { _eq: false } } }
      order_by: [{ block_number: desc }]
      limit: $limit
    ) {
      type
      deposit {
        sender {
          id
        }
      }
    }
  }
`

const GET_FOLLOWINGS = gql`
  query getFollowingsFromAddress($address: String!) {
    triples(
      where: {
        predicate: { label: { _eq: "follow" } }
        subject: { accounts: { id: { _eq: $address } } }
      }
    ) {
      object {
        id
      }
    }
  }
`

const FloatingButton = ({ address }: { address: string }) => {
  const [positionY, setPositionY] = useState<number>(50)
  const [hasNotification, setHasNotification] = useState(false)
  const draggingRef = useRef(false)

  const { data: followData } = useQuery(GET_FOLLOWINGS, {
    variables: { address: address?.toLowerCase() },
    skip: !address
  })

  const { data: eventData } = useSubscription(EVENTS_SUBSCRIPTION, {
    variables: { limit: 1 }
  })

  const followingIds =
    followData?.triples?.map((t) => t.object?.id).filter(Boolean) ?? []

  console.log("🐛 Raw followData:", followData)
  console.log("🎯 followings (from triples):", followingIds)

  useEffect(() => {
    const latestEvent = eventData?.events?.[0]
    const actorId = latestEvent?.deposit?.sender?.id
    const eventType = latestEvent?.type

    if (
      actorId &&
      followingIds.includes(actorId) &&
      ["ClaimCreated", "AtomCreated", "TripleCreated"].includes(eventType)
    ) {
      console.log("🔔 Real event from followed account:", actorId)
      setHasNotification(true)
    }
  }, [eventData, followingIds])

  const handleMouseDown = (e: React.MouseEvent) => {
    const startY = e.clientY
    const startPositionY = positionY
    draggingRef.current = false

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY
      if (Math.abs(deltaY) > 5) draggingRef.current = true
      if (draggingRef.current) {
        const newY = startPositionY + (deltaY / window.innerHeight) * 100
        setPositionY(Math.min(90, Math.max(0, newY)))
      }
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      if (!draggingRef.current) {
        setHasNotification(false)
        chrome.runtime.sendMessage({ type: "open_sidepanel" })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  return (
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
        opacity: 0.4,
        transition: "opacity 0.3s ease"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
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

const Wrapper = () => {
  const [address, setAddress] = useState<string>("")

  useEffect(() => {
    chrome.storage.local.get("metamask-account", (res) => {
      const addr = res["metamask-account"]
      if (addr) {
        console.log(" Metamask account loaded:", addr)
        setAddress(addr)
      } else {
        console.warn(" No metamask-account found in storage")
      }
    })
  }, [])

  return (
    <ApolloProvider client={apolloSubscriptionClient}>
      <FloatingButton address={address} />
    </ApolloProvider>
  )
}

export default Wrapper

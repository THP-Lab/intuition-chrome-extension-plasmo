import { ApolloProvider } from "@apollo/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { apolloClient } from "../lib/apolo-client"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import React, { useEffect, useRef, useState } from "react"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"
import { useGetClaimsByUriQuery } from "~src/graphql/src"
const queryClient = new QueryClient()
import { normalizeUrl, buildUriRegex } from "../lib/url"


export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector("body")

export const getShadowHostId = () => "plasmo-inline-example-unique-id"

function PlasmoInline() {
  const [positionY, setPositionY] = useState<number>(50)

  const uri = normalizeUrl(window.location.href)
  const uriRegex = buildUriRegex(uri)

  const { data, loading, refetch } = useGetClaimsByUriQuery({
    uriRegex,
    address: "" 
  })


  // 1) déplace ton injection dans une fonction réutilisable
  const inject = () => {
    if (!loading && data) {
      chrome.storage.local.set(
        {
          claimByUriResult: { uri, data }
        },
        () => {
          console.log("✅ Data injected from GraphQL", data);
        }
      );
    }
  };


  useEffect(() => {
    const listener = (msg: any) => {
      if (msg.action === "REFRESH_CLAIMS") {
        console.log("[PlasmoInline] → REFRESH_CLAIMS reçu");
        // 1) refetch les données
        refetch()
          .then(() => {
            // 2) puis inject dans le storage
            inject();
          })
          .catch((e) =>
            console.error("[PlasmoInline] refetch() error:", e)
          );
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [refetch, loading, data, uri]);

    useEffect(inject, [loading, data, uri]);


  const draggingRef = useRef(false)

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
        <IntuitionSearchIcon
          onSearch={() => {}}
          size={35}
          position={{ x: 0, y: 0 }}
          className="hover:opacity-80 transition-opacity"
        />
      </div>
    </div>
  )
}


const PlasmoInlineWrapper = () => (
  <ApolloProvider client={apolloClient}>
    <QueryClientProvider client={queryClient}>
      <PlasmoInline />
    </QueryClientProvider>
  </ApolloProvider>
)

export default PlasmoInlineWrapper

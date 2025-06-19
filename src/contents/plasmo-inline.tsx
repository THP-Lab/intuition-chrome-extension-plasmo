import { ApolloProvider } from "@apollo/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { apolloClient } from "../lib/apolo-client"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import React, { useEffect, useRef, useState } from "react"
import IntuitionButtonIcon  from "~src/components/icons/IntuitionButtonIcon"
import { useStorage } from "@plasmohq/storage/dist/hook"
import { useGetClaimsByUriQuery } from "~src/graphql/src"
const queryClient = new QueryClient()
import { normalizeUrl, buildUriRegex } from "../lib/url"
import WarningPopup from "~/src/components/WarningPopup"
import ReportDropdown from "~src/components/ReportDropdown"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector("body")

export const getShadowHostId = () => "plasmo-inline-example-unique-id"

function PlasmoInline() {
  const iconSize = 35
  const [positionY, setPositionY] = useState<number>(50)
  const [isHolding, setIsHolding] = useState(false)
  const draggingRef = useRef(false)
  const [hovered, setHovered] = useState(false)
  const [autoVisible, setAutoVisible] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

  const [walletAddress] = useStorage<string>("metamask-account", "")
  const uri = normalizeUrl(window.location.href)
  const uriRegex = buildUriRegex(uri)

  const { data, loading, isLoading, refetch } = useGetClaimsByUriQuery({
    uriRegex,
    address: walletAddress 
  })

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
    setAutoVisible(true)
    const timer = setTimeout(() => setAutoVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleIntuitionMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowDropdown(true)
    }, 500)
  }
  const handleIntuitionMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }
  }

  useEffect(() => {
    const listener = (msg: any) => {
      if (msg.action === "REFRESH_CLAIMS") {
        console.log("[PlasmoInline] → REFRESH_CLAIMS reçu");
        refetch()
          .then(() => {
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

  const atoms = data?.atoms ?? []
  const allClaims = atoms.flatMap(atom => [
    ...(atom.as_object_claims_aggregate?.nodes ?? []),
    ...(atom.as_subject_claims_aggregate?.nodes ?? [])
  ])
  const hasScam = allClaims.some(
    c => c.predicate?.label === "is" && c.object?.label === "Scam"
  )
  const hasTrustworthy = !hasScam && allClaims.some(
    c => c.predicate?.label === "is" && c.object?.label === "Trustworthy"
  )
  const highlightColor = hasScam ? "red" : hasTrustworthy ? "green" : undefined
  const showPopup = Boolean(highlightColor) && (hovered || autoVisible)

  const isWarningPopupActive = (highlightColor === "red" || highlightColor === "green") && (hovered || autoVisible)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsHolding(true)      
    draggingRef.current = false

    const startY = e.clientY
    const startPositionY = positionY

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

      setIsHolding(false)

      if (!draggingRef.current) {
        chrome.runtime.sendMessage({ type: "open_sidepanel" })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  const targetClaim = allClaims.find(
    c => c.predicate?.label === (hasScam ? "is" : "is") &&
        c.object?.label === (hasScam ? "Scam" : "Trustworthy")
  )
  
  console.log("DATA CLAIM SCAM OR TRUST", targetClaim)

  const vaultId = targetClaim?.vault?.id
    ? BigInt(targetClaim.vault.id) 
    : undefined
  const counterVaultId = targetClaim?.counter_vault?.id
    ? BigInt(targetClaim.counter_vault.id)
    : undefined
  const numPositionsFor = targetClaim?.vault?.positions_aggregate.aggregate?.count
  const numPositionsAgainst = targetClaim?.counter_vault?.positions_aggregate.aggregate?.count

  const userStake = Number(targetClaim?.vault?.positions?.[0]?.shares ?? 0)
  const userCounterStake = Number(targetClaim?.counter_vault?.positions?.[0]?.shares ?? 0)

  const initialVote: VoteChoice | undefined =
    userStake > 0
      ? "for"
      : userCounterStake > 0
      ? "against"
      : undefined


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
          cursor: isHolding ? "grabbing" : "grab",
          zIndex: 9999,
          opacity: 0.2,
          transition: "opacity 0.3s ease"
        }}
        onMouseEnter={e => {
          setHovered(true)
          e.currentTarget.style.opacity = "1"
        }}
        onMouseLeave={e => {
          setHovered(false)
          e.currentTarget.style.opacity = "0.2"
          setShowDropdown(false)
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {showDropdown && !isWarningPopupActive && <ReportDropdown />}
          <div
            onMouseEnter={handleIntuitionMouseEnter}
            onMouseLeave={handleIntuitionMouseLeave}
            style={{ display: "flex" }}
          >
            <IntuitionButtonIcon
              onSearch={() => {}}
              size={iconSize}
              loading={isLoading}
              highlightColor={highlightColor}
              position={{ x: 0, y: 0 }}
              className="hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
        {(highlightColor === "red" || highlightColor === "green") && (
          <WarningPopup
            message={highlightColor === "red" ? "Warning: Scam" : "Trustworthy"}
            offset={iconSize + (highlightColor === "red" ? 15 : 25)}
            bgColor={highlightColor}
            vaultId={vaultId}
            counterVaultId={counterVaultId}
            numPositionsFor={numPositionsFor}
            numPositionsAgainst={numPositionsAgainst}
            initialVote={initialVote}
            forceVisible={hovered || autoVisible}
          />
        )}
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

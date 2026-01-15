import { ApolloProvider } from "@apollo/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { apolloClient } from "../lib/apolo-client"
import type { PlasmoGetStyle, PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import React, { useEffect, useRef, useState } from "react"
import IntuitionButtonIcon  from "~src/components/icons/IntuitionButtonIcon"
import { useGetTriplesByUriQuery } from "@warzieram/graphql"
import { normalizeUrl, buildUriRegex } from "../lib/url"
import WarningPopup from "~/src/components/WarningPopup"
import ReportDropdown from "~src/components/ReportDropdown"
import styleText from "data-text:../styles/global.css"
import IntuitionIconPlus from "~src/components/icons/intuition_icon_plus"
import { useWalletAddress } from "~src/hooks/useWalletAddress"
import { useAtomIds } from "~src/hooks/useAtomIds"

const queryClient = new QueryClient()

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
  const body = document.querySelector("body")
  if (!body) {
    throw new Error("Body element not found")
  }
  return body
}

export const getShadowHostId = () => "plasmo-inline-example-unique-id"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

function PlasmoInline() {
  const iconSize = 35
  const [positionY, setPositionY] = useState<number>(50)
  const [isHolding, setIsHolding] = useState(false)
  const draggingRef = useRef(false)
  const [hovered, setHovered] = useState(false)
  const [autoVisible, setAutoVisible] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

const walletAddress = useWalletAddress();

  
  const uri = normalizeUrl(window.location.href)
  const uriRegex = buildUriRegex(uri)


  const { data, loading, refetch } = useGetTriplesByUriQuery({
    variables: {
      uriRegex,
      address: walletAddress ?? "" 
    },
    skip: !walletAddress
  })

  console.log("🟡 [PlasmoInline] Render state:", {
    loading,
    hasData: !!data,
    atomsCount: data?.atoms?.length ?? 0,
    uri,
    uriRegex,
    walletAddress
  });

  const inject = () => {
    console.log("📦 [PlasmoInline] inject() called - State:", {
      loading,
      hasData: !!data,
      atomsCount: data?.atoms?.length ?? 0,
      atoms: data?.atoms,
      uri
    });
    
    if (!loading && data) {
      const payload = { uri, data };
      console.log("💾 [PlasmoInline] Mise à jour du storage avec:", payload);
      
      chrome.storage.local.set(
        { claimByUriResult: payload },
        () => {
          console.log("✅ [PlasmoInline] Storage mis à jour avec succès");
          // Vérifier que c'est bien enregistré
          chrome.storage.local.get("claimByUriResult", (items) => {
            console.log("🔍 [PlasmoInline] Vérification storage:", items);
          });
        }
      );
    } else {
      console.log("⏳ [PlasmoInline] inject() skipped:", {
        loading,
        hasData: !!data
      });
    }
  };

  useEffect(() => {
  if (walletAddress) refetch()
}, [walletAddress, refetch])

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
        console.log("🔄 [PlasmoInline] REFRESH_CLAIMS reçu");
        console.log("📊 [PlasmoInline] État avant refetch:", {
          loading,
          hasData: !!data,
          atomsCount: data?.atoms?.length ?? 0,
          uri,
          walletAddress
        });
        
        // Attendre 2 secondes pour l'indexation GraphQL
        setTimeout(() => {
          console.log("🚀 [PlasmoInline] Lancement du refetch...");
          refetch()
            .then((result) => {
              console.log("✅ [PlasmoInline] Refetch terminé:", {
                hasData: !!result.data,
                atomsCount: result.data?.atoms?.length ?? 0,
                atoms: result.data?.atoms
              });
              inject();
            })
            .catch((e) => {
              console.error("❌ [PlasmoInline] Erreur refetch:", e);
            });
        }, 2000);
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [refetch, loading, data, uri]);

  useEffect(() => {
    console.log("🔄 [PlasmoInline] useEffect[inject] triggered:", {
      loading,
      hasData: !!data,
      atomsCount: data?.atoms?.length ?? 0,
      uri
    });
    inject();
  }, [loading, data, uri]);

  const atoms = data?.atoms ?? []
  const allClaims = atoms.flatMap(atom => [
    ...(atom.as_object_triples_aggregate?.nodes ?? []),
    ...(atom.as_subject_triples_aggregate?.nodes ?? [])
  ])

  console.log("📊 [PlasmoInline] Computed data:", {
    atomsCount: atoms.length,
    allClaimsCount: allClaims.length,
    loading
  });
  
  const atomIds = useAtomIds();
  const IS_ID = atomIds.IS;
  const SCAM_ID = atomIds.SCAM;
  const TRUSTWORTHY_ID = atomIds.TRUSTWORTHY;
  const hasScam = allClaims.some(
    c => c.predicate?.term_id == IS_ID && c.object?.term_id == SCAM_ID
  )
  const hasTrustworthy = allClaims.some(
    c => c.predicate?.term_id == IS_ID && c.object?.term_id == TRUSTWORTHY_ID
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
    c => c.predicate?.term_id == IS_ID &&
        (c.object?.term_id == SCAM_ID || c.object?.term_id == TRUSTWORTHY_ID)
  )
  
  console.log("DATA CLAIM SCAM OR TRUST", targetClaim)

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
          zIndex: 1,
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
          {showDropdown && !isWarningPopupActive && (
            <ReportDropdown 
              atoms={atoms}
              uri={uri}
            />
          )}

          <div
            onMouseEnter={handleIntuitionMouseEnter}
            onMouseLeave={handleIntuitionMouseLeave}
            style={{ display: "flex", position: "relative" }}
          >
            {(!data || atoms.length === 0) && !loading && (
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  zIndex: 2,
                  cursor: "pointer",
                  background: "black",
                  borderRadius: "50%",
                  boxShadow: "0 2px 8px #0004"
                }}
                onClick={e => {
                  e.stopPropagation();
                  console.log("[INLINE] Click on IntuitionIconPlus: sending open_sidepanel with /page-form");
                  chrome.runtime.sendMessage({ type: "open_sidepanel", route: "/page-form" }, (response) => {
                    console.log("[INLINE] open_sidepanel message sent, response:", response);
                  });
                }}
                onMouseDown={e => e.stopPropagation()}
                title="Add your Intuition"
              >
                <IntuitionIconPlus size={25} />
              </div>
            )}
            <IntuitionButtonIcon
              size={iconSize}
              loading={loading}
              highlightColor={highlightColor}
              position={{ x: 0, y: 0 }}
              className="hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
        {(highlightColor === "red" || highlightColor === "green") && (
          <WarningPopup
            message={highlightColor === "red" ? "Scam" : "Trustworthy"}
            offset={iconSize + 25}
            bgColor={highlightColor}
            targetClaim={targetClaim}
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

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import TabSystem from "~/src/components/TabSystem"
import EyeComponent from "~/src/components/3D/EyeComponent"
import AtomCard from "~src/components/AtomCard"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { normalizeUrl } from "../lib/url"


function Home() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [activeTab, setActiveTab] = useState("Claims")
  const [claims, setClaims] = useState<any[]>([])
  const [atomsWithTags, setAtomsWithTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

const isWebUrl = (url?: string) =>
  !!url && (url.startsWith("http://") || url.startsWith("https://"))

const refreshActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  
  console.log("[Home] 🔍 Active tab url:", tab?.url)
  
  // ✅ Si MetaMask/popup/extension devient "active", on ignore
  if (!isWebUrl(tab?.url)) {
    console.log("[Home] ⚠️ Ignored non-web tab url:", tab?.url)
    return
  }

  const url = normalizeUrl(tab!.url!)
  console.log("[Home] 🌐 Setting currentUrl to:", url)
  setCurrentUrl((prev) => (prev === url ? prev : url))

  if (tab?.id !== undefined) {
    chrome.tabs.sendMessage(tab.id, { type: "REFRESH_CLAIMS" })
  }
}

useEffect(() => {
  refreshActiveTab()
  chrome.tabs.onActivated.addListener(refreshActiveTab)
  
  // ✅ Filtrer onUpdated pour ne réagir que quand la page est complètement chargée
  const onUpdatedListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
    if (changeInfo.status !== "complete") return
    refreshActiveTab()
  }
  
  chrome.tabs.onUpdated.addListener(onUpdatedListener)
  return () => {
    chrome.tabs.onActivated.removeListener(refreshActiveTab)
    chrome.tabs.onUpdated.removeListener(onUpdatedListener)
  }
}, [])


useEffect(() => {
  console.log("[Home] 🔄 useEffect[currentUrl] triggered:", { currentUrl })
  
  setIsLoading(true)
  // ✅ Ne pas vider l'UI ici, on garde l'ancien écran jusqu'aux nouvelles data

  const KEY = "claimByUriResult"

  const process = (uri: string, data: any) => {
    console.log("[Home] 📦 process() appelé:", { 
      receivedUri: uri, 
      currentUrl, 
      normalized: normalizeUrl(uri),
      match: normalizeUrl(uri) === currentUrl,
      currentUrlEmpty: currentUrl === "",
      hasData: !!data,
      atomsCount: data?.atoms?.length ?? 0
    });
    
    // Si currentUrl n'est pas encore défini, on accepte les données
    // Sinon on vérifie que l'URL correspond
    if (currentUrl !== "" && normalizeUrl(uri) !== currentUrl) {
      console.log("[Home] ⚠️ URL mismatch, ignoring update", { 
        receivedUri: uri,
        normalized: normalizeUrl(uri), 
        currentUrl 
      });
      setIsLoading(false)
      return
    }

    const atoms = data.atoms ?? []
    console.log("[Home] 🔍 Extraction des données:", {
      atomsCount: atoms.length
    });

    const extractedClaims = Array.from(
      new Map(
        atoms
          .flatMap((atom: any) => [
            ...(atom.as_object_triples_aggregate?.nodes ?? []),
            ...(atom.as_subject_triples_aggregate?.nodes ?? []),
          ])
          .map((c: any) => [c.term_id, c])
      ).values()
    )

    const withTags = atoms.map((atom: any) => {
      const tags = atom.as_subject_claims_aggregate?.nodes
        ?.filter((c: any) => c.predicate?.label === "has tag")
        .map((c: any) => c.object)
        .filter(Boolean) ?? []

      const unique = Array.from(
        new Map(tags.map((t: any) => [t.id, t])).values()
      )

      return { ...atom, tags: unique }
    })

    console.log("[Home] ✅ Données traitées:", {
      claimsCount: extractedClaims.length,
      atomsWithTagsCount: withTags.length
    });

    setClaims(extractedClaims)
    setAtomsWithTags(withTags)
    setIsLoading(false)
  }

  chrome.storage.local.get(KEY, (items) => {
    const stored = items[KEY]
    console.log("[Home] 📂 Lecture initiale du storage:", {
      hasStored: !!stored,
      storedUri: stored?.uri,
      currentUrl,
      hasData: !!stored?.data,
      atomsCount: stored?.data?.atoms?.length ?? 0
    });
    
    if (stored && stored.uri && stored.data) {
      process(stored.uri, stored.data)
    } else {
      console.log("[Home] ⚠️ Pas de données dans le storage");
      setIsLoading(false)
    }
  })

  const onChange = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string
  ) => {
    console.log("[Home] 🔔 onChange event:", {
      areaName,
      hasKeyChange: !!changes[KEY],
      allKeys: Object.keys(changes)
    });
    
    if (areaName !== "local" || !changes[KEY]) return
    
    const newValue = changes[KEY].newValue
    console.log("[Home] 📨 newValue reçu:", {
      hasNewValue: !!newValue,
      newValueUri: newValue?.uri,
      hasData: !!newValue?.data
    });
    
    if (!newValue || !newValue.uri || !newValue.data) {
      console.log("[Home] ⚠️ Storage cleared or invalid data:", newValue)
      return
    }
    const { uri, data } = newValue
    process(uri, data)
  }
  chrome.storage.onChanged.addListener(onChange)

  return () => {
    chrome.storage.onChanged.removeListener(onChange)
  }
}, [currentUrl])


  const tabs = [
    {
      label: "Claims",
      content: (
        <div>
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : claims.length !== 0 ? (
            <div>
              {console.log("[Home] 🎨 Rendu des claims:", claims.length)}
              {claims.map(
                (claim, index) => (
                  <ClaimRowLite
                    key={`${claim.term_id}-${index}`}
                    claim={claim}
                  />
                )
              )}
            </div>
          ) : (
            <div className="p-4 rounded text-center space-y-2">
              <p className="text-sm text-foreground">
                No claims found for this URL.
              </p>
              <p className="text-sm text-foreground">
                <Link
                  to="/page-form"
                  className="text-blue-600 hover:underline font-medium">
                  Be the first
                </Link>
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      label: "Identities",
      content: (
        <div>
          {isLoading ? (
            "Loading..."
          ) : atomsWithTags.length !== 0 ? (
            atomsWithTags.map((atom) => (
              <AtomCard key={atom.term_id} atom={atom} tags={atom.tags} />
            ))
          ) : (
            <div className="p-4 rounded text-center space-y-2">
              <p className="text-sm text-foreground">
                No atoms found for this URL.
              </p>
              <p className="text-sm text-foreground">
                <Link
                  to="/page-form"
                  className="text-blue-600 hover:underline font-medium">
                  Be the first
                </Link>
              </p>
            </div>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="relative w-full" style={{ height: "280px" }}>
        <h1 className="light-sweep-heading text-center relative z-10 mt-[10px]">
          INTUITION
        </h1>
        <EyeComponent
          style={{
            width: "250px",
            height: "500px",
            position: "absolute",
            top: "-90px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 0,
            opacity: 0.9,
            pointerEvents: "none"
          }}
        />
      </div>

      <div className="mt-1">
  
        <TabSystem
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  )
}

export default Home

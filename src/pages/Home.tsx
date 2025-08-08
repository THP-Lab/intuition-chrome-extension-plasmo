import { useQueryClient } from "@tanstack/react-query"
import { useGetTriplesByUriQuery } from "@warzieram/graphql"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "~/src/components/ThemeProvider"  
import { useStorage } from "@plasmohq/storage/dist/hook"
import TabSystem from "~/src/components/TabSystem"
import EyeComponent from "~/src/components/3D/EyeComponent"
import AtomCard from "~src/components/AtomCard"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { normalizeUrl } from "../lib/url"


function Home() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [walletAddress] = useStorage<string>("metamask-account", "")
  const [activeTab, setActiveTab] = useState("Claims")
  const [claims, setClaims] = useState<any[]>([])
  const [atomsWithTags, setAtomsWithTags] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

const refreshActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  const url = tab?.url ? normalizeUrl(tab.url) : ""
  setCurrentUrl(url)
  if (tab?.id !== undefined) {
    chrome.tabs.sendMessage(tab.id, { type: "REFRESH_CLAIMS" })
  }
}

useEffect(() => {
  refreshActiveTab()
  chrome.tabs.onActivated.addListener(refreshActiveTab)
  chrome.tabs.onUpdated.addListener(refreshActiveTab)
  return () => {
    chrome.tabs.onActivated.removeListener(refreshActiveTab)
    chrome.tabs.onUpdated.removeListener(refreshActiveTab)
  }
}, [])


useEffect(() => {
  setIsLoading(true)
  setClaims([])
  setAtomsWithTags([])

  const KEY = "claimByUriResult"

  const process = (uri: string, data: any) => {
    if (normalizeUrl(uri) !== currentUrl) {
      setClaims([])
      setAtomsWithTags([])
      setIsLoading(false)
      return
    }

    const atoms = data.atoms ?? []

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

    setClaims(extractedClaims)
    setAtomsWithTags(withTags)
    setIsLoading(false)
  }

  chrome.storage.local.get(KEY, (items) => {
    const stored = items[KEY]
    if (stored && stored.uri && stored.data) {
      process(stored.uri, stored.data)
    } else {
      setIsLoading(false)
    }
  })

  const onChange = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string
  ) => {
    if (areaName !== "local" || !changes[KEY]) return
    const { uri, data } = changes[KEY].newValue
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
            "Loading..."
          ) : claims.length !== 0 ? (
            claims.map(
              (claim, index) => (
                <ClaimRowLite
                  key={`${claim.term_id}-${index}`}
                  claim={claim}
                />
              )
            )
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
      label: "Atoms",
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

        <p className="text-muted-foreground text-center relative z-10 mt-[220px]">
          "Intuition lets you explore, vote, and debate verifiable facts — all
          directly from your browser."
        </p>
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

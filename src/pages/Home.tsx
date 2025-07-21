import { useQueryClient } from "@tanstack/react-query"
import { useGetTriplesByUriQuery } from "@warzieram/graphql"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "~/src/components/ThemeProvider"  
import { useStorage } from "@plasmohq/storage/dist/hook"
import TabSystem from "~/src/components/TabSystem"
import ClaimRowLite from "~src/components/ui/ClaimRowLite";
import AtomCard from "~src/components/AtomCard";
import EyeComponent from "~/src/components/3D/EyeComponent"

function normalizeUrl(input: string): string {
  try {
    const u = new URL(input)
    let hostname = u.hostname.toLowerCase()
    if (hostname.startsWith("www.")) hostname = hostname.slice(4)
    let pathname = u.pathname
    if (pathname.endsWith("/") && pathname.length > 1) {
      pathname = pathname.slice(0, -1)
    }
    return `https://${hostname}${pathname}${u.search}${u.hash}`
  } catch {
    return input
  }
}

function buildUriRegex(rawUrl: string): string {
  const canonical = normalizeUrl(rawUrl)  
  let withoutProto = canonical.replace(/^https?:\/\//, "")

  if (withoutProto.endsWith("/")) {
    withoutProto = withoutProto.slice(0, -1)
  }
  const escaped = withoutProto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  return `^https?:\\/\\/(?:www\\.)?${escaped}\\/?$`
}


function Home() {
  const { theme } = useTheme()
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [walletAddress] = useStorage<string>("metamask-account", "")
  const [activeTab, setActiveTab] = useState("Claims")
  const [startRequest, setStartRequest] = useState(false)

  const queryClient = useQueryClient()
  console.log(queryClient)

  const getCurrentUrl = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    })
    console.log(tab.url)
    return tab.url
  }

  const refreshUrl = () => {
    getCurrentUrl().then((url) => {
      if (url) {
        setCurrentUrl(normalizeUrl(url))
      } else {
        setCurrentUrl("")
      }
    })
  }

  useEffect(() => {
    getCurrentUrl().then((url) => {
      if (url) setCurrentUrl(normalizeUrl(url))
    })
    chrome.tabs.onUpdated.addListener(refreshUrl)
    chrome.tabs.onActivated.addListener(refreshUrl)
    return () => {
      chrome.tabs.onUpdated.removeListener(refreshUrl)
      chrome.tabs.onActivated.removeListener(refreshUrl)
    }
  }, [])

  const uriRegex = buildUriRegex(currentUrl)
  console.log("normalized URL:", currentUrl)
  console.log("uriRegex:", uriRegex)

  const { data, loading, error } = useGetTriplesByUriQuery({variables : {uriRegex, address: walletAddress }})
  const atoms = data?.atoms ?? []
  console.log("current wallet address:", walletAddress)
  console.log("Data :", data)

  const claims = Array.from(
    new Map(
      atoms
        ?.flatMap((atom) => [
          ...atom.as_object_triples_aggregate.nodes,
          ...atom.as_subject_triples_aggregate.nodes
        ])
        .map((claim) => [claim.term_id, claim])
    ).values()
  )

  console.log("Claims :", claims)

  const atomsWithTags = atoms.map((atom) => {
    const tags = atom.as_subject_triples_aggregate.nodes
      .filter((claim) => claim.predicate.label === "has tag")
      .map((claim) => claim.object)
      .filter(Boolean)

    const uniqueTags = Array.from(
      new Map(tags.map((tag) => [tag.term_id, tag])).values()
    )

    return {
      ...atom,
      tags: uniqueTags
    }
  })

  console.log("Tags :", atomsWithTags)

  const tabs = [
    {
      label: "Claims",
      content: (
        <div>
          {loading ? (
            "Loading..."
          ) : typeof data !== "undefined" && claims.length !== 0 ? (
            claims.map(
              (claim, index) => (
                console.log(claim),
                (
                  <ClaimRowLite
                    key={`${claim.term_id}-${index}`}
                    claim={claim}
                  />
                )
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
          {loading ? (
            "Loading..."
          ) : typeof data !== "undefined" && atoms.length != 0 ? (
            atomsWithTags.map((atom) => {
              return (
                <AtomCard key={atom.term_id} atom={atom} tags={atom.tags} />
              )
            })
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
            width: "500px",
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
        {error && (
          <p className="text-red-500">
            An error occurred while requesting this page.
          </p>
        )}

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

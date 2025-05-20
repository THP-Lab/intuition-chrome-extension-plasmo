import { useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { useStorage } from "@plasmohq/storage/dist/hook"

import EyeComponent from "~/src/components/3D/EyeComponent"
import { useTheme } from "~/src/components/ThemeProvider"
import AtomCard from "~src/components/AtomCard"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"
import { useGetClaimsByUriQuery } from "~src/graphql/src"

import TabSystem from "../components/TabSystem"

function Home() {
  const { theme } = useTheme()
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [walletAddress] = useStorage<string>("metamask-account", "")
  const [activeTab, setActiveTab] = useState("Claims")

  const queryClient = useQueryClient()
  console.log(queryClient);
  
  const getCurrentUrl = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    })
    console.log(tab.url)
    return tab.url
  }
  const refreshUrl = () => {
    getCurrentUrl().then((url) => setCurrentUrl(url || ""))
  }
  useEffect(() => {
    refreshUrl()
    chrome.tabs.onUpdated.addListener(() => {
      refreshUrl()
    })

    chrome.tabs.onActivated.addListener(() => {
      refreshUrl()
    })
  }, [])

  const { data, isLoading, error } = useGetClaimsByUriQuery({
    uri: currentUrl,
    address: walletAddress
  })
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
          {isLoading ? (
            "Chargement..."
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
          {isLoading ? (
            "Chargement..."
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

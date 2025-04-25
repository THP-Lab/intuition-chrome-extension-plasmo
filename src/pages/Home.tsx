import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { useTheme } from "~/src/components/ThemeProvider"
import TabSystem from '../components/TabSystem';
import { useStorage } from "@plasmohq/storage/dist/hook"
import {  useGetClaimsByUriQuery } from "~src/graphql/src"
import ClaimRowLite from "~src/components/ui/ClaimRowLite";
import AtomCard from "~src/components/AtomCard";

function Home() {
  const { theme } = useTheme()
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [walletAddress] = useStorage<string>("metamask-account", "")
  const [activeTab, setActiveTab] = useState("Claims")

  useQueryClient() 

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

  const { data, isLoading, error } = useGetClaimsByUriQuery({uri: currentUrl, address: walletAddress })
  const atoms = data?.atoms ?? []
  console.log("current wallet address:", walletAddress);

  const claims = Array.from(
    new Map(
      atoms?.flatMap(atom => [...atom.as_object_claims_aggregate.nodes, ...atom.as_subject_claims_aggregate.nodes])
        .map(claim => [claim.triple_id, claim])

    ).values()
  )
 
  console.log(claims);

  const tabs = [
    {
      label: 'Claims',
      content: 
      <div>        
        {isLoading ? "Chargement..." : (typeof data !== "undefined" && claims.length !== 0)? 
        ( claims.map((claim, index) => (
          console.log(claim),
        
        <ClaimRowLite
          key={`${claim.id}-${index}`}
          claim={claim}
        />

          
            ))
        ) : (
          <div className="p-4 rounded text-center space-y-2">
            <p className="text-sm text-foreground">No claims found for this URL.</p>
            <p className="text-sm text-foreground">
              

              <Link to="/page-form"
                className="text-blue-600 hover:underline font-medium">
                Be the first
              </Link>
              
            </p>
          </div>
        )}
      </div>
    },
    {
      label: 'Atoms',
      content: 
      <div>
        {isLoading ? "Chargement...": (typeof data !== "undefined" &&  atoms.length != 0)?
          (atoms.map((atom) => {
            return (
              <AtomCard key={atom.id} atom={atom} />
            );
          })):
          (
          <div className="p-4 rounded text-center space-y-2">
            <p className="text-sm text-foreground">No atoms found for this URL.</p>
            <p className="text-sm text-foreground">
              

              <Link to="/page-form"
                className="text-blue-600 hover:underline font-medium">
                Be the first
              </Link>
              
            </p>
          </div>
          )

        }
        
      </div>
      
    },
  ];


  return (
    <div className="space-y-6">
      <div className="space-y-2">

      <h1 className="light-sweep-heading">Intuition</h1>

        <p className="text-muted-foreground, text-center ">
        "Intuition lets you explore, vote, and debate verifiable facts — all directly from your browser."
        </p>
      </div>

      <div>
        {error && <p className="text-red-500">An error occurred while requesting this page.</p>}

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

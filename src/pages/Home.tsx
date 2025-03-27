import React, { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useTheme } from "~/src/components/ThemeProvider"
import { AtomCard } from "../components/AtomCard"
import TabSystem from '../components/TabSystem';
import { useStorage } from "@plasmohq/storage/dist/hook"
import { GetClaimsByAtomQuery, useGetClaimsByAtomQuery, useGetClaimsByUriQuery } from "~src/graphql/src"
import type { Atoms, Claims } from "~node_modules/@0xintuition/graphql/dist"

function Home() {
  const { theme } = useTheme()
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [walletAddress] = useStorage<string>("metamask-account")
  useQueryClient() // Sets the client for gql queries

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
    console.log("current wallet address:", walletAddress);
    refreshUrl()
    chrome.tabs.onUpdated.addListener(() => {
      refreshUrl()
    })

    chrome.tabs.onActivated.addListener(() => {
      refreshUrl()
    })
  }, [])

  const { data, isLoading, error } = useGetClaimsByUriQuery({uri: currentUrl})
  const atoms = data?.atoms

  const claims = atoms?.flatMap(atom => [...atom.as_object_claims_aggregate.nodes, ...atom.as_subject_claims_aggregate.nodes]) || []
  console.log(claims);

  const tabs = [
    {
      label: 'Atom',
      content: 
      <div>        
        {isLoading ? "Chargement..." : (typeof data !== "undefined" && data["atoms"].length !== 0)? 
        ( claims.map((claim) => (
            <div>{claim.id} {claim.object.label} {claim.predicate.label} {claim.subject.label}</div>
          ))
        ) : (
          <p>Aucun atom trouvé pour cette URL.</p>
        )}
      </div>
    },
    {
      label: 'Onglet 2',
      content: <div>Contenu de l'onglet 2</div>
    },
    {
      label: 'Onglet 3',
      content: <div>Contenu de l'onglet 3</div>
    }
  ];


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Bienvenue sur Intuition</h1>
        <p className="text-muted-foreground">
          Cette application vous permet de gérer vos insights et vos recherches.
        </p>
      </div>


        <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Home Page - Atoms</h1>
        {error && <p className="text-red-500">Une erreur est survenue lors de la requête pour cette page.</p>}

        <TabSystem tabs={tabs} />


        
      </div>
    </div>
  )
}

export default Home

import React, { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchAtomsByUriQuery } from "../queries"
import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"
import { AtomCard } from "../components/AtomCard"

function Home() {
  const { theme } = useTheme()
  const [currentUrl, setCurrentUrl] = useState<string>("")
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
    getCurrentUrl().then((url) => setCurrentUrl(url))
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

  const { data, isLoading, error } = useSearchAtomsByUriQuery("", currentUrl)
  const atoms:any = data?.["atoms"] || [];

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

        
        {error && <p className="text-red-500">Erreur : {error.message}</p>}

        {isLoading ? "Chargement..." : data["atoms"][0] ? 
        ( atoms.map((atom: any) => (
            <AtomCard key={atom.id} atom={atom} />
          ))
        ) : (
          <p>Aucun atom trouvé pour cette URL.</p>
        )}
        
      </div>
    </div>
  )
}

export default Home

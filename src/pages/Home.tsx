import React, { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchAtomsByUriQuery } from "../queries"
import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"

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

  const { data, isLoading } = useSearchAtomsByUriQuery("", currentUrl)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Bienvenue sur Intuition</h1>
        <p className="text-muted-foreground">
          Cette application vous permet de gérer vos insights et vos recherches.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold mb-4">Thème actuel: {theme}</h2>

        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <p>
        Feed page <br/>
        {isLoading ? "Chargement..." : data["atoms"][0] ? JSON.stringify(data["atoms"]) : "Pas d'atoms pour cette page"}
      </p>
    </div>
  )
}

export default Home

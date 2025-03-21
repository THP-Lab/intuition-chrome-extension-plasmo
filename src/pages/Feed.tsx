import { useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"

import { useSearchAtomsByUriQuery } from "../queries"

function Feed() {
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

    refreshUrl();
    chrome.tabs.onUpdated.addListener(() => {
      refreshUrl();
    })

    chrome.tabs.onActivated.addListener(() => {
      refreshUrl();
    })
  }, [])

  const { data, isLoading } = useSearchAtomsByUriQuery("", currentUrl)
  return (
    <p>
      Feed page
      {isLoading ? "En train de charger" : JSON.stringify(data)}
    </p>
  )
}

export default Feed

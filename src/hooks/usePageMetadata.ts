import { useEffect, useState } from "react"

type PageMetadata = {
  title: string
  description: string
  favicon: string
  url: string
}

export function usePageMetadata(): PageMetadata {
  const [meta, setMeta] = useState<PageMetadata>({
    title: "",
    description: "",
    favicon: "",
    url: ""
  })

  useEffect(() => {
    const fetchPageDetails = async () => {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
      if (!tab?.id || !tab.url || tab.url.startsWith("chrome-extension://")) return

      const pageUrl = tab.url

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => {
            const getMeta = (name: string) =>
              document.querySelector(`meta[name="${name}"]`)?.getAttribute("content")

            return {
              title: document.title,
              description: getMeta("description") || "",
              favicon: [...document.querySelectorAll("link[rel~='icon']")]
                .map((el) => (el as HTMLLinkElement).href)[0] || ""
            }
          }
        },
        (results) => {
          const result = results?.[0]?.result
          if (result) {
            setMeta({
              title: result.title,
              description: result.description,
              favicon: result.favicon,
              url: pageUrl
            })
          }
        }
      )
    }

    fetchPageDetails()
  
    chrome.tabs.onUpdated.addListener(fetchPageDetails)
    chrome.tabs.onActivated.addListener(fetchPageDetails)
  
    return () => {
      chrome.tabs.onUpdated.removeListener(fetchPageDetails)
      chrome.tabs.onActivated.removeListener(fetchPageDetails)
    }
  }, [])

  return meta
}

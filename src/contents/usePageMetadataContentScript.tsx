import { useEffect, useState } from "react"

export function usePageMetadataContentScript() {
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    favicon: "",
    url: ""
  })

  useEffect(() => {
    const getMeta = (name: string) =>
      document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") || ""

    setMeta({
      title: document.title,
      description: getMeta("description"),
      favicon: [...document.querySelectorAll("link[rel~='icon']")].map(el => el.href)[0] || "",
      url: window.location.href
    })
  }, [])

  return meta
}

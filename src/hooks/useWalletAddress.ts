import React, { useEffect, useState } from "react";



export function useWalletAddress() {
  const [address, setAddress] = useState("")

  useEffect(() => {
    chrome.storage.sync.get(["metamask-account"], (res) => {
      setAddress((res["metamask-account"] || "").toLowerCase())
    })

    const onChanged = (changes: any, area: string) => {
      if (area !== "sync") return
      const ch = changes["metamask-account"]
      if (ch) setAddress((ch.newValue || "").toLowerCase())
    }

    chrome.storage.onChanged.addListener(onChanged)
    return () => chrome.storage.onChanged.removeListener(onChanged)
  }, [])

  return address
}
import React, { useState } from "react"

import { ThemeProvider } from "../components/ThemeProvider"

import "../styles/global.css"

function IndexPopup() {
  const [data, setData] = useState("")

  const handleSidePanel = () => {
    chrome.runtime.sendMessage({ type: "open_sidepanel" })
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
      <div className="w-64 min-h-[100px] p-4 bg-background text-foreground">
        <button
          onClick={handleSidePanel}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Open in sidePanel
        </button>
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup

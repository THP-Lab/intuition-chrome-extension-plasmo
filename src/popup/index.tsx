import React from "react"

import { ThemeProvider } from "../components/ThemeProvider"

import "../styles/global.css"

import Content from "~src/components/content"

function IndexPopup() {
  const handleSidePanel = () => {
    chrome.runtime.sendMessage({ type: "open_sidepanel" })
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
      <div className="min-w-[600px] min-h-[600px] p-4 bg-background text-foreground">
        <Content>
          <button
            onClick={handleSidePanel}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Open in sidePanel
          </button>
        </Content>
      </div>
      </ThemeProvider>
  )
}

export default IndexPopup

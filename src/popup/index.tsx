import React from "react"

import { ThemeProvider } from "../components/ThemeProvider"
import IntuitionPortalPanel from "~src/components/icons/intuition_portal_panel"

import Content from "~src/components/content"

function IndexPopup() {
  const handleSidePanel = () => {
    chrome.runtime.sendMessage({ type: "open_sidepanel" })
  }

  const portalX = 500 
  const portalY = 60

  return (
    <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
      <div className="min-w-[600px] min-h-[600px] p-4 bg-background text-foreground relative">
      
        <div style={{ position: 'absolute', left: `${portalX}px`, top: `${portalY}px` }}>
          <IntuitionPortalPanel 
            onClick={handleSidePanel}
            size={55}
            runnerSize={30}
            showRunner={true}
          />
        </div>
        
        <Content>
          
        </Content>
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup
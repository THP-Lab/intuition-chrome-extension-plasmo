import React from "react"

import Content from "~src/components/content"
import IntuitionPortalPanel from "~src/components/icons/intuition_portal_panel"
import ParticlesCanvas from "~src/components/ui/ParticulBg/ParticlesCanvas"
import GroupParticlesCanvas from "~src/components/ui/ParticulBg/GroupParticlesCanvas"

import { ThemeProvider } from "../components/ThemeProvider"
import { NavigationProvider } from "~src/components/layout/NavigationProvider"

function IndexPopup() {
  const handleSidePanel = () => {
    chrome.runtime.sendMessage({ type: "open_sidepanel" })
  }

  const portalX = 545
  const portalY = 55

  return (
    <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
      <NavigationProvider>
      <div className="min-w-[600px] min-h-[600px] p-4 bg-background text-foreground relative">
        <ParticlesCanvas />
        <GroupParticlesCanvas />
        <div
          style={{
            position: "absolute",
            left: `${portalX}px`,
            top: `${portalY}px`
          }}>
          <IntuitionPortalPanel onClick={handleSidePanel} size={50} />
        </div>

        <Content></Content>
      </div>
      </NavigationProvider>
    </ThemeProvider>
  )
}

export default IndexPopup

import React from "react"

import Content from "~src/components/content"
import ParticlesCanvas from "~src/components/ui/ParticulBg/ParticlesCanvas"
import GroupParticlesCanvas from "~src/components/ui/ParticulBg/GroupParticlesCanvas"
import { ThemeProvider } from "~src/components/ThemeProvider"
import { NavigationProvider } from "~src/components/layout/NavigationProvider"

function IndexSidepanel() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <ParticlesCanvas />
          <GroupParticlesCanvas />
          <Content />
        </div>
      </ThemeProvider>
    <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
      <NavigationProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ParticlesCanvas />
        <Content />
      </div>
      </NavigationProvider>
    </ThemeProvider>
    </>
  )
}

export default IndexSidepanel

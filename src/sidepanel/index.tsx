import React, { useEffect } from "react"
import { umamiCollect } from "../lib/umami"
import Content from "~src/components/content"
import ParticlesCanvas from "~src/components/ui/ParticulBg/ParticlesCanvas"
import GroupParticlesCanvas from "~src/components/ui/ParticulBg/GroupParticlesCanvas"
import { ThemeProvider } from "~src/components/ThemeProvider"

function IndexSidepanel() {

  useEffect(() => {
    umamiCollect("pageview", "/sidepanel").catch(console.error)
  }, [])

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <ParticlesCanvas />
          <GroupParticlesCanvas />
          <Content />
        </div>
      </ThemeProvider>
    </>
  )
}

export default IndexSidepanel

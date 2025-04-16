import React from "react"
import Content from "~src/components/content"
import { ThemeProvider } from "~src/components/ThemeProvider"
import ParticlesCanvas from "~src/components/ParticlesCanvas"

function IndexSidepanel() {
  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
      <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ParticlesCanvas />
        <Content />
      </div>
    </ThemeProvider>
    </>
  )
}

export default IndexSidepanel

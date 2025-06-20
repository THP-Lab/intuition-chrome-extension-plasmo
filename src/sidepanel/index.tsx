import React, { useEffect } from "react"
import { umami } from "../lib/umami"
import Content from "~src/components/content"
import ParticlesCanvas from "~src/components/ui/ParticulBg/ParticlesCanvas"
import GroupParticlesCanvas from "~src/components/ui/ParticulBg/GroupParticlesCanvas"
import { ThemeProvider } from "~src/components/ThemeProvider"
import { NavigationProvider } from "~src/components/layout/NavigationProvider"
import { BrowserRouter as Router } from "react-router-dom"

function IndexSidepanel() {

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "SIDEPANEL_READY" });
  }, []);

  useEffect(() => {
    umami("Open Side Panel")
    const port = chrome.runtime.connect({ name: "sidepanel" })

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        port.postMessage({ type: "init", tabId: tabs[0].id })
        console.log("[SIDEPANEL] Envoi tabId:", tabs[0].id)
      }
    })


    return () => {
      port.disconnect()
    }
  }, [])

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
        <NavigationProvider>
          <Router>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <ParticlesCanvas />
              <GroupParticlesCanvas />
              <Content />
            </div>
          </Router>
        </NavigationProvider>
      </ThemeProvider>
    </>
  )
}

export default IndexSidepanel

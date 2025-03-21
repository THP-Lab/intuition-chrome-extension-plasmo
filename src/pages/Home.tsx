import React from "react"
import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"

function Home() {
  const { theme } = useTheme()
  return (
    <div className="space-y-6">
     <div className="space-y-2">
        <h1 className="text-3xl font-bold">Bienvenue sur Intuition</h1>
        <p className="text-muted-foreground">
          Cette application vous permet de gérer vos insights et vos recherches.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold mb-4">Thème actuel: {theme}</h2>

        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    </div>
  )
}

export default Home

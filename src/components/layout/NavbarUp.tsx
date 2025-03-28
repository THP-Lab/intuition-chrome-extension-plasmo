import * as React from "react"
import { Link } from "react-router-dom"

import IntuitionThemeAvatar from "~/src/components/icons/IntuitionThemeAvatar"
import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"
import { cn } from "~src/lib/utils"

function NavbarUp() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSearch = (value: string) => {
    // Implémentez ici la logique de recherche
    console.log("Recherche:", value)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Groupe de boutons gauche */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center gap-2 p-2">
            <Link to="/page-form">
              <span>Plus</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 p-2">
            <span>IA</span>
          </Button>
        </div>

        <div className="flex-1" />

        {/* Bouton thème à droite */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-2 p-2",
            theme === "dark" ? "text-primary" : "text-foreground"
          )}>
          <IntuitionThemeAvatar size={32} className="mb-1" />
        </Button>
      </div>
    </nav>
  )
}

export default NavbarUp

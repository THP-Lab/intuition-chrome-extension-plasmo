import * as React from "react"
import { Link } from "react-router-dom"

import IntuitionThemeAvatar from "~/src/components/icons/IntuitionThemeAvatar"
import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"
import { cn } from "~src/lib/utils"
import IntuitionIconPlus from "~src/components/icons/intuition_icon_plus"

function NavbarUp() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSearch = (value: string) => {

    console.log("Recherche:", value)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-[hsl(var(--navbar-bg))] backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center gap-2 p-2"
            title="Create Atom">
            <Link to="/page-form">
              <IntuitionIconPlus size={28} />
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-2 p-2",
            theme === "dark" ? "text-primary" : "text-foreground"
          )}
          title="Theme">
          <IntuitionThemeAvatar size={32} className="mb-1" />
        </Button>
      </div>
    </nav>
  )
}

export default NavbarUp

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
    <nav className="navbar-up-container">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="navbar-up-button"
            title="Create Atom">
            <Link to="/page-form">
              <IntuitionIconPlus size={44} className="navbar-up-icon" />
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={cn(
            "navbar-up-button",
            theme === "dark" ? "text-primary" : "text-foreground"
          )}
          title="Theme">
          <IntuitionThemeAvatar size={44} className="navbar-up-icon"/>
        </Button>
      </div>
    </nav>
  )
}

export default NavbarUp

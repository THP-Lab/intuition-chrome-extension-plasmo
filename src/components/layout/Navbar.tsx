import { List } from "lucide-react"
import * as React from "react"
import { Link, useLocation } from "react-router-dom"

import IntuitionFeed from "~/src/components/icons/IntuitionFeed"
import IntuitionHistory from "~/src/components/icons/IntuitionHistory"
import IntuitionIcon from "~/src/components/icons/IntuitionIcon"
import IntuitionProfil from "~/src/components/icons/IntuitionProfil"
import IntuitionSearchIcon from "~/src/components/icons/IntuitionSearchIcon"
import IntuitionThemeAvatar from "~/src/components/icons/IntuitionThemeAvatar"
import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"
import { cn } from "~src/lib/utils"
import { umamiCollect } from "~src/lib/umami"

function Navbar() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleNavClick = (label: string, to: string) => {
    umamiCollect("nav_click", location.pathname, { label, to }).catch(
      console.error
    )
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  }

  return (
    <nav className="navbar-container">
      <div className="flex items-center justify-around p-0.5">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className={cn(
            "navbar-button",
            isActive("/") && "animate-fade-bg"
          )}>
          <Link to="/" className="flex flex-col items-center">
            <div className="text-foreground" title="Home" onClick={() => handleNavClick("Home", "/")}>
              <IntuitionIcon size={46} className="navbar-icon" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/search") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "navbar-button",
            isActive("/search") && "animate-fade-bg"
          )}>
          <Link to="/search" className="flex flex-col items-center" onClick={() => handleNavClick("Search", "/search")}>
            <div className="text-foreground" title="Search">
              <IntuitionSearchIcon size={44} className="navbar-icon" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/profile") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "navbar-button",
            isActive("/profile") && "animate-fade-bg"
          )}>
          <Link to="/profile" className="flex flex-col items-center" onClick={() => handleNavClick("Profile", "/profile")}>
            <div className="text-foreground" title="Profile">
              <IntuitionProfil size={44} className="navbar-icon" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/feed") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "navbar-button",
            isActive("/feed") && "animate-fade-bg"
          )}>
          <Link to="/feed" className="flex flex-col items-center" onClick={() => handleNavClick("Recent Activity", "/recent-activity")}>
            <div className="text-foreground" title="Feed">
              <IntuitionFeed size={44} className="navbar-icon" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/recent-activity") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "navbar-button",
            isActive("/recent-activity") && "animate-fade-bg"
          )}>
          <Link to="/recent-activity" className="flex flex-col items-center">
            <div className="text-foreground" title="Recent Activity">
              <IntuitionHistory size={44} className="navbar-icon" />
            </div>
          </Link>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar

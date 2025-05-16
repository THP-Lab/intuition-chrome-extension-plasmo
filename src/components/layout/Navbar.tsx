import * as React from "react"
import { Link, useLocation } from "react-router-dom"

import IntuitionFeed from "~/src/components/icons/IntuitionFeed"
import IntuitionHistory from "~/src/components/icons/IntuitionHistory"
import IntuitionIcon from "~/src/components/icons/IntuitionIcon"
import IntuitionIconTag from "~/src/components/icons/IntuitionIconTag"
import IntuitionSearchIcon from "~/src/components/icons/IntuitionSearchIcon"
import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"
import { cn } from "~src/lib/utils"
import { umami } from "~src/lib/umami"
import { Tags as TagsIcon } from "lucide-react"

function Navbar() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
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
            <div className="text-foreground" title="Home" onClick={() => umami("Home")}>
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
          <Link to="/search" className="flex flex-col items-center" onClick={() => umami("Search")}>
            <div className="text-foreground" title="Search">
              <IntuitionSearchIcon size={44} className="navbar-icon" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/tags") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "navbar-button",
            isActive("/tags") && "animate-fade-bg"
          )}>
          <Link
            to="/tags"
            className="flex flex-col items-center"
            onClick={() => umami("tags")}
          >
            <div className="relative w-11 h-11"> 
              <IntuitionIconTag size={44} className="navbar-icon" />
              <TagsIcon
                size={18}
                stroke={theme === 'dark' ? '#fff' : '#000'}
                className="absolute top-1/2 left-1/2 
                          transform -translate-x-1/2 -translate-y-1/2"
              />
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
          <Link to="/feed" className="flex flex-col items-center" onClick={() => umami("Feed")}>
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
          <Link to="/recent-activity" className="flex flex-col items-center" onClick={() => umami("Recent Activity")}>
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

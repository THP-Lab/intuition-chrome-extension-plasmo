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

function Navbar() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-around p-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className={cn(
            "flex min-w-[4rem] flex-col items-center gap-1 p-2",
            isActive("/") && "animate-fade-bg"
          )}>
          <Link to="/" className="flex flex-col items-center">
            <div className="text-foreground" title="Home">
              <IntuitionIcon size={32} className="mb-1" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/search") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "flex min-w-[4rem] flex-col items-center gap-1 p-2",
            isActive("/search") && "animate-fade-bg"
          )}>
          <Link to="/search" className="flex flex-col items-center">
            <div className="text-foreground" title="Search">
              <IntuitionSearchIcon size={32} className="mb-1" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/profile") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "flex min-w-[4rem] flex-col items-center gap-1 p-2",
            isActive("/profile") && "animate-fade-bg"
          )}>
          <Link to="/profile" className="flex flex-col items-center">
            <div className="text-foreground" title="Profile">
              <IntuitionProfil size={32} className="mb-1" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/feed") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "flex min-w-[4rem] flex-col items-center gap-1 p-2",
            isActive("/feed") &&
              "animate-fade-bg bg-primary text-primary-foreground hover:bg-primary/90"
          )}>
          <Link to="/feed" className="flex flex-col items-center">
            <div className="text-foreground" title="Feed">
              <IntuitionFeed size={32} className="mb-1" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/recent-activity") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "flex min-w-[4rem] flex-col items-center gap-1 p-2",
            isActive("/recent-activity") && "animate-fade-bg"
          )}>
          <Link to="/recent-activity" className="flex flex-col items-center">
            <div className="text-foreground" title="Recent Activity">
              <IntuitionHistory size={32} className="mb-1" />
            </div>
          </Link>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar

import { List, User } from "lucide-react"
import React from "react"
import { Link, useLocation } from "react-router-dom"

import IntuitionIcon from "~/src/components/icons/IntuitionIcon"
import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"
import { useSvgSprites } from "~/src/lib/sprite-loader"
import { cn } from "~/src/lib/utils"

import WalletConnectionButton from "../WalletConnectionButton"

function Navbar() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  useSvgSprites()

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
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
            <div className="text-foreground">
              <IntuitionIcon size={32} className="mb-1" />
            </div>
          </Link>
        </Button>

        <Button
          variant={isActive("/profile") ? "default" : "ghost"}
          size="sm"
          asChild
          className="flex min-w-[4rem] flex-col items-center gap-1 p-2">
          <Link to="/profile">
            <User className="h-6 w-6" />
            <span className="text-[0.65rem] font-medium">Profil</span>
          </Link>
        </Button>

        <Button
          variant={isActive("/feed") ? "default" : "ghost"}
          size="sm"
          asChild
          className="flex min-w-[4rem] flex-col items-center gap-1 p-2">
          <Link to="/feed">
            <List className="h-6 w-6" />
            <span className="text-[0.65rem] font-medium">Feed</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="flex min-w-[4rem] flex-col items-center gap-1 p-2">
          <svg className="h-6 w-6">
            <use
              href={
                theme === "light" ? "#trust-circle" : "#trust-circle-filled"
              }
            />
          </svg>
          <span className="text-[0.65rem] font-medium">Thème</span>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar

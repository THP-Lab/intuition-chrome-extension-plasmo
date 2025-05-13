import * as React from "react"
import { Link } from "react-router-dom"

import { Button } from "~/src/components/ui/button"
import { cn } from "~src/lib/utils"
import IntuitionIconPlus from "~src/components/icons/intuition_icon_plus"
import IntuitionProfil from "~/src/components/icons/IntuitionProfil"
import { umami } from "~src/lib/umami"


function NavbarUp() {

    const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
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
          variant={isActive("/profile") ? "default" : "ghost"}
          size="sm"
          asChild
          className={cn(
            "navbar-up-button",
            isActive("/profile") && "animate-fade-bg"
          )}>
          <Link to="/profile" className="flex flex-col items-center" onClick={() => umami("Profile")}>
            <div className="text-foreground" title="Profile">
              <IntuitionProfil size={44} className="navbar-up-icon" />
            </div>
          </Link>
        </Button>
      </div>
    </nav>
  )
}

export default NavbarUp

import {
  LockClosedIcon,
  MoonIcon,
  PersonIcon,
  SunIcon
} from "@radix-ui/react-icons"
import { Link } from "react-router-dom"

import { useTheme } from "../ThemeProvider"
import { Button } from "../ui/button"

function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <PersonIcon className="h-5 w-5 text-primary" />
        <span className="text-lg font-semibold text-primary">Intuition</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">Home</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/profile">Profil</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/feed">Feed</Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="ml-2 rounded-full">
          {theme === "light" ? (
            <MoonIcon className="h-4 w-4" />
          ) : (
            <SunIcon className="h-4 w-4" />
          )}
          <span className="sr-only">Changer de thème</span>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar

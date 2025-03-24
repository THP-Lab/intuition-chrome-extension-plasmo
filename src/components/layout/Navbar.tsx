import { Home, List, User } from "lucide-react"
import { Link } from "react-router-dom"

import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"
import { useSvgSprites } from "~/src/lib/sprite-loader"

function Navbar() {
  const { theme, setTheme } = useTheme()
  useSvgSprites() // Charger les sprites SVG

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">Intuition</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/profile">
              <User className="w-4 h-4 mr-1" />
              Profile
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/feed">
              <List className="w-4 h-4 mr-1" />
              Feed
            </Link>
          </Button>
        </div>
      </div>
      <Button variant="outline" size="icon" onClick={toggleTheme}>
        <svg className="w-4 h-4">
          <use
            href={theme === "light" ? "#trust-circle" : "#trust-circle-filled"}
          />
        </svg>
      </Button>
    </nav>
  )
}

export default Navbar

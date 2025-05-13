import React from "react";
import IntuitionNavSwitch from "~src/components/layout/IntuitionNavSwitch";
import IntuitionThemeAvatar from "~/src/components/icons/IntuitionThemeAvatar"
import { useTheme } from "~/src/components/ThemeProvider"
import { Button } from "~/src/components/ui/button"
import { useNavigation } from "~src/components/layout/NavigationProvider"
import { cn } from "~src/lib/utils";


function Preference() {

  const { theme, setTheme } = useTheme()
  const { navType, setNavType } = useNavigation()

  const toggleNavType = () => {
    console.log("ProfileLayout toggleNavType appelé");
    setNavType(navType === "classic" ? "arc" : "classic");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

 return (
  <section className={cn(
    "border rounded-lg p-4",
    "bg-background text-foreground",
    "shadow-sm hover:shadow-md transition-shadow"
  )}>
    <h2 className="text-xl font-semibold mb-4">Preference</h2>
    <div>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "navbar-up-button",
        )}
        title={`Switch to ${navType === "classic" ? "Arc" : "Classic"} Nav`}
        onClick={toggleNavType}
      >
        <div className="text-foreground">
          <IntuitionNavSwitch size={40} className="navbar-up-icon"/>
        </div>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={cn(
          "navbar-up-button",
          theme === "dark" ? "text-primary" : "text-foreground"
        )}
        title="Theme">
        <IntuitionThemeAvatar size={40} className="navbar-up-icon"/>
      </Button>
    </div>
  </section>
  )
}

export default Preference
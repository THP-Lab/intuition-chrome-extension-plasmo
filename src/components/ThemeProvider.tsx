import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "intuition-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  // Charger le thème depuis chrome.storage.local au chargement du composant
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Vérifier si nous sommes dans une extension Chrome
        if (typeof chrome !== "undefined" && chrome.storage) {
          const result = await chrome.storage.local.get(storageKey)
          const savedTheme = result[storageKey] as Theme
          if (savedTheme) {
            setTheme(savedTheme)
          }
        } else {
          // Fallback pour le développement local
          const savedTheme = localStorage.getItem(storageKey) as Theme
          if (savedTheme) {
            setTheme(savedTheme)
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du thème:", error)
      }
    }

    loadTheme()
  }, [storageKey])

  // Appliquer le thème et le sauvegarder lorsqu'il change
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)

    try {
      // Sauvegarder dans chrome.storage si disponible
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ [storageKey]: theme })
      } else {
        // Fallback pour le développement local
        localStorage.setItem(storageKey, theme)
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du thème:", error)
    }
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    }
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

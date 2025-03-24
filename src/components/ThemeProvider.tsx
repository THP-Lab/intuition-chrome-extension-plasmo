import React, { createContext, useContext, useEffect, useState } from "react"

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
  theme: "dark",
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "intuition-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Charger le thème depuis chrome.storage.local au chargement du composant
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Vérifier si nous sommes dans une extension Chrome
        if (typeof chrome !== "undefined" && chrome.storage) {
          const result = await chrome.storage.local.get(storageKey)
          const savedTheme = result[storageKey] as Theme
          if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
            setTheme(savedTheme)
          } else {
            // Si pas de thème sauvegardé ou invalide, utiliser le thème système
            const systemTheme = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches
              ? "dark"
              : "light"
            setTheme(systemTheme)
          }
        } else {
          // Fallback pour le développement local
          const savedTheme = localStorage.getItem(storageKey) as Theme
          if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
            setTheme(savedTheme)
          } else {
            // Si pas de thème sauvegardé ou invalide, utiliser le thème système
            const systemTheme = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches
              ? "dark"
              : "light"
            setTheme(systemTheme)
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du thème:", error)
        // En cas d'erreur, utiliser le thème par défaut
        setTheme(defaultTheme)
      } finally {
        setMounted(true)
      }
    }

    loadTheme()

    // Écouter les changements de thème système
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light"
      setTheme(newTheme)
    }
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [storageKey, defaultTheme])

  // Appliquer le thème et le sauvegarder lorsqu'il change
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.style.colorScheme = theme

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
  }, [theme, storageKey, mounted])

  // Éviter le flash de contenu non thémé
  if (!mounted) {
    return null
  }

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

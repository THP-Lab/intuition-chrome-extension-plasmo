import React, { createContext, useContext, useEffect, useState } from "react"

declare global {
  interface Window {
    __theme?: "light" | "dark"
  }
}

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

  useEffect(() => {
    window.__theme = theme
  }, [theme])

  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Vérify if we are in a chrome extension
        if (typeof chrome !== "undefined" && chrome.storage) {
          const result = await chrome.storage.local.get(storageKey)
          const savedTheme = result[storageKey] as Theme
          if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
            setTheme(savedTheme)
          } else {
            const systemTheme = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches
              ? "dark"
              : "light"
            setTheme(systemTheme)
          }
        } else {
          const savedTheme = localStorage.getItem(storageKey) as Theme
          if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
            setTheme(savedTheme)
          } else {
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
        setTheme(defaultTheme)
      } finally {
        setMounted(true)
      }
    }

    loadTheme()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light"
      setTheme(newTheme)
    }
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [storageKey, defaultTheme])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.style.colorScheme = theme

    try {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ [storageKey]: theme })
      } else {
        localStorage.setItem(storageKey, theme)
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du thème:", error)
    }
  }, [theme, storageKey, mounted])

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

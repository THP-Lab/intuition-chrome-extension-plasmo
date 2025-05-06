import React, { createContext, useContext, useEffect, useState } from "react"

type NavType = "classic" | "arc"

type NavigationProviderProps = {
  children: React.ReactNode
  defaultNav?: NavType
  storageKey?: string
}

type NavigationProviderState = {
  navType: NavType
  setNavType: (nav: NavType) => void
}

const initialState: NavigationProviderState = {
  navType: "classic",
  setNavType: () => null
}

const NavigationContext = createContext<NavigationProviderState>(initialState)

export function NavigationProvider({
  children,
  defaultNav = "classic",
  storageKey = "intuition-nav-type",
  ...props
}: NavigationProviderProps) {
  const [navType, setNavType] = useState<NavType>(defaultNav)

  useEffect(() => {
    const loadNavType = async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.storage) {
          const result = await chrome.storage.local.get(storageKey)
          const savedNav = result[storageKey] as NavType
          if (savedNav) {
            setNavType(savedNav)
          }
        } else {
          const savedNav = localStorage.getItem(storageKey) as NavType
          if (savedNav) {
            setNavType(savedNav)
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du type de navigation:", error)
      }
    }

    loadNavType()
  }, [storageKey])

  const saveNavType = async (newNavType: NavType) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage) {
        await chrome.storage.local.set({ [storageKey]: newNavType })
      } else {
        localStorage.setItem(storageKey, newNavType)
      }
      setNavType(newNavType)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du type de navigation:", error)
    }
  }

  return (
    <NavigationContext.Provider 
      value={{ navType, setNavType: saveNavType }} 
      {...props}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation doit être utilisé dans un NavigationProvider")
  }
  return context
}
import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: React.ReactNode
}

export const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLElement | null>(null)
  
  useEffect(() => {
    // Créer le conteneur une seule fois
    if (!containerRef.current) {
      containerRef.current = document.createElement('div')
      containerRef.current.className = 'portal-container'
    }
    
    // Trouver l'élément racine où monter le portail
    if (!rootRef.current) {
      rootRef.current = document.body
    }
    
    // Monter le conteneur dans le DOM
    if (rootRef.current && containerRef.current) {
      rootRef.current.appendChild(containerRef.current)
      
      // Important: attendre que le nœud soit dans le DOM avant de rendre le contenu
      setTimeout(() => {
        setMounted(true)
      }, 0)
    }
    
    return () => {
      if (rootRef.current && containerRef.current) {
        // Nettoyer le DOM lors du démontage
        rootRef.current.removeChild(containerRef.current)
      }
      setMounted(false)
    }
  }, [])

  // Ne rien rendre jusqu'à ce que le conteneur soit monté
  if (!mounted || !containerRef.current) return null
  
  // Créer le portail une fois le conteneur monté
  return createPortal(children, containerRef.current)
}
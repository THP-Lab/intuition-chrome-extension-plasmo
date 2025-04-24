import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useLocation, useNavigate } from "react-router-dom"

import IntuitionIconPlus from "~/src/components/icons/intuition_icon_plus"
import IntuitionFeed from "~/src/components/icons/IntuitionFeed"
import IntuitionHistory from "~/src/components/icons/IntuitionHistory"
// Importation de tes icônes personnalisées
import IntuitionIcon from "~/src/components/icons/IntuitionIcon"
import IntuitionProfil from "~/src/components/icons/IntuitionProfil"
import IntuitionSearchIcon from "~/src/components/icons/IntuitionSearchIcon"
import IntuitionThemeAvatar from "~/src/components/icons/IntuitionThemeAvatar"
import { useTheme } from "~/src/components/ThemeProvider"

// Fonction utilitaire pour calculer les dimensions responsives
const getResponsiveValues = () => {
  if (typeof window === "undefined") return { radius: 188, bottomOffset: -300 } // 198 * 0.95 = 188

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  // Calcul du rayon responsive
  const baseRadius = 188 // Réduit de 5% supplémentaires (était 198)
  const responsiveRadius = Math.min(
    baseRadius,
    screenWidth * 0.34, // 0.36 * 0.95 = 0.34 (réduit de 5%)
    screenHeight * 0.26 // 0.27 * 0.95 = 0.26 (réduit de 5%)
  )

  // Calcul du décalage bottom responsive
  const baseBottomOffset = -300
  const responsiveBottomOffset = Math.min(
    baseBottomOffset,
    -(screenHeight * 0.25)
  )

  return { radius: responsiveRadius, bottomOffset: responsiveBottomOffset }
}

// Fonction pour calculer la position optimale de la vidéo bannière
const getVideoBannerPosition = () => {
  if (typeof window === "undefined") return { initialY: "100vh", showY: "30vh" }

  const screenHeight = window.innerHeight
  
  // Calcul du positionnement responsive
  let showY = "30vh"
  
  if (screenHeight < 600) {
    showY = "20vh" // Écrans très petits
  } else if (screenHeight > 900) {
    showY = "40vh" // Grands écrans
  } else {
    // Calcul proportionnel pour les tailles intermédiaires
    const percentage = Math.min(40, Math.max(20, (screenHeight - 600) / 10 + 20))
    showY = `${percentage}vh`
  }
  
  return { initialY: "100vh", showY }
}

// Position fixe des items dans l'arc (l'ordre ne change jamais)
const items = [
  { Icon: IntuitionIcon, label: "Home", to: "/" },
  { Icon: IntuitionSearchIcon, label: "Search", to: "/search" },
  { Icon: IntuitionProfil, label: "Profile", to: "/profile" },
  { Icon: IntuitionFeed, label: "Feed", to: "/feed" },
  { Icon: IntuitionHistory, label: "Recent", to: "/recent-activity" },
  { Icon: IntuitionIconPlus, label: "Create", to: "/page-form" },
  { Icon: IntuitionThemeAvatar, label: "Theme", to: null } // Theme est spécial, pas de navigation
]

const NavArc = () => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [responsiveValues, setResponsiveValues] = useState(
    getResponsiveValues()
  )
  const [videoBannerPosition, setVideoBannerPosition] = useState(
    getVideoBannerPosition()
  )

  useEffect(() => {
    const handleResize = () => {
      setResponsiveValues(getResponsiveValues())
      setVideoBannerPosition(getVideoBannerPosition())
    }
  
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Récupérer l'index de l'item actif basé sur la route
  const getActiveItemIndex = () => {
    return items.findIndex((item) => {
      if (!item.to) return false
      return (
        item.to === location.pathname ||
        (item.to !== "/" && location.pathname.startsWith(item.to))
      )
    })
  }

  // Centraliser l'item actif
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const newIndex = getActiveItemIndex()
    if (newIndex >= 0) {
      setActiveIndex(newIndex)
    }
  }, [location.pathname])

  // Séparation entre l'item central et les items secondaires
  const centralItem = items[activeIndex]

  // Réorganiser les items pour que les items secondaires soient dans le bon ordre dans l'arc
  const getSecondaryItems = () => {
    return items.filter((_, idx) => idx !== activeIndex)
  }

  const onHoverEnter = () => {
    setIsOpen(true)
    // Afficher la vidéo avec la position calculée
    const videoBanner = document.querySelector(".video-banner-container") as HTMLElement
    if (videoBanner) {
      videoBanner.classList.add("show")
      videoBanner.style.setProperty("--video-show-y", videoBannerPosition.showY)
    }
  }

  const onHoverLeave = () => {
    setIsOpen(false)
    // Cacher la vidéo
    const videoBanner = document.querySelector(".video-banner-container")
    if (videoBanner) {
      videoBanner.classList.remove("show")
    }
  }

  const handleClick = (idx: number) => {
    const secondaryItems = getSecondaryItems()
    const clickedItem = secondaryItems[idx]

    // Si c'est le bouton de thème
    if (clickedItem.label === "Theme") {
      setTheme(theme === "dark" ? "light" : "dark")
      return // Ne change pas la navigation ni l'arc
    }

    // Pour les autres boutons, naviguer et mettre à jour l'arc
    if (clickedItem.to) {
      navigate(clickedItem.to)
      // L'effet useEffect s'occupe de mettre à jour activeIndex
    }

    // Fermer l'arc après la sélection
    setIsOpen(false)
  }

  // Types pour la configuration des boutons
  type ButtonConfig = {
    top: string
    radius: number
    angleOffset?: number
  }

  type ButtonPositions = {
    [key in
      | "Home"
      | "Search"
      | "Profile"
      | "Feed"
      | "Recent"
      | "Create"
      | "Theme"]: ButtonConfig
  }

  // Configuration des positions des boutons
  const buttonPositions: ButtonPositions = {
    // "Home" reste inchangé - correctement placé
    Home: { top: "36%", radius: responsiveValues.radius },

    // "Search" et "Theme" doivent revenir vers le bouton central de 15px
    Search: {
      top: "36%",
      radius: responsiveValues.radius - 26, // Rayon réduit de 15px
      angleOffset: -Math.PI // Gauche complet
    },
    Theme: {
      top: "36%",
      radius: responsiveValues.radius - 26, // Rayon réduit de 15px
      angleOffset: 0 // Droite complète
    },

    // "Profile" et "Create" doivent réduire leur rayon de 10px et remonter de 5px
    Profile: {
      top: "31%", // 36% - 5% = 31% (remonté de 5px)
      radius: responsiveValues.radius - 25, // Rayon réduit de 10px
      angleOffset: -Math.PI * 0.8 // Position à gauche
    },
    Create: {
      top: "31%", // 36% - 5% = 31% (remonté de 5px)
      radius: responsiveValues.radius - 25, // Rayon réduit de 10px
      angleOffset: -Math.PI * 0.2 // Position à droite
    },

    // "Feed" et "Recent" doivent augmenter leur rayon de 10px
    Feed: {
      top: "36%",
      radius: responsiveValues.radius + 35, // Rayon augmenté de 10px
      angleOffset: -Math.PI * 0.58 // Position médiane gauche
    },
    Recent: {
      top: "36%",
      radius: responsiveValues.radius + 35, // Rayon augmenté de 10px
      angleOffset: -Math.PI * 0.42 // Position médiane droite
    }
  }

  // Fonction pour calculer la position des boutons
  const getButtonPosition = (idx: number, total: number) => {
    // Position du bouton central (toujours la même quelle que soit l'icône)
    if (idx === -1) {
      return {
        left: "50%",
        top: "36%",
        transform: "translate(-50%, -50%)"
      }
    }
  
    // Pour les positions fixes sur l'arc
    // Nous associons un index de position fixe à chaque bouton
    const fixedPositions = [
      { top: "36%", radius: responsiveValues.radius - 26, angle: -Math.PI }, // Position Search
      { top: "31%", radius: responsiveValues.radius - 25, angle: -Math.PI * 0.8 }, // Position Profile
      { top: "36%", radius: responsiveValues.radius + 35, angle: -Math.PI * 0.58 }, // Position Feed
      { top: "36%", radius: responsiveValues.radius + 35, angle: -Math.PI * 0.42 }, // Position Recent
      { top: "31%", radius: responsiveValues.radius - 25, angle: -Math.PI * 0.2 }, // Position Create
      { top: "36%", radius: responsiveValues.radius - 26, angle: 0 } // Position Theme
    ];
  
    // Trouver l'index de l'item actif parmi les items originaux
    const activeItemOriginalIndex = items.findIndex(item => item.label === centralItem.label);
    
    // On trouve l'index original du bouton secondaire actuel
    const secondaryItems = getSecondaryItems();
    const currentItem = secondaryItems[idx];
    const originalIndex = items.findIndex(item => item.label === currentItem.label);
  
    // Déterminer la position fixe à attribuer à ce bouton
    // Si l'item original est avant l'item actif, on garde la même position
    // Si l'item original est après l'item actif, on décale de -1
    let positionIndex = originalIndex;
    if (originalIndex > activeItemOriginalIndex) {
      positionIndex = originalIndex - 1;
    } else if (originalIndex < activeItemOriginalIndex) {
      positionIndex = originalIndex;
    } else {
      // Cas où l'originalIndex est égal à activeItemOriginalIndex
      // Ce cas ne devrait pas arriver puisque l'item actif est au centre
      positionIndex = activeItemOriginalIndex;
    }
  
    // S'assurer que positionIndex reste dans les limites
    if (positionIndex >= fixedPositions.length) {
      positionIndex = fixedPositions.length - 1;
    }
  
    // Utiliser la position fixe correspondante
    const position = fixedPositions[positionIndex];
    
    // Calculer les coordonnées x et y basées sur l'angle et le rayon
    const x = position.radius * Math.cos(position.angle);
    const y = position.radius * Math.sin(position.angle) * 0.7; // Facteur d'aplatissement
  
    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(${position.top} + ${y}px)`,
      transform: "translate(-50%, -50%)"
    }
  }

  if (typeof window === "undefined") return null

  const secondaryItems = getSecondaryItems()

  return createPortal(
    <>
      <div
        ref={containerRef}
        className={`arc-menu-container ${isOpen ? "is-open" : ""}`}
        style={{ bottom: `${responsiveValues.bottomOffset}px` }}
        onMouseLeave={onHoverLeave}>
        <div className="arc-interaction-zone">
          {/* Bouton central déclenche l'ouverture au hover */}
          <button
            className={`arc-menu-button central-button ${isOpen ? "is-open" : ""}`}
            style={getButtonPosition(-1, 1)}
            onMouseEnter={onHoverEnter}
            title={centralItem.label}>
            <centralItem.Icon size={40} />
          </button>

          {/* Boutons secondaires */}
          {secondaryItems.map((item, idx) => (
            <button
              key={item.label}
              className={`arc-menu-button secondary-button ${isOpen ? "is-open" : ""}`}
              style={getButtonPosition(idx, secondaryItems.length)}
              onClick={() => handleClick(idx)}
              title={item.label}>
              <item.Icon size={40} />
            </button>
          ))}
        </div>
      </div>
      <div className={`arc-overlay ${isOpen ? "is-open" : ""}`}></div>
    </>,
    document.body
  )
}

export default NavArc
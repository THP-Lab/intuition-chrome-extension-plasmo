import { useEffect } from "react"

// Fonction pour charger les sprites SVG
const loadSvgSprites = async () => {
  try {
    // Créer un conteneur caché pour les sprites avec un ID unique
    const containerId = "intuition-svg-sprites"
    let spriteContainer = document.getElementById(containerId)

    // Si le conteneur existe déjà, on le nettoie
    if (spriteContainer) {
      spriteContainer.innerHTML = ""
    } else {
      // Sinon, on crée un nouveau conteneur
      spriteContainer = document.createElement("div")
      spriteContainer.id = containerId
      spriteContainer.style.display = "none"
      document.body.appendChild(spriteContainer)
    }

    // Charger les sprites depuis le build
    const spritePath = chrome.runtime.getURL(
      "node_modules/@0xintuition/1ui/dist/Icon.sprites-2W56CM52.svg"
    )
    console.log("Tentative de chargement du SVG depuis:", spritePath)

    const response = await fetch(spritePath)

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const svgText = await response.text()
    console.log("SVG chargé avec succès")

    // Injecter les sprites dans le conteneur
    spriteContainer.innerHTML = svgText
  } catch (error) {
    console.error("Erreur lors du chargement des sprites SVG:", error)
    // Log plus détaillé de l'erreur
    if (error instanceof Error) {
      console.error("Détails de l'erreur:", {
        message: error.message,
        stack: error.stack
      })
    }
  }
}

// Hook React pour charger les sprites
export const useSvgSprites = () => {
  useEffect(() => {
    loadSvgSprites()

    // Nettoyage lors du démontage du composant
    return () => {
      const container = document.getElementById("intuition-svg-sprites")
      if (container) {
        container.remove()
      }
    }
  }, [])
}

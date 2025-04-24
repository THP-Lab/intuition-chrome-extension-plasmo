import React, { useEffect, useRef, useState } from "react"
import videoDark from "url:~/assets/home-banner-video-dark-compressed.webm"
import videoLight from "url:~/assets/home-banner-video-light-compressed.webm"
import { useTheme } from "../ThemeProvider"

// Configuration pour affiner le rendu
const config = {
  // Seuil de luminosité pour commencer à rendre transparent (0-255)
  darkThreshold: 30,
  // Seuil de luminosité pour les tons gris moyens (0-255)
  grayThreshold: 160,
  // Plage de tolérance autour du seuil gris (±)
  grayTolerance: 20,
  // Force de l'adoucissement des bords
  smoothingFactor: 0.8
}

const VideoBanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  
  // Fonction pour calculer la luminosité d'un pixel RGB
  const getLuminance = (r: number, g: number, b: number): number => {
    // Formule standard de luminance perçue
    return 0.299 * r + 0.587 * g + 0.114 * b
  }
  
  // Fonction pour vérifier si une couleur est dans la gamme de gris
  const isGrayish = (r: number, g: number, b: number): boolean => {
    // Vérifier si les composantes RGB sont proches l'une de l'autre (= gris)
    const avg = (r + g + b) / 3
    const deviation = Math.max(
      Math.abs(r - avg),
      Math.abs(g - avg),
      Math.abs(b - avg)
    )
    // Plus la déviation est faible, plus la couleur est grise
    return deviation < 15
  }
  
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas) return
    
    const ctx = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: true // Optimisation pour les lectures fréquentes de pixels
    })
    
    if (!ctx) return
    
    const setCanvasSize = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      setIsVideoLoaded(true)
    }
    
    video.addEventListener('loadedmetadata', setCanvasSize)
    
    // Création des tampons pour le rendu
    let offscreenCanvas: HTMLCanvasElement | null = null
    let offscreenCtx: CanvasRenderingContext2D | null = null
    
    const setupOffscreenCanvas = () => {
      offscreenCanvas = document.createElement('canvas')
      offscreenCanvas.width = canvas.width
      offscreenCanvas.height = canvas.height
      offscreenCtx = offscreenCanvas.getContext('2d', { alpha: true })
    }
    
    const render = () => {
      if (video.paused || video.ended || !offscreenCtx) return
      
      // Dessine d'abord sur le canvas hors écran
      offscreenCtx.clearRect(0, 0, canvas.width, canvas.height)
      offscreenCtx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Récupère les données de pixels
      const imgData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data
      
      // Parcours tous les pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // Calcule la luminance (luminosité perçue)
        const lum = getLuminance(r, g, b)
        const isGray = isGrayish(r, g, b)
        
        // Gestion de la transparence avec transitions douces
        if (lum < config.darkThreshold) {
          // Très sombre -> transparent
          data[i + 3] = 0
        } else if (lum > config.grayThreshold - config.grayTolerance && 
                   lum < config.grayThreshold + config.grayTolerance && isGray) {
          // Gris moyen -> transparent
          data[i + 3] = 0
        } else if (lum < config.darkThreshold + 30) {
          // Zone de transition pour les tons sombres
          const alpha = Math.min(255, Math.round((lum - config.darkThreshold) * (255 / 30) * config.smoothingFactor))
          data[i + 3] = alpha
        } else if (isGray && lum < config.grayThreshold + config.grayTolerance + 30) {
          // Zone de transition pour les tons gris
          const distanceFromGray = Math.min(
            Math.abs(lum - (config.grayThreshold - config.grayTolerance)),
            Math.abs(lum - (config.grayThreshold + config.grayTolerance))
          )
          const alpha = Math.min(255, Math.round(distanceFromGray * (255 / 30) * config.smoothingFactor))
          data[i + 3] = alpha
        }
      }
      
      // Réapplique les données modifiées sur le canvas final
      offscreenCtx.putImageData(imgData, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (offscreenCanvas) {
        ctx.drawImage(offscreenCanvas, 0, 0)
      }
      
      // Continue l'animation
      requestAnimationFrame(render)
    }
    
    const startRendering = () => {
      if (isVideoLoaded) {
        setupOffscreenCanvas()
        render()
      }
    }
    
    video.addEventListener('play', startRendering)
    
    // Démarrer la vidéo
    video.play().catch(err => console.error("Erreur de lecture vidéo:", err))
    
    return () => {
      video.removeEventListener('loadedmetadata', setCanvasSize)
      video.removeEventListener('play', startRendering)
      video.pause()
      offscreenCanvas = null
      offscreenCtx = null
    }
  }, [theme, isVideoLoaded])
  
  return (
    <div className="video-banner-container navc-arc-trigger">
      <video 
        ref={videoRef}
        src={theme === "dark" ? videoDark : videoLight}
        autoPlay
        loop
        muted
        playsInline
        style={{ display: 'none' }}
      />
      <canvas 
        ref={canvasRef}
        className="video-banner"
      />
    </div>
  )
}

export default VideoBanner
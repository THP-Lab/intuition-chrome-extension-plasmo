import React, { useEffect, useRef, useState } from "react"
import videoDark from "url:~/assets/home-banner-video-dark-compressed.webm"
import videoLight from "url:~/assets/home-banner-video-light-compressed.webm"
import { useTheme } from "../ThemeProvider"

// config for video banner
const config = {
  darkThreshold: 30,
  grayThreshold: 160,
  grayTolerance: 20,
  smoothingFactor: 0.8
}

const VideoBanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  
  // Function to calculate the luminance of a pixel RGB
  const getLuminance = (r: number, g: number, b: number): number => {
    // Standard luminance formula
    return 0.299 * r + 0.587 * g + 0.114 * b
  }
  
  // Function to check if a color is in the gray range
  const isGrayish = (r: number, g: number, b: number): boolean => {
    // Check if the RGB components are close to each other (= gray)
    const avg = (r + g + b) / 3
    const deviation = Math.max(
      Math.abs(r - avg),
      Math.abs(g - avg),
      Math.abs(b - avg)
    )
    // The smaller the deviation, the more the color is gray
    return deviation < 15
  }
  
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas) return
    
    const ctx = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: true // Optimization for frequent pixel reads
    })
    
    if (!ctx) return
    
    const setCanvasSize = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      setIsVideoLoaded(true)
    }
    
    video.addEventListener('loadedmetadata', setCanvasSize)
    
    // Creation of buffers for rendering
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
      
      // Draw first on the offscreen canvas
      offscreenCtx.clearRect(0, 0, canvas.width, canvas.height)
      offscreenCtx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Get the pixel data
      const imgData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imgData.data
      
      // Loop through all pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // Calculate the luminance (perceived brightness)
        const lum = getLuminance(r, g, b)
        const isGray = isGrayish(r, g, b)
        
        // Transparency management with smooth transitions
        if (lum < config.darkThreshold) {
          // Very dark -> transparent
          data[i + 3] = 0
        } else if (lum > config.grayThreshold - config.grayTolerance && 
                   lum < config.grayThreshold + config.grayTolerance && isGray) {
          // Medium gray -> transparent
          data[i + 3] = 0
        } else if (lum < config.darkThreshold + 30) {
          // Transition zone for dark tones
          const alpha = Math.min(255, Math.round((lum - config.darkThreshold) * (255 / 30) * config.smoothingFactor))
          data[i + 3] = alpha
        } else if (isGray && lum < config.grayThreshold + config.grayTolerance + 30) {
          // Transition zone for gray tones
          const distanceFromGray = Math.min(
            Math.abs(lum - (config.grayThreshold - config.grayTolerance)),
            Math.abs(lum - (config.grayThreshold + config.grayTolerance))
          )
          const alpha = Math.min(255, Math.round(distanceFromGray * (255 / 30) * config.smoothingFactor))
          data[i + 3] = alpha
        }
      }
      
      // Apply the modified data back to the final canvas
      offscreenCtx.putImageData(imgData, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (offscreenCanvas) {
        ctx.drawImage(offscreenCanvas, 0, 0)
      }
      
      // Continue the animation
      requestAnimationFrame(render)
    }
    
    const startRendering = () => {
      if (isVideoLoaded) {
        setupOffscreenCanvas()
        render()
      }
    }
    
    video.addEventListener('play', startRendering)
    
    // Start the video
    video.play().catch(err => console.error("Video playback error:", err))
    
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
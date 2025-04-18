import React, { useEffect, useRef } from "react"

import "~src/styles/particles-canvas.css"

import { useTheme } from "~src/components/ThemeProvider"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  baseX: number
  baseY: number
  range: number
  opacity: number
  fadeDirection: number
  fadeSpeed: number
}

const ParticlesCanvas: React.FC = () => {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef<number>()

  const ATTRACTION = {
    FORCE: 0.0005, // Force d'attraction générale
    DISTANCE: 150, // Distance d'attraction
  }

  // Configuration
  const particleCount = 120
  const minParticles = 90
  const fadeSpeed = 0.005
  const connectionDistance = 80
  const maxConnectionsPerParticle = 60
  const mouseAreaConnectionLimit = 60

  // Couleurs adaptées au thème
  const lightThemeColor = "rgba(0, 0, 0, 0.3)"
  const darkThemeColor = "rgba(255, 255, 255, 0.5)"
  const backgroundColor = "transparent"

  // Fonction de création d'une particule
  const createParticle = (canvas: HTMLCanvasElement, fadeIn = true) => {
    const baseX = Math.random() * canvas.width
    const baseY = Math.random() * canvas.height
    const range = Math.random() * 50 + 30

    return {
      x: baseX,
      y: baseY,
      baseX: baseX,
      baseY: baseY,
      range: range,
      size: Math.random() * 2 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      color: theme === "dark" ? darkThemeColor : lightThemeColor,
      opacity: fadeIn ? 0 : 1,
      fadeDirection: fadeIn ? 1 : -1,
      fadeSpeed: fadeSpeed * (Math.random() * 0.5 + 0.75),
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustement de la taille du canvas
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Initialisation des particules
    const initParticles = () => {
      particles.current = []
      for (let i = 0; i < particleCount; i++) {
        particles.current.push(createParticle(canvas, false))
      }
    }

    // Gestion du mouvement de la souris
    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouse.current.x
      const prevY = mouse.current.y

      mouse.current.x = e.x
      mouse.current.y = e.y

      // Effet de parallaxe léger
      particles.current.forEach((p) => {
        p.x += (mouse.current.x - prevX) * 0.005
        p.y += (mouse.current.y - prevY) * 0.005
      })
    }

    // Animation of the canvas
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Gérer le cycle de vie des particules
      particles.current = particles.current.filter((particle) => {
        // Mettre à jour l'opacité
        particle.opacity += particle.fadeSpeed * particle.fadeDirection

        // Si la particule disparaît complètement
        if (particle.opacity <= 0) {
          // Si on a assez de particules, on la supprime
          if (particles.current.length > minParticles) {
            return false
          }
          // Sinon on la fait réapparaître ailleurs
          const newParticle = createParticle(canvas, true)
          Object.assign(particle, newParticle)
          return true
        }

        // Si la particule est complètement apparue
        if (particle.opacity >= 1) {
          particle.opacity = 1
          // Chance aléatoire de commencer à disparaître
          if (Math.random() < 0.001) {
            particle.fadeDirection = -1
          }
        }

        return true
      })

      // Ajouter occasionnellement de nouvelles particules
      if (
        Math.random() < 0.05 &&
        particles.current.length < particleCount + 20
      ) {
        particles.current.push(createParticle(canvas, true))
      }

      // Mettre à jour et dessiner chaque particule
      particles.current.forEach((particle, i) => {
        // Force d'attraction vers le point d'ancrage
        const dxBase = particle.baseX - particle.x
        const dyBase = particle.baseY - particle.y
        const distanceBase = Math.sqrt(dxBase * dxBase + dyBase * dyBase)

        particles.current.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = otherParticle.x - particle.x
            const dy = otherParticle.y - particle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < ATTRACTION.DISTANCE) {
              const force =
                ATTRACTION.FORCE * (1 - distance / ATTRACTION.DISTANCE)
              const angle = Math.atan2(dy, dx)

              // Force d'attraction de base
              particle.speedX += Math.cos(angle) * force
              particle.speedY += Math.sin(angle) * force
            }
          }
        })

        if (distanceBase > particle.range) {
          const angle = Math.atan2(dyBase, dxBase)
          const forceBase = (distanceBase - particle.range) * 0.05
          particle.speedX += Math.cos(angle) * forceBase
          particle.speedY += Math.sin(angle) * forceBase
        }

        // Attraction vers la souris
        const dxMouse = mouse.current.x - particle.x
        const dyMouse = mouse.current.y - particle.y
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

        if (distanceMouse < 150) {
          const angle = Math.atan2(dyMouse, dxMouse)
          particle.speedX += Math.cos(angle) * 0.1
          particle.speedY += Math.sin(angle) * 0.1
        }

        // Mise à jour de la position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Friction pour un mouvement plus doux
        particle.speedX *= 0.95
        particle.speedY *= 0.95

        // Limite de vitesse
        const maxSpeed = 2
        if (Math.abs(particle.speedX) > maxSpeed) {
          particle.speedX = Math.sign(particle.speedX) * maxSpeed
        }
        if (Math.abs(particle.speedY) > maxSpeed) {
          particle.speedY = Math.sign(particle.speedY) * maxSpeed
        }

        // Dessiner la particule avec son opacité
        const finalColor =
          theme === "dark"
            ? `rgba(255, 255, 255, ${0.5 * particle.opacity})`
            : `rgba(0, 0, 0, ${0.3 * particle.opacity})`

        ctx.fillStyle = finalColor
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Connexions entre particules
        let connectionCount = 0
        for (let j = i + 1; j < particles.current.length; j++) {
          if (connectionCount >= maxConnectionsPerParticle) break

          const p2 = particles.current[j]
          const dx = particle.x - p2.x
          const dy = particle.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const lineOpacity =
              (1 - distance / connectionDistance) *
              particle.opacity *
              p2.opacity

            const lineColor =
              theme === "dark"
                ? `rgba(255, 255, 255, ${lineOpacity * 0.3})`
                : `rgba(0, 0, 0, ${lineOpacity * 0.15})`

            ctx.beginPath()
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 1
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()

            connectionCount++
          }
        }
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    // Configure the events
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    // Initialize and start the animation
    handleResize()
    animate()

    // Cleaning
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [theme])

  return (
    <div className="particles-container">
      <canvas ref={canvasRef} className="particles-canvas" />
    </div>
  )
}

export default ParticlesCanvas

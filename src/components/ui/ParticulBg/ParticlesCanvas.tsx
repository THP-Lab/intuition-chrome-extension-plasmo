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
  
  // references for the dynamic particle count and min particles
  const dynamicParticleCount = useRef<number>(120)
  const dynamicMinParticles = useRef<number>(90)

  const ATTRACTION = {
    FORCE: 0.0005, // force of attraction
    DISTANCE: 150, // distance of attraction
  }

  // other configurations remain unchanged
  const fadeSpeed = 0.005
  const connectionDistance = 80
  const maxConnectionsPerParticle = 60
  const mouseAreaConnectionLimit = 60

  // adapted colors to the theme
  const lightThemeColor = "rgba(0, 0, 0, 0.3)"
  const darkThemeColor = "rgba(255, 255, 255, 0.5)"
  const backgroundColor = "transparent"

  // function to calculate the number of particles based on the width
  const calculateParticleCount = (width: number) => {
    // reference widths
    const MIN_WIDTH = 400 // -30% of particles
    const BASE_WIDTH = 550 // base number of particles
    const MAX_WIDTH = 669 // +35% of particles
    
    const BASE_VALUE = 120 // original value
    
    // calculation based on the width
    if (width <= MIN_WIDTH) {
      return Math.round(BASE_VALUE * 0.6) // -30%
    } else if (width >= MAX_WIDTH) {
      return Math.round(BASE_VALUE * 1.45) // +35%
    } else {
      // proportional calculation between MIN_WIDTH and MAX_WIDTH
      const ratio = (width - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH)
      const factor = 0.6 + (ratio * 0.85) // between 0.7 and 1.35
      return Math.round(BASE_VALUE * factor)
    }
  }
  
  // update the number of particles based on the width
  const updateParticleCount = () => {
    const width = window.innerWidth
    const newParticleCount = calculateParticleCount(width)
    dynamicParticleCount.current = newParticleCount
  dynamicMinParticles.current = Math.round(newParticleCount * 0.75)
  }

  // function to create a particle
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

    // update the counters based on the size
    const updateParticleCounts = () => {
      const width = window.innerWidth
      const newCount = calculateParticleCount(width)
      dynamicParticleCount.current = newCount
      dynamicMinParticles.current = Math.round(newCount * 0.75)
    }

    // Adjustment of the size of the canvas
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      updateParticleCount() // update before initializing the particles
      initParticles()
    }

    // Initialization of the particles
    const initParticles = () => {
      particles.current = []
      for (let i = 0; i < dynamicParticleCount.current; i++) {
        particles.current.push(createParticle(canvas, false))
      }
    }

    // Mouse movement management
    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouse.current.x
      const prevY = mouse.current.y

      mouse.current.x = e.x
      mouse.current.y = e.y

      // Light parallax effect
      particles.current.forEach((p) => {
        p.x += (mouse.current.x - prevX) * 0.005
        p.y += (mouse.current.y - prevY) * 0.005
      })
    }

    // Animation of the canvas
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Manage the life cycle of the particles
      particles.current = particles.current.filter((particle) => {
        // Update the opacity
        particle.opacity += particle.fadeSpeed * particle.fadeDirection

        // If the particle disappears completely
        if (particle.opacity <= 0) {
          // If there are enough particles, delete it
          if (particles.current.length > dynamicMinParticles.current) {
            return false
          }
          // Otherwise, make it reappear somewhere else
          const newParticle = createParticle(canvas, true)
          Object.assign(particle, newParticle)
          return true
        }

        // If the particle is completely reappeared
        if (particle.opacity >= 1) {
          particle.opacity = 1
          // Random chance to start disappearing
          if (Math.random() < 0.001) {
            particle.fadeDirection = -1
          }
        }

        return true
      })

      // Add occasional new particles
      if (
        Math.random() < 0.05 &&
        particles.current.length < dynamicParticleCount.current + 20
      ) {
        particles.current.push(createParticle(canvas, true))
      }

      // Update and draw each particle
      particles.current.forEach((particle, i) => {
        // Attraction force towards the anchor point
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

              // Base attraction force
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

        // Attraction towards the mouse
        const dxMouse = mouse.current.x - particle.x
        const dyMouse = mouse.current.y - particle.y
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

        if (distanceMouse < 150) {
          const angle = Math.atan2(dyMouse, dxMouse)
          particle.speedX += Math.cos(angle) * 0.1
          particle.speedY += Math.sin(angle) * 0.1
        }

        // Update the position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Friction for a smoother movement
        particle.speedX *= 0.95
        particle.speedY *= 0.95

        // Speed limit
        const maxSpeed = 2
        if (Math.abs(particle.speedX) > maxSpeed) {
          particle.speedX = Math.sign(particle.speedX) * maxSpeed
        }
        if (Math.abs(particle.speedY) > maxSpeed) {
          particle.speedY = Math.sign(particle.speedY) * maxSpeed
        }

        // Draw the particle with its opacity
        const finalColor =
          theme === "dark"
            ? `rgba(255, 255, 255, ${0.5 * particle.opacity})`
            : `rgba(0, 0, 0, ${0.3 * particle.opacity})`

        ctx.fillStyle = finalColor
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Connections between particles
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

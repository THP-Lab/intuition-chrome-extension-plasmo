import React, { useEffect, useRef } from "react"
import "~src/styles/particles-canvas.css"
import { useTheme } from "~src/components/ThemeProvider"

interface GroupParticle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  groupId: number
}

const GROUP_SIZES = {
  SMALL: { base: 4, variation: 3 },
  MEDIUM: { base: 6, variation: 3 },
  LARGE: { base: 8, variation: 3 }
}

const GroupParticlesCanvas: React.FC = () => {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<GroupParticle[]>([])
  const animationFrameId = useRef<number>()
  const mouse = useRef({ x: 0, y: 0 })
  // Configuration
  const connectionDistance = 150
  const lightThemeColor = "rgba(0, 0, 0, 0.3)"
  const darkThemeColor = "rgba(255, 255, 255, 0.5)"
  const activeGroupsRef = useRef<number>(0)
  const maxGroups = 4
  const minGroups = 2

  const MOUSE_INFLUENCE = {
    MIN_DISTANCE: 50, // Distance minimum to avoid that the particles touch the mouse
    MAX_DISTANCE: 200, // Maximum distance of influence of the mouse
    ORBITAL_FORCE: 0.000000004, // Force of the orbit (smaller = orbit smoother)
    REPULSION_FORCE: 0.00000008 // Repulsion force if too close
  }

  const createGroup = (canvas: HTMLCanvasElement) => {
    const groupId = Math.random()
    const startX = Math.random() > 0.5 ? -50 : canvas.width + 50
    const startY = Math.random() * canvas.height
    const endX = startX < 0 ? canvas.width + 50 : -50
    const endY = Math.random() * canvas.height

    // Do not create a group if you have reached the maximum
    if (activeGroupsRef.current >= maxGroups) return

    // Determine the size of the group
    const groupType = Math.random()
    let size
    if (groupType < 0.5) size = GROUP_SIZES.SMALL
    else if (groupType < 0.8) size = GROUP_SIZES.MEDIUM
    else size = GROUP_SIZES.LARGE

    const groupSize = Math.floor(size.base + (Math.random() * 2 - 1) * size.variation)
    const dispersion = size.base * 20

    // Create the particles of the group
    for (let i = 0; i < groupSize; i++) {
      const particle: GroupParticle = {
        x: startX + Math.random() * dispersion - dispersion/2,
        y: startY + Math.random() * dispersion - dispersion/2,
        size: Math.random() * 2 + 2,
        speedX: (endX - startX) * 0.00005,
        speedY: (endY - startY) * 0.00005,
        color: theme === "dark" ? darkThemeColor : lightThemeColor,
        opacity: 1,
        groupId: groupId
      }
      particles.current.push(particle)
      activeGroupsRef.current++
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Add mouse management
    const handleMouseMove = (e: MouseEvent) => {
        mouse.current.x = e.x
        mouse.current.y = e.y
      }

    // Animation of the canvas
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw each particle
      particles.current.forEach((particle, i) => {
        // Update the position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Attraction towards the mouse
        const dxMouse = mouse.current.x - particle.x
        const dyMouse = mouse.current.y - particle.y
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        
        if (distanceMouse < MOUSE_INFLUENCE.MAX_DISTANCE) {
          const angle = Math.atan2(dyMouse, dxMouse)
          
          if (distanceMouse < MOUSE_INFLUENCE.MIN_DISTANCE) {
            // Repulsion if too close
            particle.speedX -= Math.cos(angle) * MOUSE_INFLUENCE.REPULSION_FORCE
            particle.speedY -= Math.sin(angle) * MOUSE_INFLUENCE.REPULSION_FORCE
          } else {
            // Orbital force perpendicular to the direction of the mouse
            particle.speedX += Math.cos(angle + Math.PI/2) * MOUSE_INFLUENCE.ORBITAL_FORCE
            particle.speedY += Math.sin(angle + Math.PI/2) * MOUSE_INFLUENCE.ORBITAL_FORCE
            
            // Slight attraction to maintain in the influence zone
            const attractionForce = 0.01 * (distanceMouse - MOUSE_INFLUENCE.MIN_DISTANCE) / 
              (MOUSE_INFLUENCE.MAX_DISTANCE - MOUSE_INFLUENCE.MIN_DISTANCE)
            particle.speedX += Math.cos(angle) * attractionForce
            particle.speedY += Math.sin(angle) * attractionForce
          }
          
          // Add a chance to "escape" the influence
          if (Math.random() < 0.02) {
            particle.speedX += (Math.random() - 0.5) * 0.5
            particle.speedY += (Math.random() - 0.5) * 0.5
          }
        }
        
        // Limit the maximum speed
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY)
        if (speed > 2) {
          particle.speedX = (particle.speedX / speed) * 0.0000000005
          particle.speedY = (particle.speedY / speed) * 0.0000000005
        }

        // Draw the particle
        const finalColor = theme === "dark" 
          ? `rgba(255, 255, 255, ${0.5 * particle.opacity})`
          : `rgba(0, 0, 0, ${0.3 * particle.opacity})`
        
        ctx.fillStyle = finalColor
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Connections between particles of the same group
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j]
          if (particle.groupId === p2.groupId) {
            const dx = particle.x - p2.x
            const dy = particle.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < connectionDistance) {
              const lineOpacity = (1 - distance / connectionDistance) * 
                particle.opacity * 
                p2.opacity * 0.8

              const lineColor = theme === "dark" 
                ? `rgba(255, 255, 255, ${lineOpacity * 0.3})` 
                : `rgba(0, 0, 0, ${lineOpacity * 0.15})`
              
              ctx.beginPath()
              ctx.strokeStyle = lineColor
              ctx.lineWidth = 1
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }
        }
      })


      // Delete groups that are outside the screen
      const previousLength = particles.current.length
      particles.current = particles.current.filter(p => 
        !(p.x < -100 || p.x > canvas.width + 100 || 
          p.y < -100 || p.y > canvas.height + 100)
      )
      
      // If particles have been deleted, update the group counter
      if (particles.current.length < previousLength) {
        const remainingGroupIds = new Set(particles.current.map(p => p.groupId))
        activeGroupsRef.current = remainingGroupIds.size
      }

      // Create a new group occasionally if you have not reached the minimum
      if (activeGroupsRef.current < minGroups || 
         (activeGroupsRef.current < maxGroups && Math.random() < 0.002)) {
        createGroup(canvas)
      }

      window.addEventListener("mousemove", handleMouseMove)

      // Delete groups that are outside the screen
      particles.current = particles.current.filter(p => 
        !(p.x < -100 || p.x > canvas.width + 100 || 
          p.y < -100 || p.y > canvas.height + 100)
      )

      // Create a new group occasionally
      if (Math.random() < 0.0005) {
        createGroup(canvas)
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", handleResize)
    handleResize()
    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
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

export default GroupParticlesCanvas
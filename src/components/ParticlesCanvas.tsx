import React, { useEffect, useRef } from "react"
import "../styles/particles-canvas.css"
import { useTheme } from "./ThemeProvider"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

const ParticlesCanvas: React.FC = () => {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef<number>()
  
  // Configuration - reduced number of particles
  const particleCount = 70 // Réduit de 100 à 50
  const connectionDistance = 100
  // adapted colors to the theme
  const lightThemeColor = "rgba(0, 0, 0, 0.3)" // Couleur plus subtile pour thème clair
  const darkThemeColor = "rgba(255, 255, 255, 0.5)" // Couleur plus visible pour thème sombre
  const backgroundColor = "transparent"
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    // Adjust the size of the canvas to the window
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }
    
    // Initialize the particles
    const initParticles = () => {
      particles.current = []
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1, // Slightly reduced size
          speedX: Math.random() * 0.5 - 0.25, // Reduced speed
          speedY: Math.random() * 0.5 - 0.25, // Reduced speed
          color: theme === "dark" ? darkThemeColor : lightThemeColor
        })
      }
    }
    
    // Follow the mouse position with parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouse.current.x
      const prevY = mouse.current.y
      
      mouse.current.x = e.x
      mouse.current.y = e.y
      
      // Parallax effect - move the particles slightly
      particles.current.forEach(p => {
        p.x += (mouse.current.x - prevX) * 0.05; // Make the effect more visible
        p.y += (mouse.current.y - prevY) * 0.05;
      });
    }
    
    
    // Animation of the canvas
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height) // More efficient than fillRect with transparent
      
      // Draw and update each particle
      particles.current.forEach((particle, i) => {
        // Update the position
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Bounce on the edges
        if (particle.x > canvas.width) particle.x = 0
        else if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        else if (particle.y < 0) particle.y = canvas.height
        
        // Draw the particle
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Connect the nearby particles
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j]
          const dx = particle.x - p2.x
          const dy = particle.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < connectionDistance) {
            // Transparency of the lines adapted to the theme
            const lineColor = theme === "dark" 
              ? `rgba(255, 255, 255, ${(1 - distance / connectionDistance) * 0.3})` 
              : `rgba(0, 0, 0, ${(1 - distance / connectionDistance) * 0.15})`
            
            ctx.beginPath()
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 1
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
        
        // Repulsion effect when hovering
        const dx = mouse.current.x - particle.x
        const dy = mouse.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 100) {
          const angle = Math.atan2(dy, dx)
          particle.speedX += Math.cos(angle) * 0.1
          particle.speedY += Math.sin(angle) * 0.1
        }

        const maxSpeed = 2;
        if (Math.abs(particle.speedX) > maxSpeed) {
          particle.speedX = Math.sign(particle.speedX) * maxSpeed;
        }
        if (Math.abs(particle.speedY) > maxSpeed) {
          particle.speedY = Math.sign(particle.speedY) * maxSpeed;
        }

        // Add a small resistance to avoid continuous acceleration
        particle.speedX *= 0.98;
        particle.speedY *= 0.98;
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
  }, [theme]) // Add theme as a dependency so that the effect is reinitialized when the theme changes

  return (
    <div className="particles-container">
      <canvas ref={canvasRef} className="particles-canvas"></canvas>
    </div>
  )
}

export default ParticlesCanvas
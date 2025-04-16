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
  
  // Configuration - réduit le nombre de particules
  const particleCount = 70 // Réduit de 100 à 50
  const connectionDistance = 200
  // Adapte les couleurs au thème
  const lightThemeColor = "rgba(0, 0, 0, 0.3)" // Couleur plus subtile pour thème clair
  const darkThemeColor = "rgba(255, 255, 255, 0.5)" // Couleur plus visible pour thème sombre
  const backgroundColor = "transparent"
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    // Ajuster la taille du canvas à la fenêtre
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }
    
    // Initialiser les particules
    const initParticles = () => {
      particles.current = []
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1, // Taille légèrement réduite
          speedX: Math.random() * 0.5 - 0.25, // Vitesse réduite
          speedY: Math.random() * 0.5 - 0.25, // Vitesse réduite
          color: theme === "dark" ? darkThemeColor : lightThemeColor
        })
      }
    }
    
    // Suivre la position de la souris avec effet parallax
    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouse.current.x
      const prevY = mouse.current.y
      
      mouse.current.x = e.x
      mouse.current.y = e.y
      
      // Effet parallax - déplacer légèrement toutes les particules
      particles.current.forEach(p => {
        p.x += (mouse.current.x - prevX) * 0.05; // Rend l'effet plus visible
        p.y += (mouse.current.y - prevY) * 0.05;
      });
    }
    
    // Ajouter 4 particules au clic
    const handleClick = () => {
      for (let i = 0; i < 4; i++) {
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: theme === "dark" ? darkThemeColor : lightThemeColor
        })
      }
    }
    
    // Animation du canvas
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height) // Plus efficace que fillRect avec transparent
      
      // Dessiner et mettre à jour chaque particule
      particles.current.forEach((particle, i) => {
        // Mettre à jour la position
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Rebondir sur les bords
        if (particle.x > canvas.width) particle.x = 0
        else if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        else if (particle.y < 0) particle.y = canvas.height
        
        // Dessiner la particule
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Connecter les particules proches
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j]
          const dx = particle.x - p2.x
          const dy = particle.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < connectionDistance) {
            // Transparence des lignes adaptée au thème
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
        
        // Effet de répulsion au survol
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

        // Ajoute une petite résistance pour éviter l'accélération continue
        particle.speedX *= 0.98;
        particle.speedY *= 0.98;
      })
      
      animationFrameId.current = requestAnimationFrame(animate)
    }
    
    // Configurer les événements
    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleClick)
    
    // Initialiser et démarrer l'animation
    handleResize()
    animate()
    
    // Nettoyage
    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [theme]) // Ajouter theme comme dépendance pour que l'effet se réinitialise quand le thème change

  return (
    <div className="particles-container">
      <canvas ref={canvasRef} className="particles-canvas"></canvas>
    </div>
  )
}

export default ParticlesCanvas
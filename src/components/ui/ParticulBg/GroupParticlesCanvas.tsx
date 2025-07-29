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
  
  // Distance max pour tracer les connexions
  const connectionDistance = 150

  // Couleurs très sobres
  const lightThemeColor = "rgba(0, 0, 0, 0.1)"
  const darkThemeColor  = "rgba(255, 255, 255, 0.1)"

  // Gestion du nombre de groupes
  const activeGroupsRef = useRef(0)
  const maxGroupsRef = useRef(4)
  const minGroupsRef = useRef(2)
  const groupProbabilitiesRef = useRef({
    SMALL: 0.5,
    MEDIUM: 0.3,
    LARGE: 0.2
  })

  const updateGroupsConfiguration = (width: number) => {
    const SMALL_WIDTH = 400
    const LARGE_WIDTH = 669
    if (width <= SMALL_WIDTH) {
      maxGroupsRef.current = 3
      minGroupsRef.current = 1
      groupProbabilitiesRef.current = { SMALL: 0.7, MEDIUM: 0.25, LARGE: 0.05 }
    } else if (width >= LARGE_WIDTH) {
      maxGroupsRef.current = 6
      minGroupsRef.current = 3
      groupProbabilitiesRef.current = { SMALL: 0.3, MEDIUM: 0.3, LARGE: 0.4 }
    } else {
      maxGroupsRef.current = 4
      minGroupsRef.current = 2
      groupProbabilitiesRef.current = { SMALL: 0.5, MEDIUM: 0.3, LARGE: 0.2 }
    }
  }

  const createGroup = (canvas: HTMLCanvasElement) => {
    if (activeGroupsRef.current >= maxGroupsRef.current) return
    const groupId = Math.random()
    const startX = Math.random() > 0.5 ? -50 : canvas.width + 50
    const startY = Math.random() * canvas.height
    const endX   = startX < 0 ? canvas.width + 50 : -50
    const endY   = Math.random() * canvas.height

    // Choix de la taille du groupe
    const r = Math.random()
    let sizeConfig, dispersion
    const probs = groupProbabilitiesRef.current
    if (r < probs.SMALL) {
      sizeConfig = GROUP_SIZES.SMALL
    } else if (r < probs.SMALL + probs.MEDIUM) {
      sizeConfig = GROUP_SIZES.MEDIUM
    } else {
      sizeConfig = GROUP_SIZES.LARGE
    }
    const groupSize = Math.floor(
      sizeConfig.base + (Math.random() * 2 - 1) * sizeConfig.variation
    )
    dispersion = sizeConfig.base * 20

    for (let i = 0; i < groupSize; i++) {
      const particle: GroupParticle = {
        x: startX + Math.random() * dispersion - dispersion / 2,
        y: startY + Math.random() * dispersion - dispersion / 2,
        size: Math.random() * 2 + 2,
        speedX: (endX - startX) * 0.00005,
        speedY: (endY - startY) * 0.00005,
        color: theme === "dark" ? darkThemeColor : lightThemeColor,
        opacity: 1,
        groupId
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
      updateGroupsConfiguration(canvas.width)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Mise à jour et dessin des particules
      particles.current.forEach((p, i) => {
        p.x += p.speedX
        p.y += p.speedY

        // Dessin
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Connexions dans le même groupe
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j]
          if (p.groupId === p2.groupId) {
            const dx = p.x - p2.x
            const dy = p.y - p2.y
            const dist = Math.hypot(dx, dy)
            if (dist < connectionDistance) {
              const alpha = (1 - dist / connectionDistance) * 0.05
              ctx.strokeStyle = theme === "dark"
                ? `rgba(255,255,255,${alpha})`
                : `rgba(0,0,0,${alpha})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }
        }
      })

      // Nettoyage des particules hors écran
      const before = particles.current.length
      particles.current = particles.current.filter(
        (p) =>
          p.x >= -100 && p.x <= canvas.width + 100 &&
          p.y >= -100 && p.y <= canvas.height + 100
      )
      if (particles.current.length < before) {
        activeGroupsRef.current = new Set(
          particles.current.map((p) => p.groupId)
        ).size
      }

      // Création éventuelle d’un nouveau groupe
      if (
        activeGroupsRef.current < minGroupsRef.current ||
        (activeGroupsRef.current < maxGroupsRef.current && Math.random() < 0.002)
      ) {
        createGroup(canvas)
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", handleResize)
    handleResize()
    animate()

    return () => {
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

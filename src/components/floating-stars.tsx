'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  brightness: number
  flickerSpeed: number
  glowIntensity: number
  animationDuration: number
  moveX: number[]
  moveY: number[]
}

interface FloatingStarsProps {
  className?: string
  count?: number
  mobileCount?: number
}

const generateStars = (count: number = 30): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 0.8 + 0.3,
    brightness: Math.random() * 0.7 + 0.3,
    flickerSpeed: Math.random() * 4 + 3,
    glowIntensity: Math.random() * 2 + 1,
    animationDuration: Math.random() * 20 + 25,
    moveX: [0, Math.random() * 40 - 20, Math.random() * 30 - 15, Math.random() * 35 - 17.5, 0],
    moveY: [0, Math.random() * 50 - 25, Math.random() * 40 - 20, Math.random() * 45 - 22.5, 0],
  }))
}

export default function FloatingStars({
  className = 'absolute inset-0 overflow-hidden pointer-events-none',
  count = 30,
  mobileCount = 12,
}: FloatingStarsProps) {
  const [stars, setStars] = useState<Star[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const isMobileViewport = window.matchMedia('(max-width: 767px)').matches

    setIsMobile(isMobileViewport)
    setIsMounted(true)
    setStars(generateStars(isMobileViewport ? mobileCount : count))
  }, [count, mobileCount])

  if (!isMounted) return null

  return (
    <div className={className}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute will-change-transform"
          style={{ left: `${star.x}%`, top: `${star.y}%`, transform: 'translate3d(0,0,0)' }}
          initial={isMobile ? false : { opacity: 0 }}
          animate={isMobile ? { opacity: star.brightness } : {
            opacity: 1,
            x: [0, star.moveX[1], star.moveX[2], star.moveX[3], 0],
            y: [0, star.moveY[1], star.moveY[2], star.moveY[3], 0],
          }}
          transition={isMobile ? undefined : { 
            opacity: { duration: 2, delay: star.id * 0.1 },
            x: { 
              duration: star.animationDuration, 
              repeat: Infinity, 
              ease: "linear",
              times: [0, 0.25, 0.5, 0.75, 1]
            },
            y: { 
              duration: star.animationDuration * 1.2, 
              repeat: Infinity, 
              ease: "linear", 
              times: [0, 0.25, 0.5, 0.75, 1]
            }
          }}
        >
          <motion.div
            className="relative"
            animate={isMobile ? undefined : {
              opacity: [star.brightness * 0.6, star.brightness, star.brightness * 0.8, star.brightness],
              scale: [0.9, 1.1, 0.95, 1.05, 0.9],
            }}
            transition={isMobile ? undefined : {
              duration: star.flickerSpeed,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          >
            <div
              className="absolute rounded-full bg-white/15 blur-sm"
              style={{
                width: `${star.glowIntensity}px`,
                height: `${star.glowIntensity}px`,
                left: `${-star.glowIntensity / 2}px`,
                top: `${-star.glowIntensity / 2}px`,
              }}
            />
            
            <div
              className="absolute rounded-full bg-white"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                left: `${-star.size / 2}px`,
                top: `${-star.size / 2}px`,
                boxShadow: `0 0 ${star.size * 1.5}px rgba(255, 255, 255, 0.6)`,
              }}
            />
            
            <motion.div
              className="absolute"
              style={{
                left: `${-star.size * 0.8}px`,
                top: `${-star.size * 0.1}px`,
                width: `${star.size * 1.6}px`,
                height: `${star.size * 0.2}px`,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              }}
              animate={isMobile ? undefined : {
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={isMobile ? undefined : {
                duration: star.flickerSpeed * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute"
              style={{
                left: `${-star.size * 0.1}px`,
                top: `${-star.size * 0.8}px`,
                width: `${star.size * 0.2}px`,
                height: `${star.size * 1.6}px`,
                background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.6), transparent)',
              }}
              animate={isMobile ? undefined : {
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={isMobile ? undefined : {
                duration: star.flickerSpeed * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

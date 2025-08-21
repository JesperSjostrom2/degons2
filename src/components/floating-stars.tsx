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
}

const generateStars = (count: number = 30): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 0.8 + 0.3, // 0.3-1.1px (much smaller)
    brightness: Math.random() * 0.7 + 0.3, // 0.3-1.0
    flickerSpeed: Math.random() * 4 + 3, // 3-7 seconds (much slower flicker)
    glowIntensity: Math.random() * 2 + 1, // 1-3px (much smaller glow)
    animationDuration: Math.random() * 40 + 60, // 60-100 seconds (very slow drift)
  }))
}

export default function FloatingStars() {
  const [stars, setStars] = useState<Star[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setStars(generateStars())
  }, [])

  if (!isMounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            x: [0, Math.random() * 20 - 10, Math.random() * 15 - 7.5, 0],
            y: [0, Math.random() * 20 - 10, Math.random() * 15 - 7.5, 0],
          }}
          transition={{ 
            opacity: { duration: 2, delay: star.id * 0.2 },
            x: { 
              duration: star.animationDuration, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.33, 0.66, 1]
            },
            y: { 
              duration: star.animationDuration * 0.8, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.33, 0.66, 1]
            }
          }}
        >
          {/* Star with gentle flickering effect */}
          <motion.div
            className="relative"
            animate={{
              opacity: [star.brightness * 0.6, star.brightness, star.brightness * 0.8, star.brightness],
              scale: [0.9, 1.1, 0.95, 1.05, 0.9],
            }}
            transition={{
              duration: star.flickerSpeed,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          >
            {/* Outer glow */}
            <div
              className="absolute rounded-full bg-white/15 blur-sm"
              style={{
                width: `${star.glowIntensity}px`,
                height: `${star.glowIntensity}px`,
                left: `${-star.glowIntensity / 2}px`,
                top: `${-star.glowIntensity / 2}px`,
              }}
            />
            
            {/* Star core */}
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
            
            {/* Subtle star rays */}
            <motion.div
              className="absolute"
              style={{
                left: `${-star.size * 0.8}px`,
                top: `${-star.size * 0.1}px`,
                width: `${star.size * 1.6}px`,
                height: `${star.size * 0.2}px`,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
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
              animate={{
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
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
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CursorTrail() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Main cursor dot */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-accent mix-blend-mode-screen"
        style={{
          left: mousePosition.x - 4,
          top: mousePosition.y - 4,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}
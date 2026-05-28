'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  blur?: boolean
}

export default function ScrollReveal({ children, className = '', delay = 0, blur = false }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`transform-gpu ${className}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: blur ? 18 : 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -12% 0px' }}
      transition={{ duration: blur ? 0.56 : 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: shouldReduceMotion ? 'auto' : 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

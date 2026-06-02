'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cinematicEase } from '@/lib/site-motion'

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
      className={`mobile-no-load-animation transform-gpu ${className}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: blur ? 24 : 18, scale: 0.992, filter: blur ? 'blur(14px)' : 'blur(8px)' }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -16% 0px' }}
      transition={{ duration: blur ? 0.86 : 0.72, delay, ease: cinematicEase }}
      style={{ willChange: shouldReduceMotion ? 'auto' : 'transform, opacity, filter' }}
    >
      {children}
    </motion.div>
  )
}

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cinematicEase, useCompactMotion } from '@/lib/site-motion'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  blur?: boolean
}

export default function ScrollReveal({ children, className = '', delay = 0, blur = false }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const isCompact = useCompactMotion()

  return (
    <motion.div
      className={`transform-gpu ${className}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: isCompact ? 10 : blur ? 24 : 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -16% 0px' }}
      transition={{ duration: isCompact ? 0.4 : blur ? 0.82 : 0.68, delay: isCompact ? Math.min(delay, 0.1) : delay, ease: cinematicEase }}
      style={{ willChange: shouldReduceMotion ? 'auto' : 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

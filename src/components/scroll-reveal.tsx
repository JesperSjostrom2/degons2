'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cinematicEase, cinematicViewport, useCompactMotion, useRevealTransition } from '@/lib/site-motion'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  blur?: boolean
}

export default function ScrollReveal({ children, className = '', delay = 0, blur = false }: ScrollRevealProps) {
  const isCompact = useCompactMotion()
  const revealTransition = useRevealTransition()

  /* No `will-change`. It is a promise to the compositor, not a speed-up: while it is set the
     element keeps its own layer, and this one was set unconditionally and never cleared, so
     every reveal on the page held a layer long after it had finished moving. Framer animates
     transform and opacity here, both of which the browser promotes by itself for the duration of
     the animation — which is precisely the window `will-change` was meant to cover. */

  return (
    <motion.div
      className={`transform-gpu ${className}`}
      initial={{ opacity: 0, y: isCompact ? 10 : blur ? 24 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={cinematicViewport}
      transition={revealTransition({
        duration: isCompact ? 0.4 : blur ? 0.82 : 0.68,
        delay: isCompact ? Math.min(delay, 0.1) : delay,
        ease: cinematicEase,
      })}
    >
      {children}
    </motion.div>
  )
}

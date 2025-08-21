'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    // Initialize Lenis with premium smooth scrolling settings
    const lenis = new Lenis({
      duration: 1.2,        // Duration of scroll animation
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      smoothWheel: true,    // Enable smooth scrolling for mouse wheel
      smoothTouch: false,   // Disable on touch devices for better performance
      touchMultiplier: 2,   // Touch scroll multiplier
      infinite: false,      // Disable infinite scroll
      orientation: 'vertical', // Vertical scroll only
      gestureOrientation: 'vertical',
    })

    // Animation loop for Lenis
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
    }
  }, [])

  return null // This component doesn't render anything
}
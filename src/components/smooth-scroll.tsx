'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    const useNativeScroll = window.matchMedia('(pointer: coarse), (max-width: 767px)').matches
    let lenis: Lenis | null = null
    let rafId = 0

    const scrollToHash = (hash: string) => {
      const element = document.querySelector(hash)

      if (!element) {
        return
      }

      if (lenis) {
        lenis.scrollTo(element as HTMLElement, { offset: -100 })
        return
      }

      element.scrollIntoView({ behavior: 'smooth' })
    }

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      const link = target.closest<HTMLAnchorElement>('a[href^="#"]')

      if (!link || link.target || link.hash.length <= 1) {
        return
      }

      event.preventDefault()
      scrollToHash(link.hash)
      window.history.pushState(null, '', link.hash)
    }

    document.addEventListener('click', handleAnchorClick)

    if (!useNativeScroll) {
      lenis = new Lenis({
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
      })

      function raf(time: number) {
        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }

      rafId = requestAnimationFrame(raf)
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

  return null
}

'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { shouldUseEnhancedMotion } from '@/lib/client-performance'

export default function SmoothScroll() {
  useEffect(() => {
    const useNativeScrollByDefault = window.matchMedia('(pointer: coarse), (max-width: 767px)').matches
    const supportsVisualViewport = typeof window.visualViewport !== 'undefined'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null
    let rafId = 0
    let isActive = true
    let cleanupLenisVisibility: (() => void) | null = null

    const updateZoomState = () => {
      if (!supportsVisualViewport) {
        return
      }

      const scale = window.visualViewport?.scale ?? 1
      document.documentElement.classList.toggle('mobile-zoomed', scale > 1.01)
    }

    const scrollToHash = (hash: string) => {
      const element = document.querySelector(hash)

      if (!element) {
        return
      }

      if (isActive && lenis) {
        lenis.scrollTo(element as HTMLElement, { offset: -60 })
        return
      }

      element.scrollIntoView({ behavior: 'smooth' })
    }

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      const trigger = target.closest<HTMLElement>('a[href^="#"], [data-scroll-to]')

      if (!trigger) {
        return
      }

      const hash = trigger.getAttribute('data-scroll-to') || (trigger as HTMLAnchorElement).hash
      
      if (!hash || hash.length <= 1) {
        return
      }

      event.preventDefault()
      scrollToHash(hash.startsWith('#') ? hash : `#${hash}`)
    }

    document.addEventListener('click', handleAnchorClick)

    if (supportsVisualViewport && useNativeScrollByDefault) {
      updateZoomState()
      window.visualViewport?.addEventListener('resize', updateZoomState)
    }

    const initializeLenis = async () => {
      const canUseEnhancedMotion = !useNativeScrollByDefault && await shouldUseEnhancedMotion()

      if (!isActive || !canUseEnhancedMotion) {
        return
      }

      lenis = new Lenis({
        duration: 0.75,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.8,
        wheelMultiplier: 1,
        infinite: false,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
      })

      function raf(time: number) {
        if (document.hidden) {
          rafId = 0
          return
        }

        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }

      const startRaf = () => {
        if (!rafId && !document.hidden) {
          rafId = requestAnimationFrame(raf)
        }
      }

      const handleVisibilityChange = () => {
        if (document.hidden) {
          cancelAnimationFrame(rafId)
          rafId = 0
          return
        }

        startRaf()
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      startRaf()

      cleanupLenisVisibility = () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        cancelAnimationFrame(rafId)
        rafId = 0
        lenis?.destroy()
        lenis = null
      }
    }

    initializeLenis()

    return () => {
      isActive = false
      document.removeEventListener('click', handleAnchorClick)
      window.visualViewport?.removeEventListener('resize', updateZoomState)
      document.documentElement.classList.remove('mobile-zoomed')
      cleanupLenisVisibility?.()
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

  return null
}

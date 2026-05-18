'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    const useNativeScroll = window.matchMedia('(pointer: coarse), (max-width: 767px)').matches
    const supportsVisualViewport = typeof window.visualViewport !== 'undefined'
    let lenis: Lenis | null = null
    let rafId = 0

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

      if (lenis) {
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

    if (supportsVisualViewport && useNativeScroll) {
      updateZoomState()
      window.visualViewport?.addEventListener('resize', updateZoomState)
    }

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

      return () => {
        document.removeEventListener('click', handleAnchorClick)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.visualViewport?.removeEventListener('resize', updateZoomState)
        document.documentElement.classList.remove('mobile-zoomed')
        cancelAnimationFrame(rafId)
        lenis?.destroy()
      }
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      window.visualViewport?.removeEventListener('resize', updateZoomState)
      document.documentElement.classList.remove('mobile-zoomed')
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

  return null
}

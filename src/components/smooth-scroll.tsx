'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Lenis from 'lenis'
import { shouldUseEnhancedMotion } from '@/lib/client-performance'
import { hasPendingSection, requestSectionOnHome } from '@/lib/section-handoff'
import { TRANSITION_LOCK_EVENT, TRANSITION_UNLOCK_EVENT } from '@/lib/route-transition'
import { useRouteTransition } from '@/components/transition/route-transition-provider'

export default function SmoothScroll() {
  const router = useRouter()
  const pathname = usePathname()
  const { navigate } = useRouteTransition()
  // Read inside the listener rather than closed over: the effect runs once, so a
  // captured `pathname` would still say `/` after a client-side navigation.
  const routeRef = useRef({ router, pathname, navigate })
  routeRef.current = { router, pathname, navigate }

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

      const selector = hash.startsWith('#') ? hash : `#${hash}`

      /**
       * Every one of these targets is a section of the home page, so off the home page
       * there is nothing to scroll to and the click used to do nothing at all — which is
       * what made the footer's six links dead on a project page. When the target is not
       * on this page, hand it off and go home instead; `SectionHandoff` finishes the
       * scroll once the home page has mounted.
       */
      if (!document.querySelector(selector)) {
        const { router: nextRouter, pathname: currentPath, navigate: runTransition } = routeRef.current

        if (currentPath !== '/') {
          event.preventDefault()
          requestSectionOnHome(selector.slice(1))

          // Through the curtain, so a footer link reads like every other way of leaving this
          // page. It falls back to a plain push only if the curtain declines outright, which
          // it does for a destination it considers the current page.
          if (!runTransition('/')) {
            nextRouter.push('/')
          }
        }

        return
      }

      event.preventDefault()
      scrollToHash(selector)
    }

    /**
     * Lenis is created per page and never handed out, so the curtain cannot reach it directly —
     * it shouts instead. Without this, momentum from the page you are leaving carries on behind
     * an opaque overlay and lands you somewhere you did not ask to be.
     */
    const handleTransitionLock = () => {
      lenis?.stop()
    }

    const handleTransitionUnlock = () => {
      lenis?.start()

      // This instance was constructed during the route swap, against the *outgoing* page's
      // scroll position, and the curtain has moved the document since. Without a resync the
      // first wheel tick yanks the new page back to wherever the old one was parked.
      //
      // Except when a section handoff is pending: `SectionHandoff` is about to scroll the page
      // itself, and an explicit target set here would fight its every attempt until the budget
      // ran out. It re-asserts on its own poll, so leaving Lenis untargeted lets it win.
      if (!hasPendingSection()) {
        lenis?.scrollTo(window.scrollY, { immediate: true, force: true })
      }
    }

    document.addEventListener('click', handleAnchorClick)
    window.addEventListener(TRANSITION_LOCK_EVENT, handleTransitionLock)
    window.addEventListener(TRANSITION_UNLOCK_EVENT, handleTransitionUnlock)

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
      window.removeEventListener(TRANSITION_LOCK_EVENT, handleTransitionLock)
      window.removeEventListener(TRANSITION_UNLOCK_EVENT, handleTransitionUnlock)
      window.visualViewport?.removeEventListener('resize', updateZoomState)
      document.documentElement.classList.remove('mobile-zoomed')
      cleanupLenisVisibility?.()
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

  return null
}

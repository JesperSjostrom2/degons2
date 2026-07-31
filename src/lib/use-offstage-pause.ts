'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Marks an element with `data-offstage` while it is far outside the viewport.
 *
 * Regions that are always rendered (no `content-visibility: auto`, because
 * something needs their real geometry) still tick every infinite CSS animation
 * they contain, offscreen, forever — main-thread style work that competes with
 * scrolling elsewhere on the page. A CSS rule keyed on the attribute pauses
 * those animations; the generous margin resumes them well before the region
 * can re-enter the viewport, so a visitor never sees a frozen frame.
 *
 * Pauses CSS animations only — framer-motion and other JS/WAAPI-driven motion
 * are unaffected by `animation-play-state`.
 */
export const useOffstagePause = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        element.toggleAttribute('data-offstage', !entry.isIntersecting)
      },
      { rootMargin: '60% 0px 60% 0px' },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      element.removeAttribute('data-offstage')
    }
  }, [ref])
}

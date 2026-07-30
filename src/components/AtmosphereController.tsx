'use client'

import { useEffect } from 'react'

/**
 * Drives the star parallax from scroll position.
 *
 * The sky itself is one flat colour (`--sky`) and does not move — there is no
 * light curve any more, so nothing here brightens or darkens with depth. All
 * this does is drift the three star bands at different rates.
 *
 * PERFORMANCE CONTRACT — this controller writes ONLY `transform`, and only
 * directly onto the `[data-atmosphere="stars"]` elements. It must never write a
 * custom property on :root. Doing so invalidates style for every element that
 * inherits it, and an earlier version of this file did exactly that: even
 * quantised to twenty steps per page it made the bento section stutter.
 * Anything that needs to respond to depth should either be one of these layers
 * or be a constant.
 */

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

type AtmosphereLayer = {
  el: HTMLElement
  parallax: number
}

export default function AtmosphereController() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const root = document.documentElement

    const layers: AtmosphereLayer[] = Array.from(
      document.querySelectorAll<HTMLElement>('[data-atmosphere="stars"]'),
    ).map((el) => ({
      el,
      // vh of travel across the full page, resolved to px per frame.
      parallax: Number(el.dataset.parallax ?? 0),
    }))

    if (!layers.length) {
      return
    }

    let maxScroll = Math.max(1, root.scrollHeight - window.innerHeight)
    let viewportHeight = window.innerHeight
    let rafId = 0

    const measure = () => {
      viewportHeight = window.innerHeight
      maxScroll = Math.max(1, root.scrollHeight - viewportHeight)
    }

    const apply = () => {
      rafId = 0

      const depth = clamp01(window.scrollY / maxScroll)

      for (const layer of layers) {
        layer.el.style.transform = `translate3d(0, ${(depth * layer.parallax * viewportHeight) / 100}px, 0)`
      }
    }

    const schedule = () => {
      if (!rafId && !document.hidden) {
        rafId = requestAnimationFrame(apply)
      }
    }

    const handleResize = () => {
      measure()
      schedule()
    }

    // The document grows as content-visibility sections render in, so the
    // scrollable height has to be re-measured. Reading scrollHeight forces
    // layout, hence only on an actual body resize — never per frame.
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(document.body)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', schedule)

    measure()
    schedule()

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', schedule)
      cancelAnimationFrame(rafId)

      for (const layer of layers) {
        layer.el.style.removeProperty('transform')
      }
    }
  }, [])

  return null
}

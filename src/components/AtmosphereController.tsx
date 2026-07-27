'use client'

import { useEffect } from 'react'

/**
 * Drives the site's ambient lighting from scroll position.
 *
 * The page is a descent: light in water attenuates exponentially, fastest just
 * under the surface, and it does so *uniformly* across the whole field of view.
 * So the sky is two flat colours cross-fading on opacity — never a gradient,
 * because a fixed gradient is a shape that rides along with the viewport.
 *
 * PERFORMANCE CONTRACT — this controller writes ONLY `transform` and `opacity`,
 * and only directly onto the four `[data-atmosphere]` elements. It must never
 * write a custom property on :root. Doing so invalidates style for every
 * element that inherits it, and an earlier version of this file did exactly
 * that: even quantised to twenty steps per page it made the bento section
 * stutter, because the light curve is steepest right where the heaviest DOM
 * subtree sits. Anything that needs to respond to depth should either be one of
 * these layers or be a constant.
 */

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/**
 * Beer-Lambert with an extra hero-exit term, so the planet crossing is the
 * sharpest moment and the exponential tail then keeps attenuating forever —
 * the curve never plateaus into something that could read as an edge.
 *
 * Hero 1.00 -> past the planet ~0.40 -> projects ~0.19 -> about ~0.10 ->
 * contact ~0.045.
 */
const SURFACE_DROP = 0.45
const ATTENUATION_K = 2.6

const lightLevelFor = (heroExit: number, depth: number) =>
  clamp01((1 - SURFACE_DROP * heroExit) * Math.exp(-ATTENUATION_K * depth))

type AtmosphereLayer = {
  el: HTMLElement
  kind: 'stars' | 'abyss'
  parallax: number
}

export default function AtmosphereController() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const root = document.documentElement

    const layers: AtmosphereLayer[] = Array.from(
      document.querySelectorAll<HTMLElement>('[data-atmosphere]'),
    ).map((el) => ({
      el,
      kind: el.dataset.atmosphere as AtmosphereLayer['kind'],
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

      const scrollY = window.scrollY
      const depth = clamp01(scrollY / maxScroll)
      const heroExit = smoothstep(0, viewportHeight, scrollY)
      const light = lightLevelFor(heroExit, depth)

      for (const layer of layers) {
        switch (layer.kind) {
          case 'stars':
            layer.el.style.transform = `translate3d(0, ${(depth * layer.parallax * viewportHeight) / 100}px, 0)`
            layer.el.style.opacity = `${0.72 + (1 - light) * 0.42}`
            break
          case 'abyss':
            // Solid deep colour cross-fading over the solid surface colour.
            // A plain sRGB interpolation with no gradient, so it cannot band.
            layer.el.style.opacity = `${1 - light}`
            break
        }
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
        layer.el.style.removeProperty('opacity')
      }
    }
  }, [])

  return null
}

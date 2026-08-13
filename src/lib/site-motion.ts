'use client'

import { useCallback, useEffect, useState } from 'react'
import { useReducedMotion, type Transition, type Variants } from 'framer-motion'

export const cinematicEase = [0.16, 1, 0.3, 1] as const

/**
 * Reduced motion changes the *duration*, never the states.
 *
 * The obvious-looking way to honour the preference is to drop the animation out of the render
 * entirely — `initial={shouldReduceMotion ? false : { opacity: 0 }}`. Every reveal on this site
 * used to do that, and it left reduced-motion visitors staring at a page where most sections
 * never appeared at all. The reason is a three-way interaction:
 *
 *   1. framer's `useReducedMotion()` returns `null` on the server, so SSR always takes the
 *      animated branch and serialises `initial` into the markup as `style="opacity:0;…"`.
 *   2. On the client's *first* render the hook already returns `true`, so the component renders
 *      `initial={false}` / `whileInView={undefined}` — no animation is ever scheduled and no
 *      target opacity is ever written.
 *   3. React does not patch mismatched `style` attributes during hydration, and framer's DOM
 *      writer only assigns keys it actually computed. With no opacity key in play, nothing ever
 *      clears the server's `opacity: 0`.
 *
 * So the branch that meant "don't animate" really meant "never become visible". Keeping the
 * states identical for everyone and collapsing only the duration removes the mismatch at its
 * root: the server's hidden state is always the same one the client drives to visible, and a
 * reduced-motion visitor simply gets there in zero seconds.
 */
const INSTANT: Transition = { duration: 0 }

export function useRevealTransition() {
  const shouldReduceMotion = useReducedMotion()

  return useCallback(
    (transition: Transition): Transition => (shouldReduceMotion ? INSTANT : transition),
    [shouldReduceMotion],
  )
}

/**
 * The same rule for the `variants` reveals, which cannot use `useRevealTransition`.
 *
 * A `transition` prop on the element is only a default — a `transition` declared inside a
 * variant outranks it, and every variant below carries its own. So the duration has to be
 * replaced on the variant itself rather than passed alongside it.
 */
export function useRevealVariants() {
  const shouldReduceMotion = useReducedMotion()

  return useCallback(
    (variants: Variants): Variants => {
      const visible = variants.visible

      // A resolver decides its own target per-custom-value; there is no static object to
      // rewrite, and nothing on this site uses that form for a reveal.
      if (!shouldReduceMotion || typeof visible === 'function') {
        return variants
      }

      return { ...variants, visible: { ...visible, transition: INSTANT } }
    },
    [shouldReduceMotion],
  )
}

/**
 * Same reveals, scaled down for mobile — shorter travel, shorter duration, no stagger — instead
 * of the flat "skip the animation entirely" the site used to fall back to below 768px. Width
 * only, checked live via matchMedia; nothing here probes the device or its frame timing.
 */
export function useCompactMotion() {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsCompact(query.matches)

    sync()
    query.addEventListener('change', sync)

    return () => query.removeEventListener('change', sync)
  }, [])

  return isCompact
}

export const cinematicHeaderCompact: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: cinematicEase,
    },
  },
}

export const cinematicPanelCompact = (): Variants => ({
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.46,
      ease: cinematicEase,
    },
  },
})

export const cinematicItemCompact = (delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: Math.min(delay, 0.1),
      ease: cinematicEase,
    },
  },
})

/**
 * For things that travel across the screen and have to both start and stop — currently the
 * route curtain, which arrives from below and leaves upward.
 *
 * `cinematicEase` is expo-out: all deceleration, no ramp. That is right for the reveals it is
 * used for, which only settle into place, but a full-bleed panel eased that way begins at its
 * top speed and reads as a jolt. This is easeInOutQuart, which is the curve this whole genre of
 * transition is built on.
 */
export const curtainEase = [0.76, 0, 0.24, 1] as const

/* `as const` so `margin` keeps its literal type. framer types it as a template literal
   (`${number}px | %` groups), and a widened `string` is rejected by `useInView` — which
   `masked-rise.tsx` passes this to, so the one shared viewport definition can stay shared. */
export const cinematicViewport = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -16% 0px',
} as const

/**
 * Every reveal below is a pure translate, on purpose: the curtain never scales or tilts
 * anything, only clips and moves it, so neither does the content that follows it. A scaled-up
 * entrance is the one trait that would have given these away as a stock reveal rather than the
 * same gesture as the transition — it was there before and read as a different animation
 * wearing the same easing.
 */

export const cinematicHeader: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.84,
      ease: cinematicEase,
    },
  },
}

export const cinematicPanel = (direction: 'up' | 'left' | 'right' | 'deep' = 'up'): Variants => {
  const offset = {
    up: { x: 0, y: 58 },
    left: { x: -46, y: 38 },
    right: { x: 46, y: 38 },
    deep: { x: 0, y: 72 },
  }[direction]

  return {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.78,
        ease: cinematicEase,
      },
    },
  }
}

export const cinematicItem = (delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      delay,
      ease: cinematicEase,
    },
  },
})

import type { Variants } from 'framer-motion'

export const cinematicEase = [0.16, 1, 0.3, 1] as const

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

export const cinematicHeader: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.992,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.84,
      ease: cinematicEase,
    },
  },
}

export const cinematicPanel = (direction: 'up' | 'left' | 'right' | 'deep' = 'up'): Variants => {
  const offset = {
    up: { x: 0, y: 58, rotateX: 0, rotateZ: 0 },
    left: { x: -46, y: 38, rotateX: 0, rotateZ: -0.8 },
    right: { x: 46, y: 38, rotateX: 0, rotateZ: 0.8 },
    deep: { x: 0, y: 72, rotateX: 7, rotateZ: 0 },
  }[direction]

  return {
    hidden: {
      opacity: 0,
      ...offset,
      scale: 0.985,
      transformPerspective: 1200,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateZ: 0,
      scale: 1,
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
    scale: 0.994,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      delay,
      ease: cinematicEase,
    },
  },
})

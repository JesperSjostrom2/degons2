import type { Variants } from 'framer-motion'

export const cinematicEase = [0.16, 1, 0.3, 1] as const

export const cinematicViewport = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -16% 0px',
}

export const cinematicHeader: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.985,
    filter: 'blur(14px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.95,
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
      scale: 0.975,
      filter: 'blur(18px)',
      transformPerspective: 1200,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateZ: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.05,
        ease: cinematicEase,
      },
    },
  }
}

export const cinematicItem = (delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.99,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.78,
      delay,
      ease: cinematicEase,
    },
  },
})

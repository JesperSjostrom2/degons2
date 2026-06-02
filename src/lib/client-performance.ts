'use client'

type NavigatorWithPerformanceHints = Navigator & {
  deviceMemory?: number
  connection?: {
    saveData?: boolean
  }
}

const PERFORMANCE_CACHE_KEY = 'site-enhanced-motion-ok-v2'
const PAGE_SETTLE_DELAY_MS = 150
let enhancedMotionPromise: Promise<boolean> | null = null

const isClearlyLowPowerDevice = () => {
  const nav = navigator as NavigatorWithPerformanceHints
  const cores = nav.hardwareConcurrency ?? 8
  const memory = nav.deviceMemory ?? 8

  if (nav.connection?.saveData) {
    return true
  }

  return cores <= 2 || memory <= 2 || (cores <= 4 && memory <= 4)
}

const waitForPageToSettle = () =>
  new Promise<void>((resolve) => {
    const settle = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve()
        })
      })
    }

    if (document.readyState === 'complete') {
      window.setTimeout(settle, PAGE_SETTLE_DELAY_MS)
      return
    }

    const handleLoad = () => {
      window.removeEventListener('load', handleLoad)
      window.setTimeout(settle, PAGE_SETTLE_DELAY_MS)
    }

    window.addEventListener('load', handleLoad, { once: true })
  })

const measureFrameHealth = () =>
  new Promise<boolean>((resolve) => {
    const sampleDuration = 350
    const maxAverageFrameMs = 28
    const maxSingleFrameMs = 112
    const startedAt = performance.now()
    let previousFrame = startedAt
    let frameCount = 0
    let totalFrameMs = 0
    let worstFrameMs = 0

    const tick = (now: number) => {
      const frameMs = now - previousFrame

      if (frameCount > 0) {
        totalFrameMs += frameMs
        worstFrameMs = Math.max(worstFrameMs, frameMs)
      }

      previousFrame = now
      frameCount += 1

      if (now - startedAt < sampleDuration) {
        requestAnimationFrame(tick)
        return
      }

      const measuredFrames = Math.max(frameCount - 1, 1)
      const averageFrameMs = totalFrameMs / measuredFrames
      resolve(averageFrameMs <= maxAverageFrameMs && worstFrameMs <= maxSingleFrameMs)
    }

    requestAnimationFrame(tick)
  })

const checkEnhancedMotion = async () => {
  if (typeof window === 'undefined') {
    return false
  }

  const cached = window.sessionStorage.getItem(PERFORMANCE_CACHE_KEY)

  if (cached) {
    return cached === 'true'
  }

  await waitForPageToSettle()

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion || isClearlyLowPowerDevice()) {
    window.sessionStorage.setItem(PERFORMANCE_CACHE_KEY, 'false')
    return false
  }

  const hasHealthyFrames = await measureFrameHealth()
  if (hasHealthyFrames) {
    window.sessionStorage.setItem(PERFORMANCE_CACHE_KEY, 'true')
  }

  return hasHealthyFrames
}

export const shouldUseEnhancedMotion = async () => {
  if (!enhancedMotionPromise) {
    enhancedMotionPromise = checkEnhancedMotion()
  }

  return enhancedMotionPromise
}

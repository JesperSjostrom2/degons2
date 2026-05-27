'use client'

type NavigatorWithPerformanceHints = Navigator & {
  deviceMemory?: number
  connection?: {
    saveData?: boolean
  }
}

const PERFORMANCE_CACHE_KEY = 'site-enhanced-motion-ok'

const isLikelyLowPowerDevice = () => {
  const nav = navigator as NavigatorWithPerformanceHints
  const cores = nav.hardwareConcurrency ?? 8
  const memory = nav.deviceMemory ?? 8
  const saveData = Boolean(nav.connection?.saveData)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return reducedMotion || saveData || cores <= 4 || memory <= 4
}

const measureFrameHealth = () =>
  new Promise<boolean>((resolve) => {
    const sampleDuration = 700
    const maxAverageFrameMs = 22
    const maxSingleFrameMs = 80
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

export const shouldUseEnhancedMotion = async () => {
  if (typeof window === 'undefined') {
    return false
  }

  const cached = window.sessionStorage.getItem(PERFORMANCE_CACHE_KEY)

  if (cached) {
    return cached === 'true'
  }

  if (isLikelyLowPowerDevice()) {
    window.sessionStorage.setItem(PERFORMANCE_CACHE_KEY, 'false')
    return false
  }

  const hasHealthyFrames = await measureFrameHealth()
  window.sessionStorage.setItem(PERFORMANCE_CACHE_KEY, String(hasHealthyFrames))

  return hasHealthyFrames
}

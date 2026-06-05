'use client'

import { shouldUseEnhancedMotion } from '@/lib/client-performance'

const BENTO_ASSET_URLS = [
  '/assets/bento-cards/end-to-end-delivery/path.svg',
  '/assets/bento-cards/visitor-flow/time.svg',
  '/assets/bento-cards/first-impression/Starrating.svg',
]

const BELOW_FOLD_IMAGE_URLS = [
  '/assets/projects/andcreativeproduct.webp',
  '/assets/projects/kermaipad.webp',
  '/assets/projects/ogportfolionew.webp',
]

const scheduleIdleWork = (callback: () => void, timeout = 1200) => {
  const requestIdleCallback = window.requestIdleCallback?.bind(window)
  const cancelIdleCallback = window.cancelIdleCallback?.bind(window)

  if (requestIdleCallback && cancelIdleCallback) {
    const idleId = requestIdleCallback(callback, { timeout })

    return () => cancelIdleCallback(idleId)
  }

  const timeoutId = window.setTimeout(callback, Math.min(timeout, 180))

  return () => window.clearTimeout(timeoutId)
}

const warmFetchCache = (url: string) => {
  void fetch(url, { cache: 'force-cache' }).catch(() => undefined)
}

const warmImageCache = (url: string) => {
  const image = new Image()
  image.decoding = 'async'
  image.loading = 'eager'
  image.src = url
}

const warmBentoClientCode = () => {
  void import('@/components/ui/cobe-globe')
    .then((module) => module.warmCobeGlobeEngine())
    .catch(() => undefined)
}

const warmHeroAtmosphere = () => {
  if (!window.matchMedia('(min-width: 768px)').matches) {
    return
  }

  void Promise.all([
    import('@/components/LightRays'),
    shouldUseEnhancedMotion(),
  ]).catch(() => undefined)
}

export const prewarmBelowFoldAssets = () => {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const cancelHeroAtmospherePreload = scheduleIdleWork(warmHeroAtmosphere, 420)

  const cancelBentoCodePreload = scheduleIdleWork(warmBentoClientCode, 260)

  const cancelBentoPreload = scheduleIdleWork(() => {
    BENTO_ASSET_URLS.forEach(warmFetchCache)
  }, 520)

  const cancelImagePreload = scheduleIdleWork(() => {
    BELOW_FOLD_IMAGE_URLS.forEach(warmImageCache)
  }, 1600)

  return () => {
    cancelHeroAtmospherePreload()
    cancelBentoCodePreload()
    cancelBentoPreload()
    cancelImagePreload()
  }
}

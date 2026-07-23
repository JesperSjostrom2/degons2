'use client'

import { shouldUseEnhancedMotion } from '@/lib/client-performance'

const BENTO_STATIC_ASSET_URLS = [
  '/assets/bento-cards/static/end-to-end.svg',
  '/assets/bento-cards/static/fast-delivery.svg',
  '/assets/bento-cards/first-impression/Wishlist.svg',
  '/assets/bento-cards/avaibility-globe/International Shipping.svg',
]

const BENTO_INTERACTIVE_ASSET_URLS = [
  '/assets/bento-cards/end-to-end-delivery/path.svg',
  '/assets/bento-cards/visitor-flow/time.svg',
  '/assets/bento-cards/first-impression/Wishlist.svg',
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

  const cancelBentoStaticPreload = scheduleIdleWork(() => {
    BENTO_STATIC_ASSET_URLS.forEach(warmImageCache)
  }, 520)

  const cancelBentoInteractivePreload = scheduleIdleWork(() => {
    BENTO_INTERACTIVE_ASSET_URLS.forEach(warmFetchCache)
  }, 2400)

  const cancelImagePreload = scheduleIdleWork(() => {
    BELOW_FOLD_IMAGE_URLS.forEach(warmImageCache)
  }, 1600)

  return () => {
    cancelHeroAtmospherePreload()
    cancelBentoStaticPreload()
    cancelBentoInteractivePreload()
    cancelImagePreload()
  }
}

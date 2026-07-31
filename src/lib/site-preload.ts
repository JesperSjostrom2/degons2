'use client'

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
  '/assets/projects/andcreative/andcreativeproduct.webp',
  '/assets/projects/kerma/kermaipad.webp',
  '/assets/projects/portfolio-v1/ogportfolionew.webp',
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

  /* Only the chunk needs warming now. `shouldUseEnhancedMotion()` used to be
     awaited alongside it purely to kick off its frame measurement early and
     cache the result before anything asked; that function no longer measures
     anything, so calling it here would just discard a boolean. */
  void import('@/components/SideRays').catch(() => undefined)
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

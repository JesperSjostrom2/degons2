'use client'

const BENTO_ASSET_URLS = [
  '/assets/bento-cards/end-to-end-delivery/path.svg',
  '/assets/bento-cards/visitor-flow/time.svg',
  '/assets/bento-cards/first-impression/Starrating.svg',
]

const BELOW_FOLD_IMAGE_URLS = [
  '/assets/projects/andcreativeproduct.png',
  '/assets/projects/kermaipad.png',
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
  void import('@/components/ui/cobe-globe').catch(() => undefined)
}

export const prewarmBelowFoldAssets = () => {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const cancelBentoPreload = scheduleIdleWork(() => {
    BENTO_ASSET_URLS.forEach(warmFetchCache)
  }, 700)

  const cancelImagePreload = scheduleIdleWork(() => {
    BELOW_FOLD_IMAGE_URLS.forEach(warmImageCache)
  }, 1600)

  const cancelClientCodePreload = scheduleIdleWork(warmBentoClientCode, 2200)

  return () => {
    cancelBentoPreload()
    cancelImagePreload()
    cancelClientCodePreload()
  }
}

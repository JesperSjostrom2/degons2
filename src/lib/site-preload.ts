'use client'

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

/**
 * Warms the one thing that is actually fetched by the URL we can name: the SideRays chunk.
 *
 * This used to also `new Image()` the bento illustrations and three project covers, on the
 * theory that having them in the HTTP cache made the sections below the fold snap in. It did
 * the opposite. Every one of those files is rendered through `next/image`, which requests
 * `/_next/image?url=…&w=…&q=…` — a different URL from the raw `/assets/…` path being warmed.
 * The browser cache is keyed on the URL, so the two never met: the page downloaded ~1.6MB of
 * PNG that nothing ever read, then downloaded the optimised variants it actually renders.
 *
 * Warming the optimised URL instead is possible but not worth it — it means hardcoding the `w`
 * and `q` next/image will pick, which silently rots the moment a `sizes` attribute changes.
 * `next/image` already starts these fetches as they approach the viewport, which is what this
 * was reaching for.
 *
 * A module path has no such problem: `import()` resolves to the same chunk URL webpack will ask
 * for later, so this one genuinely warms.
 */
export const prewarmHeroAtmosphere = () => {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  return scheduleIdleWork(warmHeroAtmosphere, 420)
}

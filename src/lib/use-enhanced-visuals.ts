'use client'

import { useEffect, useState } from 'react'

import { shouldUseEnhancedMotion } from './client-performance'

/**
 * Desktop-and-healthy-frames gate for WebGL backdrops.
 *
 * Lifted out of hero.tsx so every shader layer on the site shares one
 * definition of "this device can afford it" — the hero rays, the projects
 * rays and the contact veil all mount on the same terms.
 */
export function useEnhancedVisuals(minWidth = 768) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`)
    let isMounted = true
    let requestId = 0

    const update = async () => {
      const currentRequest = requestId + 1
      requestId = currentRequest
      const canUseMotion = mediaQuery.matches && (await shouldUseEnhancedMotion())

      if (!isMounted || currentRequest !== requestId) {
        return
      }

      setEnabled(mediaQuery.matches && canUseMotion)
    }

    update()
    mediaQuery.addEventListener('change', update)

    return () => {
      isMounted = false
      mediaQuery.removeEventListener('change', update)
    }
  }, [minWidth])

  return enabled
}

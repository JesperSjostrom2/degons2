'use client'

import { useEffect } from 'react'
import { shouldUseEnhancedMotion } from '@/lib/client-performance'

export default function CustomCursor() {
  useEffect(() => {
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mobileViewportQuery = window.matchMedia('(max-width: 1024px)')
    let isMounted = true
    let availabilityRequestId = 0

    const updateCursorAvailability = async () => {
      const requestId = availabilityRequestId + 1
      availabilityRequestId = requestId
      const canUseEnhancedMotion =
        pointerQuery.matches &&
        !mobileViewportQuery.matches &&
        await shouldUseEnhancedMotion()

      if (!isMounted || requestId !== availabilityRequestId) {
        return
      }

      document.documentElement.classList.toggle('custom-cursor-active', canUseEnhancedMotion)
    }

    updateCursorAvailability()
    pointerQuery.addEventListener('change', updateCursorAvailability)
    mobileViewportQuery.addEventListener('change', updateCursorAvailability)
    window.addEventListener('resize', updateCursorAvailability)

    return () => {
      isMounted = false
      pointerQuery.removeEventListener('change', updateCursorAvailability)
      mobileViewportQuery.removeEventListener('change', updateCursorAvailability)
      window.removeEventListener('resize', updateCursorAvailability)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  return null
}

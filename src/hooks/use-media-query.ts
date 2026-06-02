'use client'

import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string, initialValue = false) => {
  const [matches, setMatches] = useState(initialValue)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatches = () => setMatches(mediaQuery.matches)

    updateMatches()
    mediaQuery.addEventListener('change', updateMatches)

    return () => mediaQuery.removeEventListener('change', updateMatches)
  }, [query])

  return matches
}

export const useIsMobile = (maxWidth = 767, initialValue = false) =>
  useMediaQuery(`(max-width: ${maxWidth}px)`, initialValue)

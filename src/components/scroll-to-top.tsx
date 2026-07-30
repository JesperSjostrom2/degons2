'use client'

import { useLayoutEffect } from 'react'

/**
 * Opens the page at the top.
 *
 * Next's own scroll restoration does not survive here: Lenis takes over the scroll position
 * on the page you are leaving, and the browser restores that offset on the new route, so
 * clicking a project from halfway down the home page dropped you halfway down the project.
 *
 * `useLayoutEffect` so it lands before paint — an effect that runs after would show one frame
 * at the wrong offset. It runs before `SmoothScroll` creates its Lenis instance, so the new
 * instance reads a scroll position of zero.
 */
const ScrollToTop = () => {
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  return null
}

export default ScrollToTop

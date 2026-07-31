'use client'

import { useEffect, useState } from 'react'

/**
 * Desktop gate for WebGL backdrops.
 *
 * Lifted out of hero.tsx so every shader layer on the site shares one
 * definition of "this device can afford it" — the hero rays, the projects
 * rays and the contact veil all mount on the same terms.
 *
 * This used to also run `shouldUseEnhancedMotion()`, which timed 350ms of
 * frames shortly after load and refused the rays if the average frame missed
 * 28ms or any single frame missed 112ms. That window overlaps hydration, font
 * swap and the loader's own exit animation, so a perfectly capable desktop
 * would routinely fail it and the rays would never appear in production —
 * while passing locally, because a warm dev page has nothing left to do. A
 * probe that fires precisely when the page is busiest cannot tell a slow
 * machine from a machine that is starting up, so it is gone.
 *
 * What is left is what actually predicts affordability: viewport width (the
 * rays are a desktop flourish and mobile is hand-tuned) and the user's own
 * reduced-motion preference. Both are declarative, so there is no race and no
 * first-paint flicker. WebGL absence is still handled downstream, in
 * SideRays' own createWebGLCanvas probe.
 */
export function useEnhancedVisuals(minWidth = 768) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const wideEnough = window.matchMedia(`(min-width: ${minWidth}px)`)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => setEnabled(wideEnough.matches && !reducedMotion.matches)

    update()
    wideEnough.addEventListener('change', update)
    reducedMotion.addEventListener('change', update)

    return () => {
      wideEnough.removeEventListener('change', update)
      reducedMotion.removeEventListener('change', update)
    }
  }, [minWidth])

  return enabled
}

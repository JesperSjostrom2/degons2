'use client'

import { useEffect, type ReactNode } from 'react'

import RouteTransitionProvider from '@/components/transition/route-transition-provider'
import RouteCurtain from '@/components/transition/route-curtain'
import { prewarmBelowFoldAssets } from '@/lib/site-preload'

/**
 * The one client component above `children`, and so where the curtain lives.
 *
 * It used to run a preloader: a logo and a progress rail held for 1940ms in front of the home
 * page and nowhere else. That announced a wait rather than performing an arrival, and it was
 * measuring nothing. The curtain that replaced it is the same object used for every navigation,
 * which is the point — landing on the site and moving through it are now one gesture, and a
 * first load is simply the half of it where the curtain lifts.
 *
 * Content still always renders underneath. The curtain is an opaque fixed overlay, so the
 * server HTML carries the whole page and nothing is gated on a timer.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => prewarmBelowFoldAssets(), [])

  return (
    <RouteTransitionProvider>
      {children}
      <RouteCurtain />
    </RouteTransitionProvider>
  )
}

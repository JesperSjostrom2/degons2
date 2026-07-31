'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import SiteLoadReveal from '@/components/site-load-reveal'
import { prewarmBelowFoldAssets } from '@/lib/site-preload'

const LOAD_REVEAL_DURATION_MS = 1940
const LOAD_REVEAL_EXIT_MS = 320

export default function SiteShell({ children }: { children: ReactNode }) {
  // The reveal is the home page's curtain-up — it belongs to the hero it opens onto. On a
  // deep link to /work/<slug> it would just be ~2s of nothing in front of a page that has no
  // such moment, so those routes skip it entirely.
  const isHome = usePathname() === '/'

  // Content always renders — the loader is an opaque fixed overlay on top of it, so the
  // pre-reveal frame is identical while the server HTML carries the full page. Gating the
  // children on a timer here meant the home page server-rendered nothing but the loader.
  const [showLoader, setShowLoader] = useState(isHome)
  const [isLoaderExiting, setIsLoaderExiting] = useState(false)
  const [canExitLoader, setCanExitLoader] = useState(false)

  useEffect(() => prewarmBelowFoldAssets(), [])

  useEffect(() => {
    if (!isHome) {
      setShowLoader(false)
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setCanExitLoader(true)
      setShowLoader(false)
      return
    }

    const loaderExitTimeout = window.setTimeout(() => {
      setCanExitLoader(true)
    }, LOAD_REVEAL_DURATION_MS)

    return () => {
      window.clearTimeout(loaderExitTimeout)
    }
  }, [isHome])

  useEffect(() => {
    if (!showLoader || !canExitLoader) {
      return
    }

    let firstFrame = 0
    let secondFrame = 0
    let removeLoaderTimeout = 0

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setIsLoaderExiting(true)
        window.dispatchEvent(new Event('site-loader-exit'))
        removeLoaderTimeout = window.setTimeout(() => {
          setShowLoader(false)
        }, LOAD_REVEAL_EXIT_MS)
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
      window.clearTimeout(removeLoaderTimeout)
    }
  }, [canExitLoader, showLoader])

  return (
    <>
      {children}
      {showLoader ? <SiteLoadReveal isExiting={isLoaderExiting} /> : null}
    </>
  )
}

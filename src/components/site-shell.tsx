'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import SiteLoadReveal from '@/components/site-load-reveal'
import { prewarmBelowFoldAssets } from '@/lib/site-preload'

const LOAD_REVEAL_DURATION_MS = 1940
const LOAD_CONTENT_PREMOUNT_MS = 860
const LOAD_REVEAL_EXIT_MS = 320

export default function SiteShell({ children }: { children: ReactNode }) {
  // The reveal is the home page's curtain-up — it belongs to the hero it opens onto. On a
  // deep link to /work/<slug> it would just be ~2s of nothing in front of a page that has no
  // such moment, so those routes skip it entirely.
  const isHome = usePathname() === '/'

  const [shouldMountContent, setShouldMountContent] = useState(!isHome)
  const [showLoader, setShowLoader] = useState(isHome)
  const [isLoaderExiting, setIsLoaderExiting] = useState(false)
  const [canExitLoader, setCanExitLoader] = useState(false)

  useEffect(() => prewarmBelowFoldAssets(), [])

  useEffect(() => {
    if (!isHome) {
      setShouldMountContent(true)
      setShowLoader(false)
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setShouldMountContent(true)
      setCanExitLoader(true)
      setShowLoader(false)
      return
    }

    const contentTimeout = window.setTimeout(() => {
      setShouldMountContent(true)
    }, Math.max(0, LOAD_REVEAL_DURATION_MS - LOAD_CONTENT_PREMOUNT_MS))

    const loaderExitTimeout = window.setTimeout(() => {
      setCanExitLoader(true)
    }, LOAD_REVEAL_DURATION_MS)

    return () => {
      window.clearTimeout(contentTimeout)
      window.clearTimeout(loaderExitTimeout)
    }
  }, [isHome])

  useEffect(() => {
    if (!shouldMountContent || !showLoader || !canExitLoader) {
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
  }, [canExitLoader, shouldMountContent, showLoader])

  return (
    <>
      {shouldMountContent ? children : null}
      {showLoader ? <SiteLoadReveal isExiting={isLoaderExiting} /> : null}
    </>
  )
}

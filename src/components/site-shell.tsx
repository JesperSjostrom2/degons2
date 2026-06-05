'use client'

import { useEffect, useState, type ReactNode } from 'react'

import SiteLoadReveal from '@/components/site-load-reveal'
import { prewarmBelowFoldAssets } from '@/lib/site-preload'

const LOAD_REVEAL_DURATION_MS = 1940
const LOAD_CONTENT_PREMOUNT_MS = 860
const LOAD_REVEAL_EXIT_MS = 320

export default function SiteShell({ children }: { children: ReactNode }) {
  const [shouldMountContent, setShouldMountContent] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [isLoaderExiting, setIsLoaderExiting] = useState(false)
  const [canExitLoader, setCanExitLoader] = useState(false)

  useEffect(() => prewarmBelowFoldAssets(), [])

  useEffect(() => {
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
  }, [])

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

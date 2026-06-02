'use client'

import { useEffect, useState, type ReactNode } from 'react'

import SiteLoadReveal from '@/components/site-load-reveal'

const LOAD_REVEAL_DURATION_MS = 1940
const LOAD_REVEAL_EXIT_MS = 320

export default function SiteShell({ children }: { children: ReactNode }) {
  const [shouldMountContent, setShouldMountContent] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [isLoaderExiting, setIsLoaderExiting] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setShouldMountContent(true)
      setShowLoader(false)
      return
    }

    const timeout = window.setTimeout(() => {
      setShouldMountContent(true)
    }, LOAD_REVEAL_DURATION_MS)

    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!shouldMountContent || !showLoader) {
      return
    }

    let firstFrame = 0
    let secondFrame = 0
    let removeLoaderTimeout = 0

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setIsLoaderExiting(true)
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
  }, [shouldMountContent, showLoader])

  return (
    <>
      {shouldMountContent ? children : null}
      {showLoader ? <SiteLoadReveal isExiting={isLoaderExiting} /> : null}
    </>
  )
}

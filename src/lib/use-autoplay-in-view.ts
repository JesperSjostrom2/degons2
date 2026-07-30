'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Plays a muted preview video only while it is on screen, and never at all when the visitor
 * has asked for reduced motion.
 *
 * Returns the ref to put on the element that wraps the video. The video itself is found by
 * the `data-autoplay-preview` attribute, so the caller is free to nest it however it likes —
 * the mac frame has it under a screen layer, ProjectShot has it as a direct sibling of the
 * still.
 *
 * `preload` is only raised to `metadata` at the moment of the first play, so a video that is
 * never scrolled to is never fetched. That matters here: the scroll captures are large.
 */
export const useAutoplayInView = <T extends HTMLElement>(): RefObject<T | null> => {
  const frameRef = useRef<T>(null)
  const [active, setActive] = useState(false)
  const [canAutoplay, setCanAutoplay] = useState(false)

  useEffect(() => {
    const element = frameRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: '200px 0px',
      threshold: 0.05,
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setCanAutoplay(!query.matches)

    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const video = frameRef.current?.querySelector<HTMLVideoElement>('video[data-autoplay-preview]')
    if (!video) return

    if (active && canAutoplay) {
      video.muted = true
      video.preload = 'metadata'
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [active, canAutoplay])

  return frameRef
}

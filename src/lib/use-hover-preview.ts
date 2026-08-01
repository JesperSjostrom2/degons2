'use client'

import { useCallback, useRef, useState } from 'react'

/**
 * The floating preview on a project panel: a scroll capture that starts when the pointer
 * enters the panel and stops when it leaves.
 *
 * Deliberately not `useAutoplayInView`. That one plays a full-bleed video for as long as it is
 * on screen; this one plays a small centred one only while a panel is actually being looked at,
 * which is what lets the index carry three multi-megabyte captures without fetching any of them
 * on load. `preload="none"` holds until the first hover, and nothing is requested before it.
 *
 * `ready` — not `active` — is what the panel styles off. The still stays sharp and unveiled
 * until there are real frames to show, so a slow connection (or a video that never arrives)
 * leaves the panel exactly as it is rather than blurred behind an empty rectangle.
 */
export const useHoverPreview = (src?: string) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  const start = useCallback(() => {
    const video = videoRef.current

    // A pointerenter also arrives from a finger tap, where there is no hover to leave and the
    // preview would stick. Same gate the cursor badge uses.
    if (!video || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    video.muted = true
    video.preload = 'metadata'
    // Every hover opens the capture from the top rather than resuming mid-scroll, which reads
    // as a broken loop.
    video.currentTime = 0
    void video.play().catch(() => undefined)

    // canplay does not fire again once the file is buffered, so a second hover has to read the
    // state off the element instead of waiting for an event that has already been and gone.
    if (video.readyState >= 3) {
      setReady(true)
    }
  }, [])

  const stop = useCallback(() => {
    const video = videoRef.current
    setReady(false)

    if (video) {
      video.pause()
    }
  }, [])

  return {
    ready,
    /** Spread onto the panel link. Focus is included so a keyboard reaches the preview too. */
    hoverProps: src
      ? {
          onPointerEnter: start,
          onPointerLeave: stop,
          onFocus: start,
          onBlur: stop,
        }
      : {},
    videoProps: {
      ref: videoRef,
      onCanPlay: () => setReady(true),
    },
  }
}

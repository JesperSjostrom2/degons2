'use client'

import Image from 'next/image'
import TransitionLink from '@/components/transition/transition-link'
import { useCallback, useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import type { Project } from '@/data/projects'

/** How far the picture may travel from centre, in px, between the ends of the row. Read
 *  against a plate over a thousand px wide, so it is a drift, not a slide. */
const TRACK_RANGE_PX = 44

/**
 * The chain at the foot of a project page. `getNextProject` wraps past the end of the array,
 * so the last project points back at the first and no page dead-ends.
 *
 * At rest it is a hairline, a thumbnail and a name. On hover the row becomes the door: a
 * plate of the next project opens behind the type from a horizon line and runs out past the
 * column the whole page has held to, the thumbnail dissolving into it — same picture, so it
 * reads as one image opening rather than a swap. It never settles while you are there: the
 * picture keeps creeping forward, leans towards the cursor, and the type drifts against it.
 * The full staging is in `globals.css` under "Next project".
 *
 * All this component does is write the cursor's horizontal position across the row to a
 * custom property. What makes it feel like weight rather than a stuck pointer is that each
 * move restarts an eased transition on that value instead of setting the offset outright —
 * so the picture trails the cursor and coasts to a stop after it. Horizontal only: the plate
 * is already opening vertically, and a second vertical term on top of that reads as wobble.
 */
const NextProjectLink = ({ project }: { project: Project }) => {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const portalRef = useRef<HTMLSpanElement>(null)
  const boxRef = useRef<{ left: number; width: number } | null>(null)
  const trackRef = useRef(0)
  const frameRef = useRef(0)
  const flushTrack = useCallback(() => {
    frameRef.current = 0
    rowRef.current?.style.setProperty('--next-track', `${trackRef.current.toFixed(2)}px`)
  }, [])

  const queueTrack = useCallback(
    (next: number) => {
      trackRef.current = next

      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(flushTrack)
      }
    },
    [flushTrack],
  )

  // Measured against the plate, which is what you are pointing at and what the hit box is
  // cut to — measuring the narrower row would peg the lean at its limit as soon as the
  // cursor passed the type. Taken once on the way in: a horizontal box does not change
  // while you are inside it, and one rect per hover beats one per move.
  const handleMouseEnter = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    const plate = portalRef.current?.getBoundingClientRect()
    // Falls back to the row where the plate is not built at all — narrow widths.
    const box = plate?.width ? plate : event.currentTarget.getBoundingClientRect()

    boxRef.current = { left: box.left, width: box.width }
  }, [])

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const box = boxRef.current

      if (!box) return

      const ratio = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1)
      queueTrack((ratio * 2 - 1) * TRACK_RANGE_PX)
    },
    [queueTrack],
  )

  const handleMouseLeave = useCallback(() => queueTrack(0), [queueTrack])

  useEffect(
    () => () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  return (
    <TransitionLink
      ref={rowRef}
      href={`/work/${project.slug}`}
      className="project-page__next group/next"
      style={{ '--project-accent': project.accent } as CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="project-page__next-portal" aria-hidden="true" ref={portalRef}>
        <span className="project-page__next-portal-zoom">
          {/* Centred rather than the cover's own framing, which the thumbnail below still
              honours. The plate is a wide letterbox — about five to one — so a `top`
              framing crops to whatever margin the shot happens to open with, and the
              subject of the picture is what you need to see here. */}
          {/* Loads as the row comes into view, like everything else on the page. The plate
              is shut until you hover, so nothing about its size tells the browser the
              picture is wanted early — which means the first hover after arriving at the
              foot of a page can open onto a picture that is still coming down the wire.
              That is a question of how heavy the covers are, not of this component: see the
              note on `cover` in data/projects.ts. */}
          <Image
            src={project.cover.src}
            alt=""
            fill
            sizes="(max-width: 899px) 92vw, 84rem"
            style={{ objectPosition: 'center' }}
          />
        </span>
        <span className="project-page__next-portal-veil" />
        {/* The type's own backing, kept apart from the veil above because the two answer to
            different things: the veil is the plate's atmosphere and lifts the longer you
            stay, where this has to hold still — every cover here is a screenshot of a site
            that leads with its own white headline, and it lands in exactly the band the
            name sits in. */}
        <span className="project-page__next-portal-scrim" />
      </span>

      <span className="project-page__next-thumb">
        <Image
          src={project.cover.src}
          alt=""
          fill
          sizes="200px"
          style={{ objectPosition: project.cover.objectPosition ?? 'top' }}
        />
      </span>

      <span className="project-page__next-text">
        <span className="project-page__next-label">Next project</span>
        <span className="project-page__next-name">{project.displayName}</span>
      </span>
    </TransitionLink>
  )
}

export default NextProjectLink

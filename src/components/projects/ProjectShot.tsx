'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import type { ProjectShot as Shot } from '@/data/projects'
import { useAutoplayInView } from '@/lib/use-autoplay-in-view'

/**
 * The screenshot tile. When `chrome` is set it gets a browser title bar carrying the real URL,
 * which is what makes a flat screenshot read as a running site rather than a picture.
 *
 * The still is always rendered and is also the video's poster, so a project with no `videoSrc`
 * composes identically to one with — there is no video-shaped hole and no layout branch.
 *
 * Shared by the index panel and the project page; the page just asks for a wider `sizes`.
 * Nothing is ever printed under a shot — the images carry the page on their own.
 */
const ProjectShot = ({
  shot,
  liveLabel,
  sizes = '(max-width: 899px) 92vw, 62vw',
  priority = false,
  cursorZone = false,
}: {
  shot: Shot
  liveLabel: string
  sizes?: string
  priority?: boolean
  /** Marks this shot as a hover target for ProjectCursorBadge. Index cards only —
      the project page has no badge, because there is nothing left to open. */
  cursorZone?: boolean
}) => {
  const frameRef = useAutoplayInView<HTMLDivElement>()

  return (
    <div
      ref={frameRef}
      className="project-card__tile project-card__shot"
      data-project-cursor={cursorZone ? '' : undefined}
    >
      {shot.chrome ? (
        <div className="project-card__chrome" aria-hidden="true">
          <span className="project-card__dots">
            <span />
            <span />
            <span />
          </span>
          <span className="project-card__url">{liveLabel}</span>
        </div>
      ) : null}

      <div
        className="project-card__viewport"
        style={
          shot.aspectRatio ? ({ '--shot-aspect': shot.aspectRatio } as CSSProperties) : undefined
        }
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="project-card__img"
          style={{ objectPosition: shot.objectPosition ?? 'top' }}
        />

        {shot.videoSrc ? (
          <video
            data-autoplay-preview
            className="project-card__video"
            src={shot.videoSrc}
            poster={shot.src}
            muted
            loop
            playsInline
            preload="none"
            aria-label={shot.alt}
            onCanPlay={(event) => event.currentTarget.classList.add('is-ready')}
          />
        ) : null}
      </div>
    </div>
  )
}

export default ProjectShot

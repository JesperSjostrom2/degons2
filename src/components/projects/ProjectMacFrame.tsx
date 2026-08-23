'use client'

import Image from 'next/image'
import { useAutoplayInView } from '@/lib/use-autoplay-in-view'

/**
 * A MacBook with something playing in its screen.
 *
 * `macmockup.webp` has a genuine transparent hole where the screen is — measured at
 * left 13.0773% / top 13.6834% / w 73.8454% / h 72.6061% of the 5781x3676 plate, with square
 * corners. So the video is positioned into that rectangle and the frame is laid on top of it.
 * No mask, no clip-path, and the bezel's rounded corners come free from the PNG.
 *
 * The screen's own inner corners are rounded in CSS instead, on the video rather than on the
 * div holding it: that div is the only opaque thing over a square hole, so rounding it would
 * open four gaps onto the page background.
 *
 * Every capture is recorded at 1368x854 — ratio 1.6019 against the screen's 1.5995 — so the
 * video fills the cutout edge to edge and the 0.15% difference is absorbed as a sub-pixel
 * trim. Re-exporting a capture at a different ratio is what breaks this: anything wider gets
 * cropped at the sides, anything narrower leaves a band of bare screen.
 *
 * Below 900px the frame is hidden and the recording is shown on its own — the plate's bezel
 * and base cost more than they are worth on a phone. The `sizes` hint says so, which is what
 * keeps the preload from pulling a full-width plate for an image that is never painted.
 */
const ProjectMacFrame = ({
  videoSrc,
  videoWebmSrc,
  posterSrc,
  alt,
}: {
  videoSrc: string
  videoWebmSrc?: string
  posterSrc?: string
  alt: string
}) => {
  const frameRef = useAutoplayInView<HTMLDivElement>()

  return (
    <div ref={frameRef} className="project-page__mac">
      <div className="project-page__mac-screen">
        <video
          data-autoplay-preview
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="none"
          aria-label={alt}
        >
          {/* Prefer VP9 when this capture has an explicit encode, otherwise go straight to the
              MP4 without first issuing a guaranteed-to-fail request. */}
          {videoWebmSrc ? <source src={videoWebmSrc} type="video/webm" /> : null}
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      <Image
        src="/assets/projects/shared/macmockup.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 899px) 16px, 93rem"
        className="project-page__mac-frame"
        priority
      />
    </div>
  )
}

export default ProjectMacFrame

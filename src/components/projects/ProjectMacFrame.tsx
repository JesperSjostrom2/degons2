'use client'

import Image from 'next/image'
import { useAutoplayInView } from '@/lib/use-autoplay-in-view'

/**
 * A MacBook with something playing in its screen.
 *
 * `macmockup.png` has a genuine transparent hole where the screen is — measured at
 * left 13.0773% / top 13.6834% / w 73.8454% / h 72.6061% of the 5781x3676 plate, with square
 * corners. So the video is positioned into that rectangle and the frame is laid on top of it.
 * No mask, no clip-path, and the bezel's rounded corners come free from the PNG.
 *
 * The video is scaled to the screen's full width and anchored to the top rather than covering
 * it: the capture is 2.00 wide against a 1.60 screen, so covering would crop about a tenth off
 * each side and clip whatever sits at the edges of the page. The shortfall at the bottom is
 * the screen's own flat dark, which reads as the page continuing below the fold.
 */
const ProjectMacFrame = ({
  videoSrc,
  posterSrc,
  alt,
}: {
  videoSrc: string
  posterSrc?: string
  alt: string
}) => {
  const frameRef = useAutoplayInView<HTMLDivElement>()

  return (
    <div ref={frameRef} className="project-page__mac">
      <div className="project-page__mac-screen">
        <video
          data-autoplay-preview
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="none"
          aria-label={alt}
        />
      </div>

      <Image
        src="/assets/projects/macmockup.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 899px) 92vw, 84rem"
        className="project-page__mac-frame"
        priority
      />
    </div>
  )
}

export default ProjectMacFrame

'use client'

import TransitionLink from '@/components/transition/transition-link'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { cinematicPanel, cinematicViewport } from '@/lib/site-motion'
import type { Project } from '@/data/projects'
import { useHoverPreview } from '@/lib/use-hover-preview'
import ProjectShot from './ProjectShot'

/**
 * One project on the index: a single panel with the screenshot filling it, the name set large
 * over the foot of the picture, and — on hover — the site's own scroll capture playing centred
 * and half-size while the still recedes behind it.
 *
 * The name used to sit in a bar under the tile beside the scope and the year. It read as a file
 * listing: three columns of small type under a picture that was already doing the work. All of
 * it is gone — the scope and the year entirely, and the name onto the image, where it belongs
 * to the project rather than to the layout. The name is now the only thing printed here: no
 * index number, no rule, no arrow. The whole panel is the link, and the cursor badge says so.
 *
 * Hover is one gesture with three parts, and all three are keyed off `is-previewing` — set only
 * once the video actually has frames. Nothing dims or blurs on the promise of a video.
 *
 * Accent discipline (DESIGN.MD §7/§13): --project-accent reaches the hover rim and nothing
 * else. It never becomes a background — this section sits deep in the water column and lifting
 * the backdrop would break the descent. The title is neutral cream.
 */
const ProjectCard = ({ project }: { project: Project }) => {
  const { ready, hoverProps, videoProps } = useHoverPreview(project.previewVideo)

  return (
    <motion.article
      className={`project-card mobile-no-load-animation${ready ? ' is-previewing' : ''}`}
      style={
        {
          '--project-accent': project.accent,
          ...(project.previewAspect ? { '--preview-aspect': project.previewAspect } : {}),
        } as CSSProperties
      }
      variants={cinematicPanel('deep')}
      initial="hidden"
      whileInView="visible"
      viewport={cinematicViewport}
    >
      <TransitionLink href={`/work/${project.slug}`} className="project-card__link group/panel" {...hoverProps}>
        <ProjectShot
          shot={project.cover}
          liveLabel={project.liveLabel}
          cursorZone
          overlay={
            <>
              {project.previewVideo ? (
                <span className="project-card__preview" aria-hidden="true">
                  <span className="project-card__preview-veil" />

                  <span className="project-card__preview-frame">
                    <video
                      {...videoProps}
                      className="project-card__preview-video"
                      muted
                      loop
                      playsInline
                      preload="none"
                    >
                      {/* VP9 beside the mp4 at roughly half the bytes; a browser that cannot
                          play it falls through. Same pair the project page uses. */}
                      <source src={project.previewVideo.replace(/\.mp4$/, '.webm')} type="video/webm" />
                      <source src={project.previewVideo} type="video/mp4" />
                    </video>
                  </span>
                </span>
              ) : null}

              <div className="project-card__caption">
                <h3 className="project-card__title">{project.displayName}</h3>
              </div>
            </>
          }
        />
      </TransitionLink>
    </motion.article>
  )
}

export default ProjectCard

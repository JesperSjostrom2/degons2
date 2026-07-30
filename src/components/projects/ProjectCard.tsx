'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cinematicPanel, cinematicViewport } from '@/lib/site-motion'
import type { Project } from '@/data/projects'
import ProjectShot from './ProjectShot'

/**
 * One project on the index: a single panel, the screenshot filling it, with a thin footer
 * bar carrying the name, the scope and the arrow.
 *
 * The whole panel is the link — the arrow is affordance, not a second hit area. Everything
 * this card used to hold (logo, palette, description, live link) now lives on
 * `/work/[slug]`, where it has the room to be read rather than glanced at.
 *
 * Accent discipline (DESIGN.MD §7/§13): --project-accent reaches the hover rim and nothing
 * else. It never becomes a background — this section sits deep in the water column and
 * lifting the backdrop would break the descent.
 */
const ProjectCard = ({ project }: { project: Project }) => (
  <motion.article
    className="project-card mobile-no-load-animation"
    style={{ '--project-accent': project.accent } as CSSProperties}
    variants={cinematicPanel('deep')}
    initial="hidden"
    whileInView="visible"
    viewport={cinematicViewport}
  >
    <Link href={`/work/${project.slug}`} className="project-card__link group/panel">
      <ProjectShot shot={project.cover} liveLabel={project.liveLabel} />

      <div className="project-card__bar">
        <h3 className="project-card__name">{project.displayName}</h3>

        <span className="project-card__meta">
          <span className="project-card__role">{project.role}</span>
          <span className="project-card__year">{project.year}</span>
        </span>

        <span className="project-card__arrow" aria-hidden="true">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  </motion.article>
)

export default ProjectCard

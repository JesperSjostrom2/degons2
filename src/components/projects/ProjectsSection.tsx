'use client'

import { motion } from 'framer-motion'
import { cinematicHeader, cinematicViewport } from '@/lib/site-motion'
import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import ProjectCursorBadge from './ProjectCursorBadge'

/**
 * `#projects` — one bento card per project, stacked.
 *
 * The id is load-bearing: the navbar's IntersectionObserver keys off it for the active nav state,
 * and globals.css sets containment on it.
 */
const ProjectsSection: React.FC = () => (
  <section id="projects" className="site-section relative isolate">
    <div className="container mx-auto px-6">
      <motion.div
        className="mobile-no-load-animation section-header cinematic-section-header"
        variants={cinematicHeader}
        initial="hidden"
        whileInView="visible"
        viewport={cinematicViewport}
      >
        <h2 className="section-title">Past projects</h2>
      </motion.div>

      <div className="project-cards">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {/* One badge for every card above; it finds them by data-project-cursor. */}
      <ProjectCursorBadge />
    </div>
  </section>
)

export default ProjectsSection

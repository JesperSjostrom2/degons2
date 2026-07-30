import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Project } from '@/data/projects'

/**
 * The chain at the foot of a project page: a thumbnail of where you are going, its name, and
 * the arrow. `getNextProject` wraps past the end of the array, so the last project points back
 * at the first and no page dead-ends.
 */
const NextProjectLink = ({ project }: { project: Project }) => (
  <Link
    href={`/work/${project.slug}`}
    className="project-page__next group/next"
    style={{ '--project-accent': project.accent } as CSSProperties}
  >
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

    <span className="project-page__next-arrow" aria-hidden="true">
      <ArrowUpRight className="h-5 w-5" />
    </span>
  </Link>
)

export default NextProjectLink

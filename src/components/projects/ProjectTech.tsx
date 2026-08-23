import type { CSSProperties } from 'react'
import { techIcons, techLinks } from '@/lib/tech-icons'
import { skillIconColors } from '@/lib/skill-colors'

/**
 * "Built with" — brand marks, no chips, no borders.
 *
 * An unmapped name falls back to its wordmark rather than disappearing, so adding a tech to a
 * project never silently drops it from the row. Each mark links out to that tech's own site
 * when one is known, so the row is a way in, not just a caption.
 */
const ProjectTech = ({ tech }: { tech: string[] }) => (
  <ul className="project-page__tech">
    {tech.map((name) => {
      const Icon = techIcons[name]
      const color = skillIconColors[name]
      const href = techLinks[name]
      const style = color ? ({ '--tech-color': color } as CSSProperties) : undefined

      const content = Icon ? (
        <>
          <Icon aria-hidden="true" />
          <span className="sr-only">{name}</span>
        </>
      ) : (
        <span className="project-page__tech-wordmark">{name}</span>
      )

      return (
        <li key={name} className="project-page__tech-item" style={style}>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
              {content}
            </a>
          ) : (
            content
          )}
        </li>
      )
    })}
  </ul>
)

export default ProjectTech

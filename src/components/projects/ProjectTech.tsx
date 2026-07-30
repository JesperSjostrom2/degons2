import type { CSSProperties } from 'react'
import { techIcons } from '@/lib/tech-icons'
import { skillIconColors } from '@/lib/skill-colors'

/**
 * "Built with" — brand marks, no chips, no borders.
 *
 * An unmapped name falls back to its wordmark rather than disappearing, so adding a tech to a
 * project never silently drops it from the row.
 */
const ProjectTech = ({ tech }: { tech: string[] }) => (
  <ul className="project-page__tech">
    {tech.map((name) => {
      const Icon = techIcons[name]
      const color = skillIconColors[name]

      return (
        <li
          key={name}
          className="project-page__tech-item"
          style={color ? ({ '--tech-color': color } as CSSProperties) : undefined}
        >
          {Icon ? (
            <>
              <Icon aria-hidden="true" />
              <span className="sr-only">{name}</span>
            </>
          ) : (
            <span className="project-page__tech-wordmark">{name}</span>
          )}
        </li>
      )
    })}
  </ul>
)

export default ProjectTech

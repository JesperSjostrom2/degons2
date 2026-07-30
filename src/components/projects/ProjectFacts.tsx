import type { ProjectFact } from '@/data/projects'

/**
 * Project details, stacked in the spec column: label over value, hairline between.
 *
 * Was a horizontal strip fenced top and bottom by rules. In a narrow column the stacked form
 * reads down in one movement instead of asking the eye to pair labels with values across a row.
 */
const ProjectFacts = ({ facts }: { facts: ProjectFact[] }) => (
  <dl className="project-page__facts">
    {facts.map((fact) => (
      <div key={fact.label} className="project-page__fact">
        <dt>{fact.label}</dt>
        <dd>{fact.value}</dd>
      </div>
    ))}
  </dl>
)

export default ProjectFacts

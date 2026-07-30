import Image from 'next/image'
import type { ProjectTypeface } from '@/data/projects'

/**
 * The type specimen block. Each row reads role first — "Headings", "Body" — with the
 * typeface named underneath once it is known.
 *
 * Three ways a face can be shown, in order of honesty:
 *   1. `specimenSrc` — an image of the real face, for licensed families we cannot load.
 *   2. `cssFamily`   — the real face, loaded and rendered live.
 *   3. neither       — the portfolio's own display font stands in. Nothing claims otherwise;
 *                      the name line is simply absent until there is a real name to print.
 */
const ProjectTypography = ({ typography }: { typography: ProjectTypeface[] }) => (
  <div className="project-page__type">
    {typography.map((face) => (
      <div key={face.usage} className="project-page__typeface">
        {face.specimenSrc ? (
          <Image
            src={face.specimenSrc}
            alt={`${face.name ?? face.usage} specimen`}
            width={800}
            height={200}
            className="project-page__specimen-img"
          />
        ) : (
          <p
            className="project-page__specimen"
            style={face.cssFamily ? { fontFamily: face.cssFamily } : undefined}
          >
            Aa
          </p>
        )}

        <div className="project-page__typeface-meta">
          <span className="project-page__typeface-usage">{face.usage}</span>
          {face.name ? <span className="project-page__typeface-name">{face.name}</span> : null}
        </div>
      </div>
    ))}
  </div>
)

export default ProjectTypography

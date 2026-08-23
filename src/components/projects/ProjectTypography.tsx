import Image from 'next/image'
import { Inter, Poppins, Quicksand } from 'next/font/google'
import type { ProjectTypeface } from '@/data/projects'

/**
 * Poppins is what two of the three projects actually set, so the specimens can be drawn in
 * the real face rather than approximated. Declared here rather than in the root layout so
 * the weights are only requested on routes that render a specimen block.
 */
const poppins = Poppins({
  variable: '--font-specimen-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const quicksand = Quicksand({
  variable: '--font-specimen-quicksand',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

const inter = Inter({
  variable: '--font-specimen-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

/**
 * The type specimen block. Each row reads role first — "Headings", "Body" — then names the
 * face and the weight it is set in, since a family alone does not tell you which cut is used.
 *
 * Three ways a face can be shown, in order of honesty:
 *   1. `specimenSrc` — an image of the real face, for licensed families we cannot load.
 *   2. `cssFamily`   — the real face, loaded and rendered live.
 *   3. neither       — the portfolio's own display font stands in. Nothing claims otherwise;
 *                      the name line is simply absent until there is a real name to print.
 */
const ProjectTypography = ({ typography }: { typography: ProjectTypeface[] }) => (
  <div className={`project-page__type ${poppins.variable} ${quicksand.variable} ${inter.variable}`}>
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
            style={{
              ...(face.cssFamily ? { fontFamily: face.cssFamily } : null),
              ...(face.cssWeight ? { fontWeight: face.cssWeight } : null),
            }}
          >
            Aa
          </p>
        )}

        <div className="project-page__typeface-meta">
          <span className="project-page__typeface-usage">{face.usage}</span>
          {face.name ? (
            <span className="project-page__typeface-name">
              {face.name}
              {face.weight ? (
                <span className="project-page__typeface-weight">{face.weight}</span>
              ) : null}
            </span>
          ) : null}
        </div>
      </div>
    ))}
  </div>
)

export default ProjectTypography

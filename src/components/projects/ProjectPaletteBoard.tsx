import type { CSSProperties } from 'react'
import type { ProjectPaletteColor } from '@/data/projects'

/**
 * Relative luminance, so each swatch's own label picks ink or cream and stays legible on top
 * of its colour. Kerma's palette runs #141413 to #f7ead8 in one row, so a single fixed label
 * colour is unreadable on one end or the other whichever way it is set.
 *
 * sRGB coefficients, no gamma correction — the 0.6 threshold is tuned for the palettes in
 * hand rather than for WCAG contrast, which these decorative labels are not claiming to meet.
 */
const isLight = (hex: string) => {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value

  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255

  return 0.299 * r + 0.587 * g + 0.114 * b > 0.6
}

/**
 * The colour block: one large square per swatch, numbered, with the name and hex sitting on
 * the colour itself. Replaces the animated pill — the pill only ever showed colour, and never
 * told you what any of it was.
 */
const ProjectPaletteBoard = ({ palette }: { palette: ProjectPaletteColor[] }) => (
  <ul className="project-page__palette">
    {palette.map((color, index) => (
      <li
        key={color.name}
        className="project-page__swatch"
        data-tone={isLight(color.value) ? 'light' : 'dark'}
        style={{ '--swatch': color.value } as CSSProperties}
      >
        <span className="project-page__swatch-index">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="project-page__swatch-meta">
          <span className="project-page__swatch-name">{color.name}</span>
          <span className="project-page__swatch-hex">{color.value.toUpperCase()}</span>
        </span>
      </li>
    ))}
  </ul>
)

export default ProjectPaletteBoard

import ArrowSwap from './ArrowSwap'

/**
 * The way in, on a project page only. The hero's pill (`site-link-pill.tsx`) is a glass
 * surface with a cream circle that fills the whole face on hover — built for a canvas with
 * one thing on it. Under a project name, next to a page that spends every other button as a
 * hairline rim on its own dark panel (`project-card__tile`, the next-project portal's accent
 * ring), that pill reads as an import rather than something that belongs here.
 *
 * So this is the page's own recipe instead: panel surface, hairline border, the project
 * accent brightening the rim on hover and nothing else — same discipline as everywhere else
 * `--project-accent` is used on this page. The arrow still swaps out right and in from the
 * left, because that gesture is the site's own way of saying "external link", not the hero's.
 */
const ProjectVisitLink = ({ href, label }: { href: string; label: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="project-page__visit">
    <span className="project-page__visit-label">{label}</span>
    <ArrowSwap />
  </a>
)

export default ProjectVisitLink

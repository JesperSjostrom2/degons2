import { ArrowRight } from 'lucide-react'

/**
 * The site's "external link" gesture, stripped down to just the icon: on hover the resting
 * arrow slides out to the right as a second one slides in from the left. No ring, no fill —
 * callers own their own surface (`ProjectVisitLink`'s panel, the next-project row's hairline)
 * and key the swap off their own `:hover`, matched on `.project-page__arrow` in globals.css.
 */
const ArrowSwap = () => (
  <span className="project-page__arrow" aria-hidden="true">
    <ArrowRight />
    <ArrowRight />
  </span>
)

export default ArrowSwap

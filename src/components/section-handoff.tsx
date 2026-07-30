'use client'

import { useEffect } from 'react'
import { takeRequestedSection } from '@/lib/section-handoff'

/**
 * Completes the handoff from a project page: if one asked to land on a section, scroll there
 * once the home page's content is actually in the DOM.
 *
 * Rendered inside `SiteShell`'s children, so mounting already means the loader has released
 * the content. The rAF pair waits for that content to be laid out — the target sits below
 * several `content-visibility: auto` sections, so its offset is not final on the first frame.
 */
const SectionHandoff = () => {
  useEffect(() => {
    const id = takeRequestedSection()
    if (!id) return

    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        const element = document.getElementById(id)
        if (!element) return

        // Instant, not smooth: arriving mid-flight through a page you did not scroll reads
        // as the site losing your place.
        element.scrollIntoView({ behavior: 'auto', block: 'start' })
      })
    })

    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [])

  return null
}

export default SectionHandoff

/**
 * Sending someone from a project page to a section of the home page.
 *
 * A plain `<Link href="/#projects">` does not work here: `smooth-scroll.tsx` only intercepts
 * `a[href^="#"]`, so a cross-page link starting with `/` is a real navigation and never
 * reaches Lenis.
 *
 * So the target is stashed before navigating and picked up by `SectionHandoff` once the home
 * page has actually mounted. sessionStorage rather than a query parameter because the site's
 * own nav never puts section names in the URL — it scrolls with `data-scroll-to` and leaves
 * the address bar alone.
 *
 * The route curtain reads this too: a pending section means the arrival must not be yanked to
 * the top, and because the scroll happens while the curtain is still down, the curtain lifts
 * already on the right section.
 */

export const SECTION_HANDOFF_KEY = 'site:scroll-to-section'

/** Call immediately before navigating to `/`. `id` is the bare id, e.g. 'projects'. */
export const requestSectionOnHome = (id: string) => {
  try {
    window.sessionStorage.setItem(SECTION_HANDOFF_KEY, id)
  } catch {
    // Private mode or storage disabled — the link still navigates home, just without
    // the scroll. Never worth throwing over.
  }
}

/**
 * Read the request without spending it.
 *
 * Deliberately not a take-and-clear: React runs effects twice in development, so a reader
 * that removed the id on its first mount would hand the second mount nothing and never
 * scroll — which is precisely how these links came to look like they did nothing. The id
 * stays put until someone has actually acted on it.
 */
export const peekRequestedSection = () => {
  try {
    return window.sessionStorage.getItem(SECTION_HANDOFF_KEY)
  } catch {
    return null
  }
}

/** Whether an arrival has somewhere of its own to be. Used by the route curtain to decide
 *  against resetting the scroll position under itself. */
export const hasPendingSection = () => peekRequestedSection() !== null

/** Call once the handoff has been honoured, abandoned, or overridden by the reader. */
export const clearRequestedSection = () => {
  try {
    window.sessionStorage.removeItem(SECTION_HANDOFF_KEY)
  } catch {
    // Same as above — never worth throwing over.
  }
}

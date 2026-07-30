/**
 * Sending someone from a project page to a section of the home page.
 *
 * A plain `<Link href="/#projects">` does not work here, for two reasons:
 *   1. `smooth-scroll.tsx` only intercepts `a[href^="#"]`, so a cross-page link starting
 *      with `/` is a real navigation and never reaches Lenis.
 *   2. `SiteShell` keeps the home page's content unmounted for ~1.1s behind the loader, so
 *      on arrival the target element does not exist yet and the browser has nothing to
 *      scroll to.
 *
 * So the target is stashed before navigating and picked up by `SectionHandoff` once the home
 * page has actually mounted. sessionStorage rather than a query parameter because the site's
 * own nav never puts section names in the URL — it scrolls with `data-scroll-to` and leaves
 * the address bar alone.
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

export const takeRequestedSection = () => {
  try {
    const id = window.sessionStorage.getItem(SECTION_HANDOFF_KEY)
    if (id) window.sessionStorage.removeItem(SECTION_HANDOFF_KEY)
    return id
  } catch {
    return null
  }
}

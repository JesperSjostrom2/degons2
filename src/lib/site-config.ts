/**
 * The canonical origin, with the www.
 *
 * The apex 308-redirects here, so a canonical / og:url / sitemap entry written
 * without it points at a redirect rather than at the page — which is the one
 * thing a canonical URL must never do. This was hardcoded seven times across
 * four files, all of them on the apex; keep new ones pointing here instead.
 *
 * The OG card prints the bare domain as display text on purpose — that is how
 * people say it out loud, and it is not a link.
 */
export const SITE_URL = 'https://www.jespersjostrom.com'

/**
 * The nav is a shortcut bar, not a table of contents — `#process` is a whole section and is
 * deliberately not in it.
 *
 * Labels do not have to echo the heading they land on, and a kicker above each h2 restating the
 * nav word is not the fix — that costs a permanent element on seven sections to solve a
 * mismatch in one, and at 12px under a 52px heading it is not what anyone reads on arrival. The
 * active underline is the "you are here"; it lives where the eye already is after a click.
 *
 * `Skills` over `Tech stack` and `Why Me` over `Approach`: both are the shorter, more direct
 * word, and both land somewhere a visitor recognises on sight — a grid of framework logos, and
 * a benefits promise over five benefit cards. `Approach` would also collide with `#process` /
 * "How it works".
 */
export const siteNavItems = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Why Me', href: '#why-me', id: 'why-me' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

export const siteSocialLinks = [
  {
    href: 'https://github.com/jespersjostrom2',
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/jesper-sj%C3%B6str%C3%B6m-521995232/',
    label: 'LinkedIn',
  },
  {
    href: '#contact',
    label: 'Email',
  },
]

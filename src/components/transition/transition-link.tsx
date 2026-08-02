'use client'

import Link from 'next/link'
import { forwardRef, type ComponentProps, type MouseEvent } from 'react'

import { useRouteTransition } from './route-transition-provider'

/**
 * A `next/link` that runs the curtain first.
 *
 * It wraps `Link` rather than replacing it, which matters more than it looks: prefetching,
 * middle-click, ⌘-click, "open in new tab" and the fact that a crawler sees a real `<a href>`
 * are all still the router's job. The only thing added is intercepting the one case where a
 * transition makes sense — an unmodified left click on an internal route that is not the page
 * you are already on. Everything else falls through untouched.
 *
 * No manual prefetch: these routes are statically generated via `generateStaticParams`, and
 * `Link`'s own viewport prefetch already has the payload in hand well before the click.
 */

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

const isPlainLeftClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, onClick, target, ...rest }, ref) => {
    const { navigate } = useRouteTransition()

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      // First, so callers that stash state before navigating — `requestSectionOnHome` on the
      // navbar's Home link — have run by the time the route lands under the curtain.
      onClick?.(event)

      if (event.defaultPrevented) return
      if (target && target !== '_self') return
      if (!isPlainLeftClick(event)) return
      // Internal routes only. External hrefs, `mailto:` and bare hashes are not ours.
      if (!href.startsWith('/')) return

      if (navigate(href)) {
        event.preventDefault()
      }
    }

    return <Link ref={ref} href={href} target={target} onClick={handleClick} {...rest} />
  },
)

TransitionLink.displayName = 'TransitionLink'

export default TransitionLink

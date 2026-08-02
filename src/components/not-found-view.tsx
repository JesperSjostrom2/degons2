'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import MaskedRise from '@/components/masked-rise'
import SiteLinkPill from '@/components/site-link-pill'
import { useRouteTransition } from '@/components/transition/route-transition-provider'
import { resolveRouteTokens, type RouteToken } from '@/lib/route-transition'
import { cinematicEase } from '@/lib/site-motion'

/**
 * Everything inside the 404, and the only thing on the site that has to reveal itself without a
 * scroll to trigger on.
 *
 * The arrival is the hero's, beat for beat: nothing moves until the route curtain reports that
 * it has started lifting, so the numerals rise *behind* the sheet leaving rather than as a
 * second, unrelated animation after it. Reading `phase` rather than listening for a reveal event
 * matters for the same reason it does in `hero.tsx` — a curtain that timed out and lifted early
 * would fire its event at nobody, and this page would sit blank forever.
 */

/** Support copy lands after the numerals have very nearly seated. */
const supportReveal = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, delay: 0.42, ease: cinematicEase },
  },
}

const actionsReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.56, ease: cinematicEase },
  },
}

export default function NotFoundView() {
  const { phase } = useRouteTransition()
  const [shouldReveal, setShouldReveal] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState<boolean | null>(null)
  const [tokens, setTokens] = useState<RouteToken[] | null>(null)

  useEffect(() => {
    const canAnimate =
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    setShouldAnimate(canAnimate)

    if (!canAnimate) {
      setShouldReveal(true)
    }
  }, [])

  useEffect(() => {
    if (phase === 'revealing' || phase === 'idle') {
      setShouldReveal(true)
    }
  }, [phase])

  /**
   * The address that missed, in the curtain's own notation.
   *
   * `location.pathname` rather than `usePathname()`: this file is prerendered as a single static
   * 404 served for every unmatched URL, so the router's idea of where it is says `/_not-found`,
   * not the address the visitor actually typed. Only the browser knows that, and only after
   * mount — hence the reserved row height below, so filling it in shifts nothing.
   */
  useEffect(() => {
    setTokens(resolveRouteTokens(window.location.pathname))
  }, [])

  const animate = shouldAnimate === true ? (shouldReveal ? 'visible' : 'hidden') : undefined
  const initial = shouldAnimate === true ? 'hidden' : false

  return (
    <div className="notfound">
      {/* The site's one light source, doing here what the rays do in the hero: sitting above
          the thing it lights. Everything below falls away from it. */}
      <div className="notfound__glow pointer-events-none" aria-hidden="true" />

      <div className="notfound__body">
        <h1 className="notfound__figure">
          {/* The gradient rides the mask's own span rather than a child of it — see the note on
              `className` in masked-rise.tsx for why a wrapper renders nothing. */}
          <MaskedRise active={shouldReveal} delay={0.06} className="text-gradient-ivory">
            404
          </MaskedRise>
          <span className="sr-only">Page not found</span>
        </h1>

        <motion.div
          className="notfound__support"
          variants={supportReveal}
          initial={initial}
          animate={animate}
        >
          <div className="notfound__rule" aria-hidden="true" />

          {/* Height is held whether or not there is a chip in it — see the effect above. */}
          <div className="notfound__address">
            {tokens ? (
              <p className="notfound__path">
                {tokens.map((token, index) => (
                  <span
                    key={`${token.text}-${index}`}
                    className={token.muted ? 'notfound__path-part is-muted' : 'notfound__path-part'}
                  >
                    {token.text}
                  </span>
                ))}
              </p>
            ) : null}
          </div>

          <p className="notfound__lede">
            There is nothing at this address. The page may have moved, or the link that brought
            you here was wrong.
          </p>
        </motion.div>

        <motion.div
          className="notfound__actions"
          variants={actionsReveal}
          initial={initial}
          animate={animate}
        >
          {/* One way out, deliberately. A second link here only asks someone who has already hit
              a dead end to make a choice about it. */}
          <SiteLinkPill href="/" label="Back to home" />
        </motion.div>
      </div>
    </div>
  )
}

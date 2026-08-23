'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  COVER_MS,
  ROUTE_FALLBACK_MS,
  REDUCED_FADE_MS,
  REVEAL_MS,
  coveredHoldMs,
  TRANSITION_LOCK_EVENT,
  TRANSITION_UNLOCK_EVENT,
  hrefToPathname,
  resolveRouteTokens,
  type RouteToken,
  type TransitionPhase,
} from '@/lib/route-transition'
import { hasPendingSection } from '@/lib/section-handoff'

/**
 * The state machine behind the curtain.
 *
 * The App Router unmounts a route before anything can animate it out, which is why the usual
 * `AnimatePresence` recipes need the private `LayoutRouterContext` to freeze the outgoing tree.
 * This sidesteps that entirely by deferring the navigation instead: the click is intercepted,
 * the curtain covers, and only then does `router.push` fire. Nothing ever has to animate out,
 * so there is no private import to break on the next Next.js release.
 *
 *   navigation:  idle → covering → swapping → revealing → idle
 *   first load:  covering → swapping → revealing → idle
 *
 * Those are the same sequence, which is the whole point — a refresh and a click have to look
 * identical or the transition reads as two different effects wearing the same clothes. The only
 * difference is what happens under the cover: a navigation swaps the route, a first load throws
 * away the backdrop it rose over.
 */

interface RouteTransitionValue {
  phase: TransitionPhase
  tokens: RouteToken[]
  reducedMotion: boolean
  isFirstLoad: boolean
  /** Home is the site itself, so it is named by the wordmark rather than by a route — arriving
   *  there, whether by refresh or by clicking the logo, shows whose site this is. Every other
   *  destination is somewhere *within* it and says so with its path. */
  showWordmark: boolean
  /** Returns true when it has taken the navigation, so the caller knows to preventDefault. */
  navigate: (href: string) => boolean
}

const RouteTransitionContext = createContext<RouteTransitionValue | null>(null)

export const useRouteTransition = () => {
  const value = useContext(RouteTransitionContext)

  if (!value) {
    throw new Error('useRouteTransition must be used inside RouteTransitionProvider')
  }

  return value
}

export default function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  // Seeded `covering`, exactly as a navigation starts. The curtain therefore ships in the
  // server HTML already off-screen below, with an opaque backdrop over the page behind it, and
  // rises the same way it does on every click.
  const [phase, setPhase] = useState<TransitionPhase>('covering')
  const [tokens, setTokens] = useState<RouteToken[]>(() => resolveRouteTokens(pathname ?? '/'))
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  // Set from the *destination* when a navigation starts, not derived from `pathname` — that
  // moves the instant the route commits, which would swap the wordmark for a path halfway
  // through the curtain.
  const [showWordmark, setShowWordmark] = useState(() => (pathname ?? '/') === '/')

  const phaseRef = useRef<TransitionPhase>('covering')
  phaseRef.current = phase

  const pathnameRef = useRef(pathname)
  // How long the covered stretch has to be is a function of how many segments the path has, and
  // both the first-load effect and the swap effect need it from inside stale closures.
  const tokenCountRef = useRef(tokens.length)
  tokenCountRef.current = tokens.length
  const reducedRef = useRef(false)
  const pendingRef = useRef<string | null>(null)
  /** The raw href, hash and all — the pathname alone cannot tell us whether the destination
   *  asked to land somewhere other than the top. */
  const pendingHrefRef = useRef<string | null>(null)
  /** Used to avoid replaying the label's full covered hold after a slow route has already kept
   *  it on screen for longer than that. */
  const navigationStartedAtRef = useRef(0)
  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const after = useCallback((ms: number, run: () => void) => {
    timersRef.current.push(window.setTimeout(run, ms))
  }, [])

  const beginReveal = useCallback(() => {
    phaseRef.current = 'revealing'
    setPhase('revealing')
    // Released at the *start* of the lift, not the end: the page underneath is already on
    // screen and being scrollable is part of it feeling arrived at rather than presented.
    window.dispatchEvent(new Event(TRANSITION_UNLOCK_EVENT))

    after(reducedRef.current ? REDUCED_FADE_MS : REVEAL_MS, () => {
      phaseRef.current = 'idle'
      setPhase('idle')
      setIsFirstLoad(false)
    })
  }, [after])

  // Before the first-load effect on purpose: that one reads `reducedRef` synchronously.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      reducedRef.current = query.matches
      setReducedMotion(query.matches)
    }

    sync()
    query.addEventListener('change', sync)

    return () => query.removeEventListener('change', sync)
  }, [])

  /* First load: the same cover-hold-lift as a navigation, with nothing to navigate to. */
  useEffect(() => {
    if (reducedRef.current) {
      phaseRef.current = 'idle'
      setPhase('idle')
      setIsFirstLoad(false)
      return
    }

    after(COVER_MS, () => {
      // The screen is fully covered now, so the backdrop this rose over can go without ever
      // being seen leaving. What the curtain lifts off is the real page.
      phaseRef.current = 'swapping'
      setPhase('swapping')
      // The same derived hold a navigation uses, so the two really are one animation.
      after(coveredHoldMs(tokenCountRef.current), beginReveal)
    })

    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* The route landing under the curtain. */
  useEffect(() => {
    pathnameRef.current = pathname

    if (pendingRef.current === null) return
    if (pathname !== pendingRef.current) return

    const landedWithHash = pendingHrefRef.current?.includes('#') ?? false

    pendingRef.current = null
    pendingHrefRef.current = null

    // Normally under an opaque curtain, so it is never seen. Skipped whenever the destination
    // asked to land somewhere specific — a pending section, or a hash in the href — because
    // both scroll while the curtain is still down, so it lifts already on the right part of the
    // page instead of scrolling visibly after arrival.
    if (!landedWithHash && !hasPendingSection()) {
      window.scrollTo(0, 0)
    }

    // Kills the hard-navigation fallback, which has now done its job by not firing.
    clearTimers()

    if (phaseRef.current !== 'swapping') return

    // The label's hold is measured from the click, not from the eventual route commit. On a
    // slow route it has already had more than enough time to settle, so reveal immediately
    // instead of adding another half-second to an unavoidable wait.
    const minimumCoveredMs = reducedRef.current
      ? REDUCED_FADE_MS
      : COVER_MS + coveredHoldMs(tokenCountRef.current)
    const elapsedMs = performance.now() - navigationStartedAtRef.current
    after(Math.max(0, minimumCoveredMs - elapsedMs), beginReveal)
  }, [pathname, after, beginReveal, clearTimers])

  const navigate = useCallback(
    (href: string) => {
      const current = phaseRef.current

      // A click while the curtain is lifting is a real thing people do — the navbar is legible
      // again well before the panel has left. Rather than let that fall through to a raw,
      // uncurtained jump, the curtain simply comes back down from wherever it had got to.
      //
      // While it is *down* — covering, swapping — the screen is fully covered, so any click is
      // either mistimed or programmatic. Swallow it: doing nothing beats teleporting.
      if (current !== 'idle' && current !== 'revealing') return true

      const target = hrefToPathname(href)

      // Same page: nothing to transition to. Handing it back means an in-page hash link still
      // reaches `smooth-scroll`'s handler instead of being swallowed here.
      if (target === pathnameRef.current) return false

      clearTimers()
      pendingRef.current = target
      pendingHrefRef.current = href
      navigationStartedAtRef.current = performance.now()
      setTokens(resolveRouteTokens(target))
      setShowWordmark(target === '/')
      // Clicking away during the opening lift ends the first load then and there, so its
      // backdrop cannot reappear behind a curtain that is now going somewhere.
      setIsFirstLoad(false)
      // Update synchronously as well as through React. This closes the double-click window and
      // ensures an already-prefetched route cannot commit before the landing effect sees the
      // swapping phase.
      phaseRef.current = 'covering'
      setPhase('covering')
      window.dispatchEvent(new Event(TRANSITION_LOCK_EVENT))

      after(reducedRef.current ? REDUCED_FADE_MS : COVER_MS, () => {
        phaseRef.current = 'swapping'
        setPhase('swapping')
        router.push(href)

        // If the client router genuinely stalls, keep the page covered and use the anchor's
        // normal browser-navigation semantics as the recovery path. Lifting here used to show
        // the old page again after 900ms, which made a slow-but-valid navigation look like the
        // click had done nothing before it finally committed in the open.
        after(ROUTE_FALLBACK_MS, () => {
          if (phaseRef.current !== 'swapping') return
          if (pendingRef.current !== target) return
          window.location.assign(href)
        })
      })

      return true
    },
    [after, clearTimers, router],
  )

  useEffect(() => clearTimers, [clearTimers])

  return (
    <RouteTransitionContext.Provider
      value={{
        phase,
        tokens,
        reducedMotion,
        isFirstLoad,
        showWordmark,
        navigate,
      }}
    >
      {children}
    </RouteTransitionContext.Provider>
  )
}

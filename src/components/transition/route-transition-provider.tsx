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
  CURTAIN_REVEAL_EVENT,
  REDUCED_FADE_MS,
  REVEAL_MS,
  SWAP_TIMEOUT_MS,
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
  /** Arriving at the site introduces it; moving through it says where you are going. Only the
   *  very first sight of the home page gets the wordmark — a deep link to a project still names
   *  that project, which is the whole reason those intros exist. */
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
  // Captured once. `pathname` moves the instant a navigation commits, and the wordmark must not
  // follow it.
  const [landedOn] = useState(pathname)

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
  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const after = useCallback((ms: number, run: () => void) => {
    timersRef.current.push(window.setTimeout(run, ms))
  }, [])

  const beginReveal = useCallback(() => {
    setPhase('revealing')
    // The hero waits on this before revealing itself — the same contract the old loader had.
    window.dispatchEvent(new Event(CURTAIN_REVEAL_EVENT))
    // Released at the *start* of the lift, not the end: the page underneath is already on
    // screen and being scrollable is part of it feeling arrived at rather than presented.
    window.dispatchEvent(new Event(TRANSITION_UNLOCK_EVENT))

    after(reducedRef.current ? REDUCED_FADE_MS : REVEAL_MS, () => {
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
      setPhase('idle')
      setIsFirstLoad(false)
      return
    }

    after(COVER_MS, () => {
      // The screen is fully covered now, so the backdrop this rose over can go without ever
      // being seen leaving. What the curtain lifts off is the real page.
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

    if (phaseRef.current !== 'swapping') return
    if (pendingRef.current === null) return
    if (pathname !== pendingRef.current) return

    const landedWithHash = pendingHrefRef.current?.includes('#') ?? false

    pendingRef.current = null
    pendingHrefRef.current = null
    // Kills the stranded-curtain safety net below, which has now done its job by not firing.
    clearTimers()

    // Under an opaque curtain, so it is never seen. Skipped whenever the destination asked to
    // land somewhere specific — a pending section, or a hash in the href — because both scroll
    // while the curtain is still down, so it lifts already on the right part of the page
    // instead of scrolling visibly after arrival.
    if (!landedWithHash && !hasPendingSection()) {
      window.scrollTo(0, 0)
    }

    after(reducedRef.current ? 0 : coveredHoldMs(tokenCountRef.current), beginReveal)
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
      setTokens(resolveRouteTokens(target))
      // Clicking away during the opening lift ends the first load then and there, so the
      // wordmark cannot bleed into a curtain that is now going somewhere.
      setIsFirstLoad(false)
      setPhase('covering')
      window.dispatchEvent(new Event(TRANSITION_LOCK_EVENT))

      after(reducedRef.current ? REDUCED_FADE_MS : COVER_MS, () => {
        setPhase('swapping')
        router.push(href)

        // A stranded curtain is a broken site; lifting early is only an ugly one.
        after(SWAP_TIMEOUT_MS, () => {
          if (phaseRef.current !== 'swapping') return
          pendingRef.current = null
          pendingHrefRef.current = null
          beginReveal()
        })
      })

      return true
    },
    [after, beginReveal, clearTimers, router],
  )

  useEffect(() => clearTimers, [clearTimers])

  return (
    <RouteTransitionContext.Provider
      value={{
        phase,
        tokens,
        reducedMotion,
        isFirstLoad,
        showWordmark: isFirstLoad && landedOn === '/',
        navigate,
      }}
    >
      {children}
    </RouteTransitionContext.Provider>
  )
}

/**
 * The numbers, the geometry and the label behind the route curtain.
 *
 * Deliberately free of React imports, like `data/projects.ts` — the timings are read by the
 * provider, the path builder by the curtain, and the label resolver by both, so none of it
 * should be tied to a component.
 *
 * Everything about how the transition *feels* is a constant in this file. If it wants to be
 * faster, it is edited here and nowhere else.
 */

import { SITE_URL } from '@/lib/site-config'

export type TransitionPhase =
  /** Nothing on screen. The resting state. */
  | 'idle'
  /** Curtain rising over the page you are leaving. */
  | 'covering'
  /** Curtain down, route swapping underneath. */
  | 'swapping'
  /** Curtain lifting off the page you arrived at. */
  | 'revealing'

/* --- Timings ------------------------------------------------------------------------------ */

/** Panel travel on the way in. The `router.push` fires the moment this ends. */
export const COVER_MS = 340
/** The belly finishes flattening after the panel has seated, so the curve trails rather than
 *  arriving as one rigid shape. */
export const COVER_BELLY_LAG_MS = 50
export const LABEL_IN_MS = 300
export const LABEL_IN_DELAY_MS = 70
/** Gap between one segment of the path and the next. */
export const LABEL_STAGGER_MS = 40
/** The last segment is the one that names where you are going, so it gets its own, slower beat
 *  rather than being the fastest thing on screen by accident of ordering. */
export const LABEL_LAST_IN_MS = 400
/**
 * And it waits for the sheet to stop moving first.
 *
 * Taken from its place in the stagger it began at ~230ms, while the sheet was still rising, so
 * the destination appeared *behind* the main movement and you never saw it switch. Measured
 * from the seat instead, it is the only thing on screen when it happens.
 */
export const LABEL_LAST_DELAY_MS = 80
/** How long the whole path sits fully settled before the sheet takes it away. */
export const LABEL_SETTLED_MS = 100
export const LABEL_OUT_MS = 200
export const REVEAL_MS = 400

/**
 * The belly is a swell, not a state.
 *
 * Both of these are fractions of the run they belong to — where the curve is at its deepest, and
 * (on the way out) when it is flat again. It has to grow out of the screen edge rather than
 * appear at full depth on the sheet's first frame, and it has to be gone by the time the sheet's
 * trailing edge crosses the opposite edge, or the curve is still bulging into the viewport at
 * the moment the curtain unmounts and the shape reads as vanishing rather than leaving.
 */
export const COVER_BELLY_PEAK = 0.28
export const REVEAL_BELLY_PEAK = 0.4
/** Tuned against `CURTAIN_CLEARANCE_PX` and `curtainEase` below: about where the sheet's bottom
 *  edge reaches the top of the screen. */
export const REVEAL_BELLY_GONE = 0.74

/** Floor on the covered stretch, for the degenerate case of a route with nothing to say. */
const COVERED_HOLD_MIN_MS = 60

/**
 * When a given segment starts moving, measured from the moment the curtain mounts.
 *
 * Exported so the component and the hold arithmetic below read from one source — they are the
 * two halves of the same timing and drifting apart is precisely how the last segment came to be
 * cut off the first time.
 */
export const tokenDelayMs = (index: number, tokenCount: number) =>
  index === tokenCount - 1
    ? COVER_MS + LABEL_LAST_DELAY_MS
    : LABEL_IN_DELAY_MS + index * LABEL_STAGGER_MS

/** When the whole path has finished arriving. Normally the last segment, but a deep enough
 *  route could in principle have its run-up still going, so take whichever lands later. */
const labelSettleMs = (tokenCount: number) =>
  Math.max(
    COVER_MS + LABEL_LAST_DELAY_MS + LABEL_LAST_IN_MS,
    LABEL_IN_DELAY_MS + Math.max(0, tokenCount - 2) * LABEL_STAGGER_MS + LABEL_IN_MS,
  )

/**
 * How long to stay covered once the sheet has seated.
 *
 * Derived rather than a constant, because a fixed hold and a staggered label drift apart the
 * moment either is edited — which is exactly what went wrong: the hold was 60ms, the label did
 * not finish arriving for another 280ms, and the last segment was struck off the screen part
 * way through appearing. Deeper routes now hold longer on their own.
 */
export const coveredHoldMs = (tokenCount: number) =>
  Math.max(COVERED_HOLD_MIN_MS, labelSettleMs(tokenCount) + LABEL_SETTLED_MS - COVER_MS)

/**
 * If the App Router has still not committed after this long, fall back to a regular browser
 * navigation. The curtain stays seated while we wait: revealing the route being left makes a
 * slow navigation look like a dead click, then lets the new page appear later with no
 * transition at all.
 */
export const ROUTE_FALLBACK_MS = 5000
/** Reduced motion keeps a transition, but a crossfade rather than a large directional travel —
 *  the translate is the part that carries vestibular risk, not the existence of the curtain. */
export const REDUCED_FADE_MS = 120

/* --- Geometry ----------------------------------------------------------------------------- */

/** How far the sheet overhangs the viewport top and bottom, so the belly always has room to
 *  bulge into. Fixed rather than derived, so the SVG's box never has to resize. */
export const CURTAIN_INSET_PX = 260
const BELLY_RATIO = 0.28

/**
 * How far past the top of the screen the sheet keeps going on the way out.
 *
 * `translateY(-100%)` moves the panel by exactly its own height, which parks its bottom edge on
 * the top of the viewport — and `curtainEase` spends its last hundred milliseconds crawling
 * through the final few pixels of that. The overshoot puts the end of the travel, and that
 * crawl, off-screen: what you see is an edge leaving at speed.
 */
export const CURTAIN_CLEARANCE_PX = 72

/** The overshoot as a percentage of viewport height, since the sheet's travel is expressed in
 *  percentages of itself and the two have to be the same unit to animate together. */
export const curtainExitPercent = (height: number) =>
  100 + (CURTAIN_CLEARANCE_PX / Math.max(height, 1)) * 100

/** Depth of the bulge for a given viewport width. Narrow screens get a shallower curve out of
 *  the ratio rather than out of a breakpoint. */
export const resolveBelly = (width: number) =>
  Math.round(Math.min(CURTAIN_INSET_PX, width * BELLY_RATIO))

/**
 * One path, both edges. `belly` is the only thing that animates: at 0 this is a plain
 * rectangle, and at full depth the top edge bulges up by that much and the bottom edge down by
 * the same, so the sheet reads as one surface under tension rather than two separate curves.
 *
 * Drawn in a coordinate space inset by `CURTAIN_INSET_PX` top and bottom, which is exactly how
 * the SVG is positioned. No stroke: the sheet is a light plane on a dark site, so the shape is
 * carried by the fill. An outline drew a hard line across the top and bottom of the screen
 * whenever the sheet was seated, which is the last thing this wants.
 */
export const buildCurtainPath = (width: number, height: number, belly: number) => {
  const top = CURTAIN_INSET_PX
  const bottom = top + height
  const mid = width / 2

  return `M 0 ${top} Q ${mid} ${top - belly} ${width} ${top} L ${width} ${bottom} Q ${mid} ${bottom + belly} 0 ${bottom} Z`
}

/* --- The label ------------------------------------------------------------------------------ */

/**
 * The transition says where you are going by showing the route itself. It is the one piece of
 * copy on the site that writes itself: no headline to keep in sync with `data/projects.ts`, no
 * index to renumber, and it is honest about the thing it is doing.
 */
export interface RouteToken {
  text: string
  /** Structure — the domain and the separators — sits back so the segments read first. */
  muted: boolean
}

/** Bare, no protocol and no `www` — the same display form the OG card uses. */
const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, '').replace(/^www\./, '')

/** Query strings and hashes are not part of which page you are going to. */
export const hrefToPathname = (href: string) => {
  const path = href.split('#')[0].split('?')[0]

  if (!path) return '/'

  // Trailing slashes off, but never turn '/' into ''.
  return path.length > 1 ? path.replace(/\/+$/, '') || '/' : path
}

/**
 * `jespersjostrom.com` + `/` + `work` + `/` + `kerma`, as separate tokens so each can rise on
 * its own beat.
 *
 * Home is the one case with no segments to speak of, so its lone slash takes the emphasis
 * instead — otherwise the whole label would be muted and there would be nothing to look at.
 */
export const resolveRouteTokens = (pathname: string): RouteToken[] => {
  const segments = pathname.split('/').filter(Boolean)
  const tokens: RouteToken[] = [{ text: SITE_DOMAIN, muted: true }]

  if (segments.length === 0) {
    return [...tokens, { text: '/', muted: false }]
  }

  for (const segment of segments) {
    tokens.push({ text: '/', muted: true })
    tokens.push({ text: segment, muted: false })
  }

  return tokens
}

/* --- Events ---------------------------------------------------------------------------------- */

/**
 * `smooth-scroll.tsx` listens for these and stops/starts Lenis. An event rather than a shared
 * instance because Lenis is created per page and has no handle to reach for.
 *
 * Note these are fire-and-forget on purpose: both are safe to miss, because a Lenis that was
 * never stopped does not need starting. Anything that must *not* miss the moment should read
 * `phase` from the provider instead — `hero.tsx` used to listen for a reveal event here and
 * could mount after it had already fired, leaving the hero invisible for good.
 */
export const TRANSITION_LOCK_EVENT = 'route-transition-lock'
export const TRANSITION_UNLOCK_EVENT = 'route-transition-unlock'

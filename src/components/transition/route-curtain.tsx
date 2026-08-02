'use client'

import Image from 'next/image'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { cinematicEase, curtainEase } from '@/lib/site-motion'
import {
  COVER_BELLY_LAG_MS,
  COVER_MS,
  CURTAIN_INSET_PX,
  LABEL_IN_MS,
  LABEL_LAST_IN_MS,
  LABEL_OUT_MS,
  REDUCED_FADE_MS,
  REVEAL_MS,
  buildCurtainPath,
  resolveBelly,
  tokenDelayMs,
  type RouteToken,
  type TransitionPhase,
} from '@/lib/route-transition'
import { useRouteTransition } from './route-transition-provider'

/**
 * The curtain itself: a bone sheet whose leading edge is a quadratic curve that flattens as it
 * seats and bows again as it leaves.
 *
 * The whole shape is one animated number — `belly`, the depth of the bulge. The sheet's travel
 * is a separate transform, and the two are offset by `COVER_BELLY_LAG_MS` so the curve trails
 * the sheet instead of arriving welded to it.
 *
 * It is light on a dark site rather than dark on dark, which is the only reason any of the
 * shape is legible; the first version matched `--sky` and the curve may as well not have been
 * drawn. Nothing here is outlined — the fill does all of it.
 */

/** Only ever seen before hydration, when the belly is flat and the path is a rectangle — so the
 *  numbers do not have to be right, only present. `preserveAspectRatio="none"` stretches that
 *  rectangle to fit whatever the viewport actually is. */
const SSR_VIEWPORT = { width: 1440, height: 900 }

export default function RouteCurtain() {
  const { phase, tokens, reducedMotion, isFirstLoad, showWordmark } = useRouteTransition()

  if (phase === 'idle') return null

  return (
    <>
      {/* What a first load's sheet rises over, so a refresh gets the same rise as a click
          instead of joining the animation halfway through. It is thrown away under full cover,
          so what the curtain lifts off is always the real page. */}
      {isFirstLoad && phase === 'covering' ? (
        <div className="route-curtain-backdrop" aria-hidden="true" />
      ) : null}
      <Curtain
        phase={phase}
        tokens={tokens}
        reducedMotion={reducedMotion}
        isFirstLoad={isFirstLoad}
        showWordmark={showWordmark}
      />
    </>
  )
}

function Curtain({
  phase,
  tokens,
  reducedMotion,
  isFirstLoad,
  showWordmark,
}: {
  phase: TransitionPhase
  tokens: RouteToken[]
  reducedMotion: boolean
  isFirstLoad: boolean
  showWordmark: boolean
}) {
  const previousPhase = useRef<TransitionPhase | null>(null)
  const belly = useMotionValue(0)

  // The viewport feeds the path as motion values rather than through the closure, so the
  // transformer stays pure. Closing over React state here meant a resize mid-transition could
  // leave `d` describing the old viewport while the `viewBox` attribute had already moved to
  // the new one — the sheet would stop short of the bottom of the screen.
  const viewportWidth = useMotionValue(SSR_VIEWPORT.width)
  const viewportHeight = useMotionValue(SSR_VIEWPORT.height)
  const path = useTransform<number, string>(
    [belly, viewportWidth, viewportHeight],
    ([depth, width, height]) => buildCurtainPath(width, height, depth),
  )

  // Mirrored into state only because the `viewBox` attribute is plain React and has to re-render.
  const [viewBox, setViewBox] = useState(SSR_VIEWPORT)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const width = window.innerWidth
      const height = window.innerHeight

      viewportWidth.set(width)
      viewportHeight.set(height)
      setViewBox({ width, height })
    }

    const queue = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('resize', queue)

    return () => {
      window.removeEventListener('resize', queue)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [viewportWidth, viewportHeight])

  useEffect(() => {
    const cameFrom = previousPhase.current
    previousPhase.current = phase

    if (reducedMotion) {
      belly.set(0)
      return
    }

    const depth = resolveBelly(viewBox.width)

    if (phase === 'covering') {
      // Arriving from off-screen, the curve starts at full depth and flattens as it seats.
      // Coming back down over a curtain that was already lifting keeps the curve it had, so
      // reversing mid-flight does not pop.
      if (cameFrom === null) belly.set(depth)

      const controls = animate(belly, 0, {
        duration: COVER_MS / 1000,
        delay: COVER_BELLY_LAG_MS / 1000,
        ease: curtainEase,
      })

      return () => controls.stop()
    }

    if (phase === 'revealing') {
      const controls = animate(belly, depth, {
        duration: REVEAL_MS / 1000,
        ease: curtainEase,
      })

      return () => controls.stop()
    }

    belly.set(0)
  }, [phase, viewBox.width, reducedMotion, belly])

  const isLeaving = phase === 'revealing'

  /* Reduced motion keeps the curtain and what it carries, but drops every translate — the large
     directional move is the part that carries vestibular risk, not the transition existing. The
     sheet crossfades and the label simply rides it, in place. */
  const sheetMotion = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: isLeaving ? 0 : 1 },
        transition: { duration: REDUCED_FADE_MS / 1000, ease: 'linear' as const },
      }
    : {
        initial: { y: '100%' },
        animate: { y: isLeaving ? '-100%' : '0%' },
        transition: { duration: (isLeaving ? REVEAL_MS : COVER_MS) / 1000, ease: curtainEase },
      }

  /** The masked rise shared by every route segment and by the wordmark, so the two are the same
   *  gesture with different things inside it. */
  const maskMotion = (index: number, count: number) => {
    if (reducedMotion) {
      return { initial: { y: '0%' }, animate: { y: '0%' }, transition: { duration: 0 } }
    }

    const isLast = index === count - 1

    return {
      initial: { y: '110%' },
      animate: { y: isLeaving ? '-110%' : '0%' },
      transition: {
        duration: (isLeaving ? LABEL_OUT_MS : isLast ? LABEL_LAST_IN_MS : LABEL_IN_MS) / 1000,
        // On the way out they leave together: staggering an exit reads as the label falling
        // apart rather than being taken away.
        delay: isLeaving ? 0 : tokenDelayMs(index, count) / 1000,
        ease: cinematicEase,
      },
    }
  }

  return (
    <motion.div
      aria-hidden="true"
      className="route-curtain"
      // Read by the reduced-motion rule in globals.css, which hides the first-load curtain
      // before hydration can unmount it but leaves navigation crossfades alone.
      data-first-load={isFirstLoad}
      {...sheetMotion}
    >
      <svg
        className="route-curtain__sheet"
        viewBox={`0 0 ${viewBox.width} ${viewBox.height + CURTAIN_INSET_PX * 2}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <motion.path d={path} fill="var(--curtain-bg)" />
      </svg>

      {showWordmark ? (
        // The first sight of the site says whose it is, on the same beat and out of the same
        // kind of mask a route segment uses — identical motion, different content.
        <span className="route-curtain__clip">
          <motion.span className="route-curtain__mark" {...maskMotion(0, 1)}>
            <Image
              src="/assets/logotransparent.png"
              alt=""
              fill
              sizes="(max-width: 620px) 62vw, 384px"
              priority
              style={{ objectFit: 'cover' }}
            />
          </motion.span>
        </span>
      ) : (
        /* Explicit per-token delays rather than `staggerChildren`. Orchestration variants have
           to propagate down through the clipping wrapper, and inside a parent that is already
           animating a transform of its own that chain silently did nothing — every segment sat
           at its hidden offset for the whole transition. Arithmetic is duller and it runs. */
        <p className="route-curtain__route">
          {tokens.map((token, index) => (
            // Tokens are positional and repeat (`/` twice), so the index is the identity.
            <span key={`${index}-${token.text}`} className="route-curtain__clip">
              <motion.span
                className={
                  token.muted
                    ? 'route-curtain__seg route-curtain__seg--muted'
                    : 'route-curtain__seg'
                }
                {...maskMotion(index, tokens.length)}
              >
                {token.text}
              </motion.span>
            </span>
          ))}
        </p>
      )}
    </motion.div>
  )
}

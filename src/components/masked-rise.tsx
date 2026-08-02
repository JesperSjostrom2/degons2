'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { cinematicEase, cinematicViewport } from '@/lib/site-motion'

/**
 * Content rising out of a hard mask — the route curtain's gesture, off the curtain.
 *
 * `maskMotion` in `transition/route-curtain.tsx` is the original: a clip with `overflow: hidden`
 * and content translating 110% → 0 with *no opacity change*. That is the whole reason the
 * transition reads as something being uncovered rather than something fading up, and until now
 * it existed only inside the curtain — so the curtain lifted, and the page underneath then
 * introduced itself in a completely different language (expo-out, small travel, mostly fade).
 * This is that language put back in one place so section titles can speak it too.
 *
 * The split is deliberate: titles rise out of masks, supporting text still fades and drifts via
 * `ScrollReveal` / `cinematicHeader`. Everything getting the mask would flatten the hierarchy
 * the curtain already establishes between a label and the sheet carrying it.
 */

/** One number, one place. The curtain's own label is 300–400ms, but it travels a line of text;
 *  a display heading travelling its own much greater height at that speed reads as a twitch. */
export const MASKED_RISE_MS = 620

/**
 * Three states, not two, because the width can only be known after mount.
 *
 * `null` is the first paint, and it renders no inline transform at all — the parked position in
 * `.masked-rise__inner` applies, and the media query beside it un-parks the text below 768px or
 * under reduced motion. That is the pre-hydration guard, and it is the only thing standing
 * between a JS-less visitor and an invisible heading.
 *
 * Once the width resolves, the answer is stated inline. Committing to `transform: none` any
 * earlier would show every heading at rest for a frame and then drop it back down to 110% as
 * framer took over — the exact flash the CSS parking exists to prevent.
 */
export default function MaskedRise({
  children,
  delay = 0,
  active,
  className,
}: {
  children: ReactNode
  delay?: number
  /**
   * Overrides the scroll trigger. Left undefined — the normal case — the mask opens when it
   * scrolls into view. The 404 page passes it because there is nothing to scroll: its heading
   * is centre-screen at mount, so an in-view trigger would fire and finish while the route
   * curtain was still down and the gesture would never be seen. There, the curtain's own phase
   * is the cue.
   */
  active?: boolean
  /**
   * Extra classes for the travelling span, not the mask.
   *
   * It exists for one narrow reason, and it is a browser bug rather than a style preference:
   * `background-clip: text` does not paint on a *descendant* of an element carrying
   * `will-change: transform`, which `.masked-rise__inner` carries permanently. Wrapping the
   * children in a `.text-gradient-*` span therefore renders nothing at all — transparent fill
   * over a gradient that was never drawn. Put the gradient on the transformed element itself
   * and it paints. Anything gradient-clipped inside a mask has to come through here.
   */
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()
  const [isWideEnough, setIsWideEnough] = useState<boolean | null>(null)
  const clipRef = useRef<HTMLSpanElement>(null)

  /**
   * The mask is watched, not the thing inside it.
   *
   * `whileInView` on the inner span looked right and never fired: the inner sits a full 110%
   * of its own height below the mask, so the box the observer measures is an entire heading
   * lower than the heading appears. Against `cinematicViewport`'s -16% bottom margin it was
   * still "below the fold" at the exact moment the title was centre-screen, and the text just
   * stayed parked. The clip is the element actually in the layout, so it is the one to ask.
   */
  const isInView = useInView(clipRef, cinematicViewport)
  const isRevealed = active ?? isInView

  /**
   * Subscribed, not sampled once.
   *
   * Reading the width a single time on mount is enough for the hero, whose elements degrade to
   * "already in place" if the answer goes stale. It is not enough here: the parked position
   * lives in CSS, so a window dragged from 700px to 1200px would leave the media query no
   * longer matching *and* no framer instance to animate — the heading would simply stay 110%
   * down and never come back. Width and reduced motion only; nothing here probes the device.
   */
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsWideEnough(query.matches)

    sync()
    query.addEventListener('change', sync)

    return () => query.removeEventListener('change', sync)
  }, [])

  /* The ref rides every branch. `useInView` attaches its observer once, on mount, and the ref
     object's identity never changes — so if the clip only carried it in the animated branch the
     observer would be set up against a null element on the first commit and never retried. */
  if (isWideEnough !== true || shouldReduceMotion) {
    return (
      <span ref={clipRef} className="masked-rise">
        <span
          className={className ? `masked-rise__inner ${className}` : 'masked-rise__inner'}
          /* Stated inline only once the width is known, so correctness after mount never depends
             on the media query in globals.css still agreeing about what "mobile" means. Two
             rules that have to stay in step are two rules that can drift, and the failure mode
             here is an invisible heading rather than a merely wrong-looking one. */
          style={isWideEnough === null ? undefined : { transform: 'none' }}
        >
          {children}
        </span>
      </span>
    )
  }

  return (
    <span ref={clipRef} className="masked-rise">
      <motion.span
        className={className ? `masked-rise__inner ${className}` : 'masked-rise__inner'}
        initial={{ y: '110%' }}
        animate={{ y: isRevealed ? '0%' : '110%' }}
        transition={{ duration: MASKED_RISE_MS / 1000, delay, ease: cinematicEase }}
      >
        {children}
      </motion.span>
    </span>
  )
}

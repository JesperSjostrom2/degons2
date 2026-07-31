'use client'

type NavigatorWithPerformanceHints = Navigator & {
  connection?: {
    saveData?: boolean
  }
}

/**
 * Whether this visitor should get the motion-heavy version of the site.
 *
 * This used to answer the question by measuring. It waited for `load`, settled
 * for 150ms, then timed 350ms of frames and refused if the average missed 28ms
 * or any single frame missed 112ms — caching a pass in sessionStorage. It also
 * refused outright on `hardwareConcurrency <= 2`, `deviceMemory <= 2`, or the
 * combination of four cores and 4GB.
 *
 * All of that is gone, because the measurement could not distinguish the thing
 * it was trying to measure. Its sampling window lands on hydration, font swap
 * and the loader's exit animation, which is the busiest the page ever gets, so
 * a fast desktop fails it routinely in production while passing on a warm dev
 * page. The hero's light rays were invisible on the live site for exactly this
 * reason. A probe that fires when the page is busiest tells you the page is
 * busy — not that the machine is slow.
 *
 * What is left is declarative and honest: two signals the user has actually
 * expressed, read at call time, no cache and no race. The device heuristics
 * went with it — core count and RAM are a poor proxy for GPU compositing, and
 * every caller is already gated on something that predicts the load far
 * better. `smooth-scroll` only reaches here after excluding coarse pointers
 * and narrow viewports, so Lenis was never being offered to a phone; the light
 * rays are desktop-width only; the custom cursor requires a fine pointer.
 *
 * Still async so the three call sites keep their shape, and so this can grow a
 * real asynchronous signal later without another refactor.
 */
export const shouldUseEnhancedMotion = async () => {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  // Data Saver is a deliberate request to be sent less, and these effects all
  // cost bytes: a WebGL bundle, a shader, an extra rAF loop.
  if ((navigator as NavigatorWithPerformanceHints).connection?.saveData) {
    return false
  }

  return true
}

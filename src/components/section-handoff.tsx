'use client'

import { useEffect } from 'react'
import { clearRequestedSection, peekRequestedSection } from '@/lib/section-handoff'

/**
 * Completes the handoff from a project page: if one asked to land on a section, scroll there
 * once the home page's content is actually in the DOM.
 *
 * A single attempt on mount was not enough, and that is why these links looked like they
 * "did nothing" — they navigated home and left you at the top. Three things can still be
 * true a frame after mount: the target is not in the DOM yet, it sits below
 * `content-visibility: auto` sections whose height is not final so its offset is wrong, or
 * the router's own scroll-to-top for the new route runs after us and undoes it.
 *
 * So it re-asserts on a short poll until the target has held its place twice, then gives up
 * after a budget. Two details are deliberate:
 *
 *   · The request is not spent until it has been honoured or abandoned. React runs effects
 *     twice in development, and a reader that cleared the id on its first mount would hand
 *     the second mount nothing.
 *   · A timer, not `requestAnimationFrame`. rAF does not fire while the document is hidden,
 *     so a link opened into a background tab would never arrive anywhere.
 *
 * Any real scroll input cancels it outright — once someone has taken hold of the page,
 * moving it under them is worse than missing the section.
 */
const SectionHandoff = () => {
  useEffect(() => {
    const id = peekRequestedSection()
    if (!id) return

    let timer = 0
    let settledChecks = 0
    // Set when the loop actually starts, not at mount: a deferred start would otherwise
    // begin with its budget already spent.
    let deadline = 0

    /** Stand down without spending the request — React's second mount will pick it up. */
    const stop = () => {
      window.clearTimeout(timer)
      timer = 0
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('keydown', cancel)
      document.removeEventListener('visibilitychange', onVisible)
    }

    /** Done with it, one way or another. */
    const finish = () => {
      clearRequestedSection()
      stop()
    }

    const cancel = () => finish()

    const attempt = () => {
      const element = document.getElementById(id)

      if (element) {
        const offset = element.getBoundingClientRect().top

        // Within a pixel or two of the top counts as arrived; browsers do not land
        // exactly on 0 at fractional device pixel ratios.
        if (Math.abs(offset) <= 2) {
          settledChecks += 1

          if (settledChecks >= 2) {
            finish()
            return
          }
        } else {
          settledChecks = 0
          // Instant, not smooth: arriving mid-flight through a page you did not scroll
          // reads as the site losing your place.
          element.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
      }

      if (performance.now() >= deadline) {
        // One last assertion before giving up, so the budget running out cannot leave the
        // page parked halfway between the top and the section.
        element?.scrollIntoView({ behavior: 'auto', block: 'start' })
        finish()
        return
      }

      timer = window.setTimeout(attempt, 60)
    }

    /**
     * Timers are throttled to about a second in a background tab, which would spend the
     * whole budget on two or three tries and land short. Nothing needs scrolling while
     * nobody is looking, so wait for the tab to be shown and start the clock then.
     */
    const start = () => {
      if (document.hidden) {
        document.addEventListener('visibilitychange', onVisible, { once: true })
        return
      }

      deadline = performance.now() + 2500
      attempt()
    }

    function onVisible() {
      start()
    }

    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('keydown', cancel)
    start()

    // Unmount only stands down; it does not spend the request.
    return stop
  }, [])

  return null
}

export default SectionHandoff

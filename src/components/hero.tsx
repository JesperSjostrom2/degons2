'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Copy } from 'lucide-react'

import { useEnhancedVisuals } from '@/lib/use-enhanced-visuals'
import { cinematicEase, curtainEase } from '@/lib/site-motion'
import { useRouteTransition } from '@/components/transition/route-transition-provider'
import MaskedRise from '@/components/masked-rise'

const SideRays = dynamic(() => import('@/components/SideRays'), {
  ssr: false,
  loading: () => null,
})

/**
 * The hero's arrival, timed against the curtain that hands off to it.
 *
 * The curtain is gone 400ms after it starts lifting (`REVEAL_MS`). This chain used to still be
 * running at ~2.97s — the planet alone was 2.35s on a 0.62s delay — so a brisk, weighted
 * transition handed the page to something four times slower and the two read as unrelated
 * events. Everything below now lands inside ~1.6s, which is close enough to the curtain's own
 * pace that the lift and the arrival read as one move.
 */
/** Each headline line gets the curtain's own gesture — the mask it revealed its own route
 *  label through, staggered the same way rather than fading up as a block. Support copy is
 *  not text alone (it carries the CTA buttons too), so it keeps a plain rise instead of a mask. */
const HERO_LINE_DELAYS = [0.08, 0.17, 0.26]

const heroSupportReveal = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      delay: 0.34,
      ease: cinematicEase,
    },
  },
}

export default function Hero() {
  const [copied, setCopied] = useState(false)
  const [shouldRevealHero, setShouldRevealHero] = useState(false)
  const [shouldAnimateHero, setShouldAnimateHero] = useState<boolean | null>(null)
  const showLightRays = useEnhancedVisuals()
  const { phase: curtainPhase } = useRouteTransition()

  useEffect(() => {
    const canAnimateHero = window.matchMedia('(min-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    setShouldAnimateHero(canAnimateHero)

    if (!canAnimateHero) {
      setShouldRevealHero(true)
    }
  }, [])

  /**
   * The hero waits for the curtain to start lifting, then comes up behind it.
   *
   * This reads the phase rather than listening for a one-shot event, because the event could
   * fire before this component existed. When a route took longer to land than the curtain's
   * safety timeout, the curtain lifted on its own, the event went out to nobody, and the home
   * page then mounted *during* the lift — finding a curtain still in the DOM, subscribing, and
   * waiting for something that had already happened. The hero never appeared.
   *
   * A phase cannot be missed the way an event can: arriving late simply reads `revealing` or
   * `idle` and shows itself at once.
   */
  useEffect(() => {
    if (curtainPhase === 'revealing' || curtainPhase === 'idle') {
      setShouldRevealHero(true)
    }
  }, [curtainPhase])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('contact@jespersjostrom.com')
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 3000)
    } catch (error) {
      console.error('Failed to copy email', error)
    }
  }

  return (
    <section id="home" className="hero-grain-density relative min-h-screen">
      {/* Background & Atmosphere Layers */}
      <div className="absolute inset-0 z-0 h-full w-full" style={{ minHeight: '100vh' }}>
        {showLightRays && (
          <div className="hero-light-rays h-full w-full">
            <SideRays
              origin="top-right"
              rayColor1="#dac5a7"
              rayColor2="#f5efe4"
              speed={0.7}
              intensity={0.9}
              spread={1.7}
              tilt={-4}
              saturation={0.5}
              blend={0.6}
              /* Brightness is intensity / distance^falloff, so a lower exponent
                 flattens the curve: the corner hot-spot dims a little and the
                 far field carries much further. This is what lengthens the
                 rays — the mask in globals.css sets how far they may go. */
              falloff={1.95}
              opacity={0.5}
              className="h-full w-full"
            />
          </div>
        )}
      </div>

      {/* No vignette and no atmosphere tint here on purpose. Both were
          full-bleed layers bounded by the hero, so they gave it a colour of
          its own and a visible seam where they masked out. The rays are the
          only light source in the hero. */}
      <div className="hero-atmosphere-dust pointer-events-none absolute inset-0 z-[1]" />

      <div className="container relative z-10 mx-auto flex min-h-screen items-center px-6 pb-12 pt-24 md:pb-16 md:pt-32">
        <div className="relative mx-auto flex w-full max-w-7xl -translate-y-6 flex-col items-center text-center md:-translate-y-8">
          <div className="mobile-no-load-animation relative w-full max-w-6xl hero-cinematic-reveal">

            <h1 className="mx-auto max-w-[1080px] text-balance text-[clamp(2.45rem,5.6vw,5.1rem)] font-semibold leading-[1.02] tracking-[-0.055em] drop-shadow-[0_18px_60px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
              <span className="block">
                <MaskedRise active={shouldRevealHero} delay={HERO_LINE_DELAYS[0]}>
                  <span className="text-gradient-ivory">Hi, I&apos;m</span> <span className="text-gradient-jesper">Jesper.</span>
                </MaskedRise>
              </span>
              <span className="block">
                <MaskedRise active={shouldRevealHero} delay={HERO_LINE_DELAYS[1]}>
                  <span className="text-gradient-ivory">I build</span>{' '}
                  <span className="space-micro-planet-inline" />{' '}
                  <span className="relative inline-block text-gradient-ivory">
                    websites
                  </span>
                </MaskedRise>
              </span>
              <span className="block">
                <MaskedRise active={shouldRevealHero} delay={HERO_LINE_DELAYS[2]}>
                  <span className="text-gradient-ivory">from idea to</span>{' '}
                  <span className="inline-block text-gradient-ivory">
                    launch.
                  </span>
                </MaskedRise>
              </span>
            </h1>
          </div>

          <div className="relative z-20 mt-8 md:mt-10">
            <motion.div
              variants={heroSupportReveal}
              initial={shouldAnimateHero === true ? 'hidden' : false}
              animate={shouldAnimateHero === true ? (shouldRevealHero ? 'visible' : 'hidden') : undefined}
              className="mobile-no-load-animation flex max-w-3xl flex-col items-center gap-6 will-change-[transform,opacity]"
            >
              <p className="max-w-2xl text-balance text-base leading-7 md:text-lg text-gradient-muted">
                A frontend developer in Helsinki building landing pages, portfolios, and polished websites for people who need a stronger presence online.
              </p>
              <div className="mt-4 flex w-full flex-col items-center gap-5 sm:mt-0 sm:w-auto sm:flex-row sm:gap-0">
                <a href="#contact" className="group/cta inline-flex relative">
                  <div className="absolute inset-0 rounded-full bg-[#dac5a7]/5 opacity-20 blur-xl transition-all duration-500 group-hover/cta:opacity-40" />

                  <div className="relative flex h-[48px] items-center overflow-hidden rounded-full border border-[#dac5a7]/20 bg-[#141413]/40 pl-8 pr-1.5 text-base font-medium text-[#f5efe4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group-hover/cta:border-[#f5efe4]/70">
                    <span className="absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-[#f5efe4] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:right-0 group-hover/cta:h-full group-hover/cta:w-full" />
                    <span className="relative z-10 mr-5 tracking-tight transition-colors duration-300 group-hover/cta:text-[#141413]">Start a Project</span>
                    <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[#141413]">
                      <ArrowRight className="absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-5 group-hover/cta:opacity-0" />
                      <ArrowRight className="absolute h-4 w-4 -translate-x-5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-0 group-hover/cta:opacity-100" />
                    </span>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="group mx-auto mt-1 inline-flex cursor-pointer items-center justify-start gap-3 pl-6 text-sm font-medium text-[color:var(--site-text)]/90 transition-colors duration-200 hover:text-accent sm:mx-0 sm:mt-0 w-[260px]"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.div
                        key="copied"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        className="flex items-center gap-2"
                      >
                        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0">
                          <path
                            d="M3.5 8.5 6.5 11.5 12.5 5.5"
                            fill="none"
                            stroke="#4ade80"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="hero-copy-check-path"
                          />
                        </svg>
                        <span className="whitespace-nowrap">Copied to clipboard</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="email"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4 shrink-0" />
                        <span className="whitespace-nowrap">contact@jespersjostrom.com</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {shouldAnimateHero === null ? null : (
        <>
          {/* The planet's atmosphere. Box classes are the planet's own, so the
              two ellipses share a centre; scale(1.9) then grows it about that
              centre, which is what puts the rim at a known 52.6% of the halo's
              radius for the gradient in globals.css. Keep the two boxes in
              step — if the planet's geometry changes, this changes with it or
              the glow stops being concentric with the limb.

              A sibling rather than a child, so the planet's 2.35s y/scale
              entry never re-rasters it; this one only fades in. */}
          <motion.div
            className="planet-horizon-halo pointer-events-none absolute bottom-[-10.25rem] left-1/2 z-[9] h-[16rem] w-[100vw] max-w-[100vw] md:bottom-[-22rem] md:h-[28rem] md:w-[96vw] md:max-w-[1320px] lg:w-[118vw]"
            initial={shouldAnimateHero ? { opacity: 0 } : false}
            animate={shouldAnimateHero ? (shouldRevealHero ? { opacity: 1 } : { opacity: 0 }) : undefined}
            transition={{ duration: 1.0, delay: 0.55, ease: cinematicEase }}
            style={{ transform: 'translateX(-50%) scale(1.9)' }}
          />

          <motion.div
            className="planet-horizon pointer-events-none absolute bottom-[-10.25rem] left-1/2 z-10 h-[16rem] w-[100vw] max-w-[100vw] md:bottom-[-22rem] md:h-[28rem] md:w-[96vw] md:max-w-[1320px] lg:w-[118vw]"
            initial={shouldAnimateHero ? { y: 96, scale: 0.84 } : false}
            animate={shouldAnimateHero ? (shouldRevealHero ? { y: 0, scale: 1 } : { y: 96, scale: 0.84 }) : undefined}
            /* `curtainEase` rather than a bespoke curve: this is a large mass travelling and
               then stopping, which is exactly what that easing was written for (see
               site-motion.ts), and it is the curve the curtain that just lifted was using. The
               planet arriving is the last beat of the transition, not a separate animation. */
            transition={{ duration: 1.3, delay: 0.3, ease: curtainEase }}
            style={{ x: '-50%', transformOrigin: '50% 60%' }}
          />
        </>
      )}
    </section>
  )
}

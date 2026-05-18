'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { ArrowRight, Copy } from 'lucide-react'

import LightRays from '@/components/LightRays'

export default function Hero() {
  const [showLightRays, setShowLightRays] = useState(false)
  const [copied, setCopied] = useState(false)
  const planetY = useMotionValue(0)

  // Mouse parallax for the orbital sphere
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const shouldReduceMotion = useReducedMotion()

  const sphereX = useSpring(useTransform(mouseX, [-1000, 1000], [-0.8, 0.8]), { stiffness: 25, damping: 25 })
  const sphereY = useSpring(useTransform(mouseY, [-1000, 1000], [-0.8, 0.8]), { stiffness: 25, damping: 25 })

  useEffect(() => {
    const mouseQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)')

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }

    const updateMouseTracking = () => {
      if (mouseQuery.matches) {
        window.addEventListener('mousemove', handleMouseMove)
        return
      }

      window.removeEventListener('mousemove', handleMouseMove)
      mouseX.set(0)
      mouseY.set(0)
    }

    updateMouseTracking()
    mouseQuery.addEventListener('change', updateMouseTracking)

    return () => {
      mouseQuery.removeEventListener('change', updateMouseTracking)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)')
    let frameId = 0
    let isListening = false
    let isPlanetSettled = false

    const updatePlanetPosition = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
      planetY.set(Math.min(progress / 0.32, 1) * 135)
    }

    const schedulePlanetPosition = () => {
      if (!desktopQuery.matches || shouldReduceMotion) return
      const isPastHero = window.scrollY > window.innerHeight * 1.6

      if (isPastHero) {
        if (!isPlanetSettled) {
          planetY.set(135)
          isPlanetSettled = true
        }

        return
      }

      isPlanetSettled = false
      if (frameId) return

      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        updatePlanetPosition()
      })
    }

    const updateAvailability = () => {
      if (desktopQuery.matches && !shouldReduceMotion) {
        if (!isListening) {
          window.addEventListener('scroll', schedulePlanetPosition, { passive: true })
          window.addEventListener('resize', schedulePlanetPosition)
          isListening = true
        }

        schedulePlanetPosition()
        return
      }

      if (isListening) {
        window.removeEventListener('scroll', schedulePlanetPosition)
        window.removeEventListener('resize', schedulePlanetPosition)
        isListening = false
      }

      window.cancelAnimationFrame(frameId)
      frameId = 0
      planetY.set(0)
    }

    updateAvailability()
    desktopQuery.addEventListener('change', updateAvailability)

    return () => {
      desktopQuery.removeEventListener('change', updateAvailability)
      window.removeEventListener('scroll', schedulePlanetPosition)
      window.removeEventListener('resize', schedulePlanetPosition)
      window.cancelAnimationFrame(frameId)
    }
  }, [planetY, shouldReduceMotion])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateLightRays = () => setShowLightRays(mediaQuery.matches)

    updateLightRays()
    mediaQuery.addEventListener('change', updateLightRays)

    return () => {
      mediaQuery.removeEventListener('change', updateLightRays)
    }
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('contact@jespersjostrom.se')
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
        {showLightRays ? (
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.62}
            lightSpread={0.56}
            rayLength={2.1}
            pulsating={false}
            fadeDistance={1.34}
            saturation={0.68}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0}
            distortion={0}
            className="h-full w-full opacity-10 saturate-125 dark:opacity-26 dark:saturate-95"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_0%,rgba(218,197,167,0.18),transparent_42%),radial-gradient(circle_at_80%_22%,rgba(168,140,98,0.10),transparent_32%)]" />
        )}
      </div>

      <div className="hero-vignette" />
      <div className="hero-atmosphere-foreground pointer-events-none absolute inset-0 z-[1]" />
      <div className="hero-atmosphere-dust pointer-events-none absolute inset-0 z-[1]" />

      <div className="container relative z-10 mx-auto flex min-h-screen items-center px-6 pb-12 pt-24 md:pb-16 md:pt-32">
        <div className="relative mx-auto flex w-full max-w-7xl -translate-y-6 flex-col items-center text-center md:-translate-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-6xl"
          >

            <h1 className="mx-auto max-w-[1080px] text-balance text-[clamp(2.45rem,5.6vw,5.1rem)] font-semibold leading-[1.02] tracking-[-0.055em] drop-shadow-[0_18px_60px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_18px_60px_rgba(0,0,0,0.38)] hero-headline-bloom">
              <span className="text-gradient-ivory">Hi, I&apos;m</span> <span className="text-gradient-jesper">Jesper.</span>
              <br />
              <span className="text-gradient-ivory">I build</span>{' '}
              <motion.span
                className="space-micro-planet-inline mx-2 md:mx-3"
                animate={!shouldReduceMotion ? {
                  y: [-0.6, 0.6, -0.6],
                  rotate: [0, 360],
                } : {}}
                transition={{
                  y: { duration: 15, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 140, repeat: Infinity, ease: "linear" }
                }}
                style={{
                  x: (!shouldReduceMotion && showLightRays) ? sphereX : 0,
                  y: (!shouldReduceMotion && showLightRays) ? sphereY : 0,
                }}
              />{' '}
              <span className="relative inline-block text-gradient-ivory">
                websites
              </span>
              <br />
              <span className="text-gradient-ivory">you actually</span>{' '}
              <span className="relative inline-block text-gradient-trust">
                deserve.
                <motion.svg
                  width="100%"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute -bottom-[0.15em] left-0 z-0"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ delay: 1.8, duration: 2.5, ease: "easeOut" }}
                  style={{ filter: 'blur(0.8px) drop-shadow(0 0 10px rgba(218, 197, 167, 0.18))' }}
                >
                  <path
                    d="M10 9C50 5 150 5 190 9"
                    stroke="url(#underline-gradient-trust)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underline-gradient-trust" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#dac5a7" stopOpacity="0" />
                      <stop offset="0.15" stopColor="#dac5a7" stopOpacity="0.45" />
                      <stop offset="0.5" stopColor="#f5efe4" stopOpacity="0.9" />
                      <stop offset="0.85" stopColor="#dac5a7" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#dac5a7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45 }}
            className="relative z-20 mt-8 flex max-w-3xl flex-col items-center gap-6 md:mt-10"
          >
            <p className="max-w-2xl text-balance text-base leading-7 md:text-lg text-gradient-muted">
              A frontend developer in Helsinki building landing pages, portfolios, and polished websites for people who need a stronger presence online.
            </p>
            <div className="flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-0">
              <a href="#contact" className="group/cta inline-flex relative">
                {/* Extremely subtle ambient glow */}
                <div className="absolute inset-0 rounded-full bg-[#dac5a7]/5 opacity-20 blur-xl transition-all duration-500 group-hover/cta:opacity-40" />

                <div className="relative flex h-[46px] items-center gap-3 rounded-full border border-[#dac5a7]/20 bg-[#141413]/40 backdrop-blur-md px-8 text-base font-medium text-[#f5efe4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover/cta:bg-[#141413]/60 group-hover/cta:border-[#dac5a7]/40 hover:scale-[1.02] active:scale-[0.98]">
                  <span className="tracking-tight">Start a Project</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </div>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="group mx-auto inline-flex items-center justify-start gap-3 pl-6 text-sm font-medium text-[color:var(--site-text)]/90 transition-colors duration-200 hover:text-accent sm:mx-0 w-[260px]"
                title="Copy email address"
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
                      <span className="whitespace-nowrap">contact@jespersjostrom.se</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="planet-horizon pointer-events-none absolute bottom-[-13rem] left-1/2 z-10 h-[20rem] w-[96vw] max-w-[1320px] md:bottom-[-22rem] md:h-[28rem] md:w-[118vw]"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 1.65, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ x: '-50%', y: planetY }}
      />
    </section>
  )
}

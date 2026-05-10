'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { ArrowRight, Copy } from 'lucide-react'

import GlareHover from '@/components/GlareHover'
import LightRays from '@/components/LightRays'

export default function Hero() {
  const [showLightRays, setShowLightRays] = useState(false)
  const [copied, setCopied] = useState(false)
  const { scrollYProgress } = useScroll()
  const planetY = useTransform(scrollYProgress, [0, 0.32], [0, 135])
  const microPlanetY = useTransform(scrollYProgress, [0, 0.32], [0, -72])
  
  // Mouse parallax for the orbital sphere
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const shouldReduceMotion = useReducedMotion()
  
  const sphereX = useSpring(useTransform(mouseX, [-1000, 1000], [-0.8, 0.8]), { stiffness: 25, damping: 25 })
  const sphereY = useSpring(useTransform(mouseY, [-1000, 1000], [-0.8, 0.8]), { stiffness: 25, damping: 25 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

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
      }, 1600)
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
            {/* Planet with Haze wrapper */}
            <motion.div 
              className="absolute left-[13%] top-[3%] hidden md:block"
              style={{ y: microPlanetY }}
            >
              <div className="planet-glow-haze" />
              <div className="space-micro-planet" />
            </motion.div>

            <h1 className="mx-auto max-w-[1080px] text-balance text-[clamp(2.45rem,5.6vw,5.1rem)] font-semibold leading-[1.02] tracking-[-0.055em] drop-shadow-[0_18px_60px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_18px_60px_rgba(0,0,0,0.38)] hero-headline-bloom">
              <span className="text-gradient-ivory">Hi, I&apos;m</span> <span className="text-gradient-jesper">Jesper.</span>
              <br />
              <span className="text-gradient-ivory">I build</span>{' '}
              <motion.span 
                className="space-micro-planet-inline mx-2 md:mx-3"
                animate={!shouldReduceMotion ? { 
                  y: [-0.6, 0.6, -0.6],
                } : {}}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                style={{
                  x: (!shouldReduceMotion && showLightRays) ? sphereX : 0,
                  y: (!shouldReduceMotion && showLightRays) ? sphereY : 0,
                }}
              />{' '}
              <span className="relative inline-block text-gradient-ivory">
                websites
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 300 34"
                  className="pointer-events-none absolute -bottom-[0.17em] left-1/2 h-[0.18em] w-[110%] -translate-x-1/2 overflow-visible text-[#dac5a7]"
                  preserveAspectRatio="none"
                  initial={{ clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ clipPath: 'inset(0 0% 0 0)' }}
                  transition={{ duration: 1.35, delay: 1.6, ease: [0.65, 0, 0.35, 1] }}
                >
                  <path
                    d="M4 24 C42 4, 151 7, 296 13 C221 14, 108 18, 19 29 C9 30, 2 29, 4 24 Z"
                    fill="currentColor"
                    opacity="0.45"
                  />
                  <path
                    d="M55 7 C118 5, 199 6, 287 12 C204 10, 123 10, 55 12 Z"
                    fill="var(--site-bg-deep)"
                    opacity="0.2"
                  />
                </motion.svg>
              </span>
              <br />
              <span className="text-gradient-ivory">people quickly</span>{' '}
              <span className="text-gradient-trust">trust.</span>
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
            <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <a href="#contact" className="inline-flex">
                <GlareHover
                  width="auto"
                  height="auto"
                  background="#dac5a7"
                  borderRadius="20px"
                  borderColor="#dac5a7"
                  className="relative cursor-pointer text-black transition-all duration-300 hover:!bg-none hover:!bg-transparent hover:!border-accent hover:text-[color:var(--site-text)] dark:hover:text-white"
                >
                  <span className="flex h-[42px] cursor-pointer items-center gap-3 rounded-[20px] px-7 text-base font-medium">
                    Start a Project
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </GlareHover>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="group mx-auto inline-flex items-center justify-center gap-2 text-center text-sm font-medium text-[color:var(--site-text)]/90 transition-colors duration-200 hover:text-accent sm:mx-0 sm:justify-start sm:text-left"
                title="Copy email address"
              >
                {copied ? (
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
                ) : (
                  <Copy className="h-4 w-4 shrink-0" />
                )}
                <span className="whitespace-nowrap">{copied ? 'Copied to clipboard' : 'contact@jespersjostrom.se'}</span>
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

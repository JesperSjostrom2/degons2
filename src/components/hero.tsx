'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

import GlareHover from '@/components/GlareHover'
import LightRays from '@/components/LightRays'

export default function Hero() {
  const [showLightRays, setShowLightRays] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateLightRays = () => setShowLightRays(mediaQuery.matches)

    updateLightRays()
    mediaQuery.addEventListener('change', updateLightRays)

    return () => mediaQuery.removeEventListener('change', updateLightRays)
  }, [])

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative min-h-screen overflow-hidden noise">
      <div className="absolute inset-0 z-0 h-full w-full" style={{ minHeight: '100vh' }}>
        {showLightRays ? (
          <LightRays
            raysOrigin="top-center"
            raysColor="#dac5a7"
            raysSpeed={1}
            lightSpread={0.8}
            rayLength={3}
            pulsating={false}
            fadeDistance={1.5}
            saturation={1}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0}
            distortion={0}
            className="h-full w-full opacity-80"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_0%,rgba(218,197,167,0.16),transparent_42%),radial-gradient(circle_at_80%_22%,rgba(168,140,98,0.08),transparent_32%)]" />
        )}
      </div>

      <div className="container relative z-10 mx-auto flex min-h-screen items-center px-6 pb-16 pt-28 md:pt-32">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#dac5a7]/80 shadow-[0_0_38px_rgba(218,197,167,0.08)] backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_18px_rgba(74,222,128,0.55)]" />
            Frontend systems with product taste
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-6xl"
          >
            <div className="pointer-events-none absolute left-[14%] top-[4%] hidden h-7 w-10 rotate-[-3deg] rounded-[48%_52%_46%_54%/56%_44%_56%_44%] border border-[#dac5a7]/18 bg-gradient-to-br from-[#c2a77b] to-[#8b7355] shadow-[0_0_18px_rgba(218,197,167,0.12)] md:block" />

            <h1 className="mx-auto max-w-[1080px] text-balance text-[clamp(2.2rem,5.2vw,5.1rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#f5efe4] drop-shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
              <span>Hi, I&apos;m</span>{' '}
              <span className="mx-1.5 inline-block h-[1.08em] w-[1.08em] translate-y-[0.16em] rounded-full border border-[#dac5a7]/30 bg-[#20201d] shadow-[inset_0_1px_0_rgba(245,239,228,0.12),0_0_22px_rgba(218,197,167,0.12)]" />{' '}
              <span className="text-[#dac5a7]">Jesper.</span>
              <br />
              <span>I design</span>{' '}
              <span className="mx-1.5 inline-flex h-[0.3em] w-[0.64em] translate-y-[-0.04em] rotate-[-2deg] rounded-[46%_54%_50%_50%/58%_42%_58%_42%] border border-[#dac5a7]/16 bg-gradient-to-br from-[#c2a77b] to-[#8b7355] shadow-[0_0_16px_rgba(218,197,167,0.10)]" />{' '}
              <span className="relative inline-block">
                interfaces
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 34"
                  className="pointer-events-none absolute -bottom-[0.17em] left-1/2 h-[0.18em] w-[110%] -translate-x-1/2 overflow-visible text-[#dac5a7]"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 24 C42 4, 151 7, 296 13 C221 14, 108 18, 19 29 C9 30, 2 29, 4 24 Z"
                    fill="currentColor"
                    opacity="0.95"
                  />
                  <path
                    d="M55 7 C118 5, 199 6, 287 12 C204 10, 123 10, 55 12 Z"
                    fill="#141413"
                    opacity="0.22"
                  />
                </svg>
              </span>
              <br />
              <span>that help products</span>{' '}
              <span className="group/card relative mx-2 inline-flex h-[0.82em] w-[1.18em] translate-y-[0.12em] overflow-visible rounded-[0.2em] align-baseline">
                <span className="relative overflow-hidden rounded-[0.2em] border border-[#dac5a7]/20 bg-[#20201d] shadow-[0_10px_24px_rgba(0,0,0,0.30)] transition-transform duration-300 ease-out group-hover/card:-translate-y-[0.14em]">
                  <Image
                    src="/assets/projects/kerma.png"
                    alt="Kerma project preview"
                    width={120}
                    height={84}
                    priority
                    className="h-full w-full object-cover"
                  />
                </span>
              </span>{' '}
              <span className="text-[#dac5a7]">grow.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45 }}
            className="relative z-20 mt-8 flex max-w-3xl flex-col items-center gap-6 md:mt-10"
          >
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <div className="inline-flex" onClick={scrollToContact}>
                <GlareHover
                  width="auto"
                  height="auto"
                  background="#dac5a7"
                  borderRadius="20px"
                  borderColor="#dac5a7"
                  className="relative cursor-pointer px-8 py-2 text-lg font-medium text-[#141413] transition-all duration-300 hover:!border-[#f5efe4] hover:!bg-[#f5efe4]"
                >
                  Let&apos;s Connect
                </GlareHover>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-[#dac5a7]/60 to-transparent" />
    </section>
  )
}

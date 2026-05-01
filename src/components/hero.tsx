'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Copy } from 'lucide-react'

import GlareHover from '@/components/GlareHover'
import LightRays from '@/components/LightRays'

export default function Hero() {
  const [showLightRays, setShowLightRays] = useState(false)
  const [copied, setCopied] = useState(false)

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

      const notification = document.createElement('div')
      notification.className = 'fixed bottom-24 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transform translate-y-full transition-transform duration-300'
      notification.style.background = '#2a2a2a'
      notification.style.border = '1px solid #4a4a4a'
      notification.style.color = '#ffffff'
      notification.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <div class="font-medium">Copied to clipboard!</div>
            <div class="text-sm opacity-70">Email address copied successfully</div>
          </div>
        </div>
      `
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.style.transform = 'translateY(0)'
      }, 10)

      setTimeout(() => {
        notification.style.transform = 'translateY(100%)'
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 300)
      }, 3000)

      setTimeout(() => {
        setCopied(false)
      }, 1600)
    } catch (error) {
      console.error('Failed to copy email', error)
    }
  }

  return (
    <section id="home" className="relative min-h-screen noise">
      <div className="absolute inset-0 z-0 h-full w-full" style={{ minHeight: '100vh' }}>
        {showLightRays ? (
          <LightRays
            raysOrigin="top-center"
            raysColor="#dac5a7"
            raysSpeed={0.75}
            lightSpread={0.6}
            rayLength={2.35}
            pulsating={false}
            fadeDistance={1.2}
            saturation={0.85}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0}
            distortion={0}
            className="h-full w-full opacity-25 saturate-150 dark:opacity-55 dark:saturate-100"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_0%,rgba(218,197,167,0.18),transparent_42%),radial-gradient(circle_at_80%_22%,rgba(168,140,98,0.10),transparent_32%)]" />
        )}
      </div>

      <div className="container relative z-10 mx-auto flex min-h-screen items-center px-6 pb-12 pt-24 md:pb-16 md:pt-32">
        <div className="relative mx-auto flex w-full max-w-7xl -translate-y-6 flex-col items-center text-center md:-translate-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-6xl"
          >
            <div className="pointer-events-none absolute left-[14%] top-[4%] hidden h-7 w-10 rotate-[-3deg] rounded-[48%_52%_46%_54%/56%_44%_56%_44%] border border-[#dac5a7]/18 bg-gradient-to-br from-[#c2a77b] to-[#8b7355] shadow-[0_0_18px_rgba(218,197,167,0.12)] md:block" />

            <h1 className="mx-auto max-w-[1080px] text-balance text-[clamp(2.45rem,5.6vw,5.1rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-[color:var(--site-text)] drop-shadow-[0_18px_60px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_18px_60px_rgba(0,0,0,0.38)]">
              <span>Hi, I&apos;m</span>{' '}
              <span className="mx-1.5 inline-block h-[1.08em] w-[1.08em] translate-y-[0.16em] rounded-full border border-accent/30 bg-[color:var(--site-surface)] shadow-[inset_0_1px_0_rgba(245,239,228,0.12),0_0_22px_rgba(218,197,167,0.12)]" />{' '}
              <span className="text-accent">Jesper.</span>
              <br />
              <span>I design</span>{' '}
              <span className="mx-1.5 inline-flex h-[0.3em] w-[0.64em] translate-y-[-0.04em] rotate-[-2deg] rounded-[46%_54%_50%_50%/58%_42%_58%_42%] border border-[#dac5a7]/16 bg-gradient-to-br from-[#c2a77b] to-[#8b7355] shadow-[0_0_16px_rgba(218,197,167,0.10)]" />{' '}
              <span className="relative inline-block">
                interfaces
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 34"
                  className="pointer-events-none absolute -bottom-[0.17em] left-1/2 h-[0.18em] w-[110%] -translate-x-1/2 overflow-visible text-accent"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 24 C42 4, 151 7, 296 13 C221 14, 108 18, 19 29 C9 30, 2 29, 4 24 Z"
                    fill="currentColor"
                    opacity="0.95"
                  />
                  <path
                    d="M55 7 C118 5, 199 6, 287 12 C204 10, 123 10, 55 12 Z"
                    fill="var(--site-bg-deep)"
                    opacity="0.22"
                  />
                </svg>
              </span>
              <br />
              <span>that help products</span>{' '}
              <span className="text-accent">grow.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45 }}
            className="relative z-20 mt-8 flex max-w-3xl flex-col items-center gap-6 md:mt-10"
          >
            <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <a href="#contact" className="inline-flex">
                <GlareHover
                  width="auto"
                  height="auto"
                  background="#dac5a7"
                  borderRadius="20px"
                  borderColor="#dac5a7"
                  className="relative cursor-pointer px-6 py-2 text-base font-medium text-black transition-all duration-300 hover:!bg-none hover:!bg-transparent hover:!border-accent hover:text-[color:var(--site-text)] dark:hover:text-white"
                >
                  <span className="flex cursor-pointer items-center gap-3">
                    Let&apos;s Connect
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

      <div className="planet-horizon pointer-events-none absolute bottom-[-13rem] left-1/2 z-10 h-[20rem] w-[96vw] max-w-[1320px] -translate-x-1/2 md:bottom-[-22rem] md:h-[28rem] md:w-[118vw]" />
    </section>
  )
}

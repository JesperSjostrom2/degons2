'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'

import FloatingStars from '@/components/floating-stars'
import GlareHover from '@/components/GlareHover'
import LightRays from '@/components/LightRays'

const focusAreas = ['Frontend Engineering', 'Creative Interfaces', 'Performance-minded UI', 'Product Polish']

export default function Hero() {
  const [activeFocusArea, setActiveFocusArea] = useState(0)
  const [isFocusAreaPaused, setIsFocusAreaPaused] = useState(false)
  const [showLightRays, setShowLightRays] = useState(false)
  const faceParallaxX = useMotionValue(0)
  const faceParallaxY = useMotionValue(0)
  const smoothFaceParallaxX = useSpring(faceParallaxX, { stiffness: 70, damping: 22, mass: 0.45 })
  const smoothFaceParallaxY = useSpring(faceParallaxY, { stiffness: 70, damping: 22, mass: 0.45 })
  const { scrollY } = useScroll()
  const slowFaceScrollY = useTransform(scrollY, (value) => Math.min(value * 0.055, 42))

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateLightRays = () => setShowLightRays(mediaQuery.matches)

    updateLightRays()
    mediaQuery.addEventListener('change', updateLightRays)

    return () => mediaQuery.removeEventListener('change', updateLightRays)
  }, [])

  useEffect(() => {
    if (isFocusAreaPaused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveFocusArea((currentArea) => (currentArea + 1) % focusAreas.length)
    }, 1400)

    return () => window.clearInterval(timer)
  }, [isFocusAreaPaused])

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) {
      return
    }

    const updateFaceParallax = (event: PointerEvent) => {
      const normalizedX = event.clientX / window.innerWidth - 0.5
      const normalizedY = event.clientY / window.innerHeight - 0.5

      faceParallaxX.set(normalizedX * -30)
      faceParallaxY.set(normalizedY * -20)
    }

    const resetFaceParallax = () => {
      faceParallaxX.set(0)
      faceParallaxY.set(0)
    }

    window.addEventListener('pointermove', updateFaceParallax, { passive: true })
    window.addEventListener('pointerleave', resetFaceParallax)

    return () => {
      window.removeEventListener('pointermove', updateFaceParallax)
      window.removeEventListener('pointerleave', resetFaceParallax)
    }
  }, [faceParallaxX, faceParallaxY])

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-background noise">
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
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_0%,rgba(218,197,167,0.18),transparent_45%)]" />
        )}
      </div>

      <FloatingStars />

      <div className="container relative z-10 mx-auto flex min-h-screen items-center px-6 pb-16 pt-28">
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.8fr_1.4fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-20 max-w-xs justify-self-start lg:pt-36"
          >
            <p className="text-base font-semibold leading-7 text-white md:text-lg">
              Hey there. I&apos;m a frontend-focused developer based in Helsinki, building sharp digital
              experiences with clean code and a strong eye for interaction.
            </p>
            <div className="mt-8 inline-flex" onClick={scrollToContact}>
              <GlareHover
                width="auto"
                height="auto"
                background="#dac5a7"
                borderRadius="20px"
                borderColor="#dac5a7"
                className="px-8 py-2 text-lg font-medium text-black hover:!bg-none hover:!bg-transparent hover:text-white hover:!border-accent transition-all duration-300 cursor-pointer relative"
              >
                Let&apos;s Connect
              </GlareHover>
            </div>
          </motion.div>

          <div className="relative min-h-[520px] overflow-visible md:min-h-[620px] lg:min-h-[680px]">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="absolute left-1/2 top-[6%] z-10 w-[120vw] max-w-none -translate-x-1/2 select-none overflow-visible bg-gradient-to-b from-[#f7ead8] via-[#dac5a7] to-[#8b7355] bg-clip-text pb-5 pt-8 text-center text-[3.45rem] font-black uppercase leading-[0.98] tracking-[-0.018em] text-transparent sm:text-[5.45rem] sm:tracking-[-0.025em] md:text-[7.15rem] lg:text-[8.45rem] xl:text-[9.6rem]"
            >
              Jesper<br className="sm:hidden" /> Sjöström
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 48, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
              className="absolute inset-x-0 -bottom-8 z-20 mx-auto flex justify-center sm:-bottom-10 md:-bottom-12"
            >
              <motion.div style={{ y: slowFaceScrollY }} className="will-change-transform">
                <motion.div
                  style={{ x: smoothFaceParallaxX, y: smoothFaceParallaxY }}
                  className="relative h-[420px] w-[420px] will-change-transform sm:h-[500px] sm:w-[500px] md:h-[570px] md:w-[570px] lg:h-[630px] lg:w-[630px]"
                >
                  <div className="absolute inset-x-[18%] bottom-10 top-[18%] rounded-full bg-accent/10 blur-3xl" />
                  <div className="absolute left-1/2 top-[20%] h-72 w-72 -translate-x-1/2 rounded-full border border-accent/20 bg-[radial-gradient(circle,rgba(218,197,167,0.18)_0%,transparent_68%)] md:h-96 md:w-96" />
                  <Image
                    src="/assets/memoji.png"
                    alt="Memoji portrait of Jesper Sjöström"
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, 620px"
                    className="object-contain object-bottom drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="relative z-20 max-w-xs justify-self-end lg:pt-48"
          >
            <div
              onPointerEnter={() => setIsFocusAreaPaused(true)}
              onPointerLeave={() => setIsFocusAreaPaused(false)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsFocusAreaPaused(false)
                }
              }}
              className="space-y-3 text-sm font-semibold md:text-base"
            >
              {focusAreas.map((area, index) => (
                <button
                  key={area}
                  type="button"
                  onPointerEnter={() => {
                    setIsFocusAreaPaused(true)
                    setActiveFocusArea(index)
                  }}
                  onFocus={() => {
                    setIsFocusAreaPaused(true)
                    setActiveFocusArea(index)
                  }}
                  className={`block text-left transition-colors duration-300 ${
                    activeFocusArea === index ? 'text-white' : 'text-white/45 hover:text-white/70'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-1/2 h-px w-full max-w-4xl -translate-x-1/2"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
        }}
      />
    </section>
  )
}

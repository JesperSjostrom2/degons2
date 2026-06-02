"use client"

import { motion, useReducedMotion } from 'framer-motion'
import GradientText from '@/components/GradientText'
import ScrollReveal from '@/components/scroll-reveal'
import SocialLinks from '@/components/social-links'
import { useIsMobile } from '@/hooks/use-media-query'

export default function AboutSection() {
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile(767, false)
  const shouldDisablePortraitMotion = shouldReduceMotion === true || isMobile

  return (
    <section id="about" className="about-scene relative flex min-h-screen items-center overflow-hidden py-20 md:py-24">
      <div className="about-scene-ambient pointer-events-none absolute inset-0" />
      <div className="about-scene-depth pointer-events-none absolute inset-0" />
      <div className="about-scene-haze pointer-events-none absolute inset-0" />
      <div className="about-scene-bloom pointer-events-none absolute inset-0" />
      <div className="about-scene-vignette pointer-events-none absolute inset-0" />
      <div className="about-scene-dust pointer-events-none absolute inset-0" />
      <div className="about-scene-grain pointer-events-none absolute inset-0 opacity-35" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="flex items-center justify-center">
          <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-5 lg:gap-20">
            <div className="space-y-8 lg:col-span-3 lg:col-start-1">
              <div className="text-left md:ml-8">
                <ScrollReveal delay={0} blur>
                  <p className="section-label text-left">MORE ABOUT ME</p>
                </ScrollReveal>

                <ScrollReveal className="mb-8" delay={0.08} blur>
                  <h2
                    className="section-title group cursor-default leading-tight"
                    style={{ textShadow: '0 0 10px rgba(245, 239, 228, 0.12), 0 0 20px rgba(218, 197, 167, 0.05)' }}
                  >
                    Always learning,
                    <br />
                    always{' '}
                    <span className="relative inline-block">
                      <GradientText className="font-accent" colors={['#8b7355', '#dac5a7', '#8b7355']}>
                        moving
                      </GradientText>
                    </span>
                  </h2>
                </ScrollReveal>

                <ScrollReveal className="max-w-xl space-y-6 text-lg leading-[1.65] text-muted-foreground" delay={0.18}>
                  <p>
                    I like building websites because they sit right between design, problem solving, and first impressions. A good site should feel good, but it should also make the next step obvious.
                  </p>
                  <p>
                    My focus is frontend work with a strong eye for layout, motion, and small details. Landing pages, portfolios, redesigns, and business sites are the kind of projects I enjoy shaping from rough idea to finished experience.
                  </p>
                  <p className="font-medium text-[color:var(--site-text)]">
                    I&apos;m at my best when I can keep improving something until it feels clear, useful, and worth showing.
                  </p>
                </ScrollReveal>

                <SocialLinks />
              </div>
            </div>

            <motion.div
              className="flex items-center justify-center lg:col-span-2"
              initial={shouldDisablePortraitMotion ? false : { opacity: 0, y: 54, scale: 0.92, rotateX: 12, rotateZ: -2.6, filter: 'blur(18px)' }}
              whileInView={shouldDisablePortraitMotion ? undefined : { opacity: 1, y: 0, scale: 1, rotateX: 0, rotateZ: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.16, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 1300, willChange: shouldDisablePortraitMotion ? 'auto' : 'transform, opacity, filter' }}
            >
              <motion.div
                className="mobile-no-load-animation about-identity-panel relative w-full max-w-[26rem]"
                initial={shouldDisablePortraitMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
                whileInView={shouldDisablePortraitMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.22, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.9, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="about-light-orb about-light-orb-left" />
                <div className="about-light-orb about-light-orb-right" />

                <motion.div
                  className="mobile-no-load-animation about-cinematic-frame group/about-portrait relative cursor-pointer overflow-hidden rounded-[1.7rem] border border-[color:var(--site-border)]/40 bg-[rgba(7,7,7,0.26)] p-3.5 backdrop-blur-[4px] [backdrop-filter:blur(4px)_saturate(120%)] [-webkit-backdrop-filter:blur(4px)_saturate(120%)] md:p-4"
                  initial={shouldDisablePortraitMotion ? false : { opacity: 0, y: 18, scale: 0.985, filter: 'blur(8px)' }}
                  whileInView={shouldDisablePortraitMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.25, margin: '0px 0px -8% 0px' }}
                  transition={{ duration: 0.84, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="about-frame-glow pointer-events-none absolute inset-0" />
                  <div className="about-floating-particles pointer-events-none absolute inset-0" />

                  <div data-about-profile className="about-portrait-stage relative h-[25.5rem] overflow-hidden rounded-[1.3rem] border border-[color:var(--site-border)]/45 bg-[linear-gradient(170deg,rgba(158,132,94,0.1)_0%,rgba(10,10,10,0.84)_50%,rgba(5,5,5,0.98)_100%)]">
                    <motion.div
                      className="mobile-no-load-animation about-portrait-image absolute inset-0 bg-[url('/assets/portrait.jpg')] bg-cover bg-center bg-no-repeat"
                      initial={shouldDisablePortraitMotion ? false : { clipPath: 'inset(16% 8% 18% 8% round 1.1rem)', scale: 1.08, opacity: 0.52, filter: 'saturate(0.52) contrast(1.08) blur(8px)' }}
                      whileInView={shouldDisablePortraitMotion ? undefined : { clipPath: 'inset(0% 0% 0% 0% round 0rem)', scale: 1.02, opacity: 0.96, filter: 'saturate(0.88) contrast(1.04) blur(0px)' }}
                      viewport={{ once: true, amount: 0.35, margin: '0px 0px -8% 0px' }}
                      transition={{ duration: 1.18, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <motion.div
                      className="mobile-no-load-animation about-portrait-sweep pointer-events-none absolute inset-y-0 w-1/2"
                      initial={shouldDisablePortraitMotion ? false : { x: '-130%', opacity: 0 }}
                      whileInView={shouldDisablePortraitMotion ? undefined : { x: '230%', opacity: [0, 0.75, 0] }}
                      viewport={{ once: true, amount: 0.35, margin: '0px 0px -8% 0px' }}
                      transition={{ duration: 1.05, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <div className="about-portrait-hover-sheen pointer-events-none absolute inset-y-0 w-1/2" />
                    <motion.div
                      className="mobile-no-load-animation about-portrait-corner-mark pointer-events-none absolute right-4 top-4"
                      initial={shouldDisablePortraitMotion ? false : { opacity: 0, scale: 0.7, rotate: -18 }}
                      whileInView={shouldDisablePortraitMotion ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true, amount: 0.35, margin: '0px 0px -8% 0px' }}
                      transition={{ duration: 0.74, delay: 0.98, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <div className="about-vignette absolute inset-0" />
                    <div className="about-portrait-fade absolute inset-0" />
                    <div className="about-portrait-light absolute -left-12 top-10 h-40 w-40 rounded-full" />
                    <div className="about-portrait-light about-portrait-light-alt absolute -bottom-12 right-2 h-44 w-44 rounded-full" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

import {
  cinematicEase,
  cinematicPanel,
  cinematicViewport,
  useCompactMotion,
  useRevealTransition,
  useRevealVariants,
} from '@/lib/site-motion'
import MaskedRise from '@/components/masked-rise'

const processSteps = [
  {
    number: '01',
    title: 'Start with a plan',
    description: 'A short conversation about your goals turns into a clear scope and price before any work starts.',
    asset: '/assets/process-plan.webp',
    width: 374,
    height: 368,
    artworkClass: 'process-artwork-message',
    accent: '#8fa58a',
  },
  {
    number: '02',
    title: 'Build in the open',
    description: 'Design and code move together, with real feedback rounds, so nothing surprises you at the end.',
    asset: '/assets/process-build.webp',
    width: 342,
    height: 336,
    artworkClass: 'process-artwork-build',
    accent: '#a79ac7',
  },
  {
    number: '03',
    title: 'Launch and support',
    description: "Final testing, a clean launch, and I'm still around after. I don't disappear once the invoice is paid.",
    asset: '/assets/process-launch.webp',
    width: 434,
    height: 308,
    artworkClass: 'process-artwork-ship',
    // Champagne, not the old bronze #8b7355 — bronze read as broken next to the bento
    // cards, which never use anything that deep. Matches BENTO_ACCENTS.champagne in
    // MagicBento.tsx. The accent no longer reaches the card's rim or hover glow (those
    // are neutral now); it survives in the artwork, so it only needs to read against
    // the panel, not against black.
    accent: '#c2a77b',
  },
]

export default function ProcessJourney() {
  const isCompact = useCompactMotion()
  const revealTransition = useRevealTransition()
  const revealVariants = useRevealVariants()

  return (
    <section id="process" className="journey-section relative -mb-10 -mt-12 overflow-hidden pb-14 pt-0 md:-mb-14 md:-mt-16 md:pb-20">
      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          className="process-heading mx-auto mb-9 max-w-3xl text-center md:mb-12"
          initial={{ opacity: 0, y: isCompact ? 10 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={cinematicViewport}
          transition={revealTransition({ duration: isCompact ? 0.42 : 0.76, ease: cinematicEase })}
        >
          <h2 className="section-title">
            <MaskedRise delay={0.12}>How it works</MaskedRise>
          </h2>
        </motion.div>

        <motion.div
          data-process-panel
          className="journey-panel relative mx-auto grid max-w-7xl gap-4 md:grid-cols-3"
          variants={revealVariants(isCompact ? cinematicPanel('up') : cinematicPanel('deep'))}
          initial="hidden"
          whileInView="visible"
          viewport={cinematicViewport}
        >
          {processSteps.map((step, index) => (
            <motion.article
              key={step.number}
              className="process-step group relative overflow-hidden rounded-[20px] border border-[color:var(--rim-border)]"
              style={{ '--process-accent': step.accent } as CSSProperties}
              initial={{ opacity: 0, y: isCompact ? 10 : 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={cinematicViewport}
              transition={revealTransition({ duration: isCompact ? 0.4 : 0.68, delay: isCompact ? Math.min(0.05 * index, 0.1) : 0.16 + index * 0.12, ease: cinematicEase })}
            >
              <div className="process-visual relative flex h-[18rem] items-center justify-center overflow-hidden md:h-[20rem]">
                <div className="process-artwork-motion absolute inset-0 flex items-center justify-center">
                  <Image
                    className={`process-artwork ${step.artworkClass}`}
                    src={step.asset}
                    alt=""
                    aria-hidden="true"
                    width={step.width}
                    height={step.height}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>

              <div className="process-copy relative px-7 pb-8 pt-3 md:min-h-[12rem] md:px-8 md:pb-9 lg:px-10">
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-[#f5efe4] md:text-[1.75rem]">
                    {step.title}
                  </h3>
                  <span className="font-body text-[0.68rem] font-semibold tracking-[0.18em] text-[color:var(--site-dim)]">
                    {step.number}
                  </span>
                </div>
                <p className="mt-3 max-w-[19rem] text-[0.98rem] leading-7 text-[#b0aea5]">{step.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="process-to-work mx-auto mt-11 flex max-w-xl flex-col items-center text-center md:mt-14"
          initial={{ opacity: 0, y: isCompact ? 8 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={cinematicViewport}
          transition={revealTransition({ duration: isCompact ? 0.4 : 0.7, ease: cinematicEase })}
        >
          <p className="font-editorial text-xl italic text-[#dcd7cc] md:text-2xl">See it in practice.</p>
          <svg className="process-to-work-arrow mt-4" viewBox="0 0 32 104" aria-hidden="true" focusable="false">
            <path className="story-route-path" d="M16 3C16 22 16 39 16 63" />
            <image
              className="story-route-rocket"
              href="/assets/rocket-icon.svg"
              x="7"
              y="72"
              width="18"
              height="22"
              transform="rotate(180 16 83)"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}

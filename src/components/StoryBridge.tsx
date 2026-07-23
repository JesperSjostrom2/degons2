'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { cinematicEase, cinematicViewport } from '@/lib/site-motion'

export default function StoryBridge() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="story-bridge relative -mb-8 -mt-12 bg-transparent py-10 md:-mb-10 md:-mt-16 md:py-14" aria-label="From selected work to my story">
      <div className="container relative mx-auto px-6">
        <motion.div
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={cinematicViewport}
          transition={{ duration: 0.8, ease: cinematicEase }}
        >
          <svg className="story-bridge-route" viewBox="0 0 132 64" aria-hidden="true" focusable="false">
            <path className="story-route-path" d="M10 10C42 8 42 39 72 42C94 44 105 33 116 25" />
            <image
              className="story-bridge-rocket"
              href="/assets/rocket-icon.svg"
              x="108"
              y="14"
              width="18"
              height="22"
              transform="rotate(45 117 25)"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}

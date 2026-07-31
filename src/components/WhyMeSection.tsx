import dynamic from 'next/dynamic'

import ScrollReveal from '@/components/scroll-reveal'

/* MagicBento is the largest client component in the bundle and sits below the
   fold. Splitting it here keeps its HTML server-rendered (ssr defaults to
   true) while its hydration JS loads as its own chunk instead of inside the
   main bundle. */
const MagicBento = dynamic(() => import('@/components/MagicBento'))

export default function WhyMeSection() {
  return (
    <section id="why-me" className="relative z-20 isolate -mt-8 scroll-mt-24 pb-24 pt-12 md:-mt-8 md:pb-28 md:pt-16">
      <div className="relative z-20 mx-auto flex w-full max-w-[1320px] flex-col items-center px-6">
        <div className="section-header relative z-30">
          <ScrollReveal delay={0.08} blur>
            <h2 className="section-title">A smoother way to get your website online</h2>
          </ScrollReveal>
        </div>
        <MagicBento />
      </div>
    </section>
  )
}

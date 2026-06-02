import MagicBento from '@/components/MagicBento'
import ScrollReveal from '@/components/scroll-reveal'

export default function WhyMeSection() {
  return (
    <section id="why-me" className="warm-section-overlay relative z-20 isolate -mt-8 scroll-mt-24 pb-24 pt-12 md:-mt-8 md:pb-28 md:pt-16">
      <div className="relative z-20 mx-auto flex w-full max-w-[1320px] flex-col items-center px-6">
        <div className="section-header relative z-30">
          <ScrollReveal blur>
            <p className="section-label">Why choose me</p>
          </ScrollReveal>
          <ScrollReveal delay={0.08} blur>
            <h2 className="section-title">A smoother way to get your website online</h2>
          </ScrollReveal>
        </div>
        <MagicBento />
      </div>
    </section>
  )
}

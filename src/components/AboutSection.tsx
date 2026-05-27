import GradientText from '@/components/GradientText'
import ScrollReveal from '@/components/scroll-reveal'
import SocialLinks from '@/components/social-links'

export default function AboutSection() {
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

            <div className="flex items-center justify-center lg:col-span-2">
              <div className="about-identity-panel relative w-full max-w-[26rem]">
                <div className="about-light-orb about-light-orb-left" />
                <div className="about-light-orb about-light-orb-right" />

                <div className="about-cinematic-frame relative overflow-hidden rounded-[1.7rem] border border-[color:var(--site-border)]/40 bg-[rgba(7,7,7,0.26)] p-3.5 backdrop-blur-[4px] [backdrop-filter:blur(4px)_saturate(120%)] [-webkit-backdrop-filter:blur(4px)_saturate(120%)] md:p-4">
                  <div className="about-frame-glow pointer-events-none absolute inset-0" />
                  <div className="about-floating-particles pointer-events-none absolute inset-0" />

                  <div data-about-profile className="about-portrait-stage relative h-[25.5rem] overflow-hidden rounded-[1.3rem] border border-[color:var(--site-border)]/45 bg-[linear-gradient(170deg,rgba(158,132,94,0.1)_0%,rgba(10,10,10,0.84)_50%,rgba(5,5,5,0.98)_100%)]">
                    <div className="about-portrait-image absolute inset-0 bg-[url('/assets/portrait.jpg')] bg-cover bg-center bg-no-repeat" />
                    <div className="about-vignette absolute inset-0" />
                    <div className="about-portrait-fade absolute inset-0" />
                    <div className="about-portrait-light absolute -left-12 top-10 h-40 w-40 rounded-full" />
                    <div className="about-portrait-light about-portrait-light-alt absolute -bottom-12 right-2 h-44 w-44 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

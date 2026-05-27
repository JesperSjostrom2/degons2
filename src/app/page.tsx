import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import CVButton from '@/components/cv-button'
import SocialLinks from '@/components/social-links'
import GradientText from '@/components/GradientText'
import CustomCursor from '@/components/custom-cursor'
import FloatingStars from '@/components/floating-stars'
import SmoothScroll from '@/components/smooth-scroll'
import MagicBento from '@/components/MagicBento'
import ExperienceSection from '@/components/ExperienceSection'
import TechStackSection from '@/components/TechStackSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/footer'
import ProgressScrollbar from '@/components/ProgressScrollbar'
import ScrollReveal from '@/components/scroll-reveal'

export default function Home() {
  return (
    <main className="isolate relative min-h-screen bg-[color:var(--site-bg)] transition-colors duration-300">
      <SmoothScroll />
      <CustomCursor />
      <ProgressScrollbar />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(180deg,var(--site-bg-deep)_0%,var(--site-bg)_48%,var(--site-bg)_100%)]" />
      <div className="space-background-meteor pointer-events-none fixed z-0" />
      <FloatingStars className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-80 invert-0" count={44} mobileCount={10} />
      <div className="relative z-10">
        <Navbar />
        <CVButton />
        <Hero />

      {/* Magic Bento Grid Section */}
      <section id="why-me" className="warm-section-overlay relative -mt-8 scroll-mt-24 pb-24 pt-12 md:-mt-8 md:pb-28 md:pt-16">
        <div className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-col items-center px-6">
          <div className="section-header">
            <ScrollReveal blur>
              <p className="section-label">
                Why choose me
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08} blur>
              <h2 className="section-title">
                A smoother way to get your website online
              </h2>
            </ScrollReveal>
          </div>
          <MagicBento />
        </div>
      </section>
       
      {/* Projects Section */}
      <ExperienceSection />
      
      {/* About Section */}
      <section id="about" className="about-scene relative flex min-h-screen items-center overflow-hidden py-20 md:py-24">
        <div className="about-scene-ambient pointer-events-none absolute inset-0" />
        <div className="about-scene-depth pointer-events-none absolute inset-0" />
        <div className="about-scene-haze pointer-events-none absolute inset-0" />
        <div className="about-scene-bloom pointer-events-none absolute inset-0" />
        <div className="about-scene-vignette pointer-events-none absolute inset-0" />
        <div className="about-scene-dust pointer-events-none absolute inset-0" />
        <div className="about-scene-grain pointer-events-none absolute inset-0 opacity-35" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="flex justify-center items-center">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center max-w-6xl w-full">
              {/* Left Content */}
              <div className="lg:col-span-3 lg:col-start-1 space-y-8">
                <div className="text-left md:ml-8">
                  <ScrollReveal delay={0} blur>
                    <p className="section-label text-left">
                      MORE ABOUT ME
                    </p>
                  </ScrollReveal>
                  <ScrollReveal className="mb-8" delay={0.08} blur>
                    <h2 className="section-title group cursor-default leading-tight" style={{textShadow: '0 0 10px rgba(245, 239, 228, 0.12), 0 0 20px rgba(218, 197, 167, 0.05)'}}>
                      Always learning,<br />
                      always <span className="relative inline-block">
                        <GradientText className="font-accent" colors={["#8b7355", "#dac5a7", "#8b7355"]}>moving</GradientText>
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
                  
                  {/* Social Links */}
                  <SocialLinks />
                </div>
              </div>
              
              <div className="lg:col-span-2 flex justify-center items-center">
                <div className="about-identity-panel relative w-full max-w-[26rem]">
                  <div className="about-light-orb about-light-orb-left" />
                  <div className="about-light-orb about-light-orb-right" />

                  <div className="about-cinematic-frame relative overflow-hidden rounded-[1.7rem] border border-[color:var(--site-border)]/40 bg-[rgba(7,7,7,0.26)] p-3.5 md:p-4 backdrop-blur-[4px] [backdrop-filter:blur(4px)_saturate(120%)] [-webkit-backdrop-filter:blur(4px)_saturate(120%)]">
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
      
      {/* Skills Section */}
      <TechStackSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
      </div>
       
    </main>
  )
}

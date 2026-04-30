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

const aboutInfoCardClass = 'relative z-10 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-surface)] p-4 text-center backdrop-blur-sm transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:rounded-[4px] group-hover:border-accent/35 group-hover:shadow-[4px_4px_0px_rgba(168,140,98,0.72)] group-active:translate-x-0 group-active:translate-y-0 group-active:rounded-xl group-active:shadow-none'
const aboutInfoDepthClass = 'pointer-events-none absolute inset-0 z-0 rounded-xl border border-accent/30 bg-accent/10 opacity-0 shadow-[0_0_0_1px_rgba(218,197,167,0.08),inset_0_1px_0_rgba(245,239,228,0.12)] transition-all duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:opacity-100 group-hover:rounded-[4px]'
const aboutInfoCardStyle = { boxShadow: '0 1px 0 0 rgba(255, 255, 255, 0.1)' }

export default function Home() {
  return (
    <main className="isolate relative min-h-screen bg-[color:var(--site-bg)] transition-colors duration-300">
      <SmoothScroll />
      <CustomCursor />
      <ProgressScrollbar />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_14%_12%,rgba(168,140,98,0.10),transparent_26%),radial-gradient(circle_at_88%_34%,rgba(143,165,138,0.07),transparent_28%),linear-gradient(180deg,var(--site-bg-deep)_0%,var(--site-bg)_48%,var(--site-bg)_100%)]" />
      <FloatingStars className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-70 invert dark:opacity-80 dark:invert-0" count={44} mobileCount={18} />
      <div className="relative z-10">
        <Navbar />
        <CVButton />
        <Hero />
      
      {/* About Section */}
      <section id="about" className="warm-section-bg relative flex min-h-screen items-center overflow-hidden py-20 md:py-24">
        <div className="container relative z-10 mx-auto px-6">
          <div className="flex justify-center items-center">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center max-w-6xl w-full">
              {/* Left Content */}
              <div className="lg:col-span-3 lg:col-start-1 space-y-8">
                <div className="text-left md:ml-8">
                  <p className="section-label text-left">
                    MORE ABOUT ME
                  </p>
                  <div className="mb-8">
                    <h2 className="group cursor-default text-3xl font-bold leading-tight tracking-[-0.035em] text-[color:var(--site-text)] md:text-4xl lg:text-5xl" style={{textShadow: '0 0 10px rgba(245, 239, 228, 0.12), 0 0 20px rgba(218, 197, 167, 0.05)'}}>
                      I&apos;m Jesper, a<br />
                      creative <span className="relative inline-block">
                        <GradientText className="font-accent" colors={["#8b7355", "#dac5a7", "#8b7355"]}>developer</GradientText>
                        <span className="absolute -right-16 top-1/2 hidden -translate-y-1/2 text-2xl opacity-0 transition-all duration-300 group-hover:opacity-100 md:block md:text-3xl lg:text-4xl animate-waving">👋</span>
                      </span>
                    </h2>
                  </div>
                  <div className="max-w-xl space-y-6 text-lg leading-[1.65] text-muted-foreground">
                    <p>
                      I&apos;m Jesper Sjöström, a proactive full-stack developer passionate 
                      about creating dynamic web experiences. From frontend to 
                      backend, I thrive on solving complex problems with clean, 
                      efficient code. My expertise spans React, Next.js, and Node.js, 
                      and I&apos;m always eager to learn more.
                    </p>
                    <p>
                      When I&apos;m not immersed in work, I&apos;m exploring new ideas and 
                      staying curious. Life&apos;s about balance, and I love embracing 
                      every part of it.
                    </p>
                    <p className="font-medium text-[color:var(--site-text)]">
                      I believe in waking up each day eager to make a difference!
                    </p>
                  </div>
                  
                  {/* Social Links */}
                  <SocialLinks />
                </div>
              </div>
              
              {/* Right Profile Section */}
              <div className="lg:col-span-2 flex justify-center items-center">
                <div className="relative w-full max-w-sm">
                  {/* Profile Picture with outline behind */}
                  <div className="relative mb-16 flex justify-start group">
                    {/* Animated outline box behind picture - sticking out right */}
                    <div className="absolute left-4 top-4 z-0 h-64 w-64 rounded-3xl border-2 border-accent/60 transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:translate-y-2 sm:left-5 sm:top-5 sm:h-72 sm:w-72 animate-pulse"></div>
                    
                    {/* Main Profile Picture */}
                    <div data-about-profile className="relative z-10 h-64 w-64 overflow-hidden rounded-3xl bg-gradient-to-br from-[#a88c62] via-accent to-[#8b7355] transition-transform duration-300 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2 sm:h-72 sm:w-72">
                      <div className="flex h-full w-full items-center justify-center" style={{background: 'linear-gradient(to bottom right, #a88c62, #dac5a7 58%, #8b7355)'}}>
                        <span className="about-profile-initial text-8xl font-bold text-white transition-all duration-500">JS</span>
                        <span className="about-profile-memoji absolute inset-0 bg-[url('/assets/memoji.png')] bg-contain bg-center bg-no-repeat opacity-0 transition-all duration-700" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Information Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="about-info-3d group relative cursor-pointer">
                      <div className={aboutInfoDepthClass} />
                      <div className={aboutInfoCardClass} style={aboutInfoCardStyle}>
                        <div className="text-2xl font-bold text-[color:var(--site-text)]">26</div>
                        <div className="text-xs text-muted-foreground font-medium">AGE</div>
                      </div>
                    </div>
                    <div className="about-info-3d group relative cursor-pointer">
                      <div className={aboutInfoDepthClass} />
                      <div className={aboutInfoCardClass} style={aboutInfoCardStyle}>
                        <div className="text-2xl font-bold text-[color:var(--site-text)]">4+</div>
                        <div className="text-xs text-muted-foreground font-medium">YEARS EXP</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="about-info-3d group relative cursor-pointer">
                    <div className={aboutInfoDepthClass} />
                    <div className={`${aboutInfoCardClass} p-5`} style={aboutInfoCardStyle}>
                      <div className="text-xl font-bold text-[color:var(--site-text)]">Helsinki</div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">LOCATION</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Magic Bento Grid Section */}
      <section className="relative -mt-8 overflow-hidden pb-24 pt-16 md:pb-28">
        <div className="site-divider-center absolute left-1/2 top-8 h-px w-full max-w-5xl -translate-x-1/2" />
        <div className="pointer-events-none absolute left-1/2 top-8 z-0 h-24 w-full max-w-4xl -translate-x-1/2 translate-y-px overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(ellipse_at_top,rgba(139,115,85,0.22),transparent_68%)] blur-xl dark:bg-[radial-gradient(ellipse_at_top,rgba(218,197,167,0.22),transparent_68%)]" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6">
          <div className="section-header mb-10">
            <p className="section-label">
              Why choose me
            </p>
            <h2 className="section-title">
              A smoother way to bring your website to life
            </h2>
          </div>
          <MagicBento />
        </div>
      </section>
      
      {/* Projects Section */}
      <ExperienceSection />
      
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

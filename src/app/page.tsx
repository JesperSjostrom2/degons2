import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import HeroAboutGenie from '@/components/hero-about-genie'
import EmailContact from '@/components/email-contact'
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

const aboutInfoCardClass = 'relative z-10 rounded-xl border border-accent/20 bg-card/30 p-4 text-center backdrop-blur-sm transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:rounded-[4px] group-hover:shadow-[4px_4px_0px_rgba(218,197,167,0.8)] group-active:translate-x-0 group-active:translate-y-0 group-active:rounded-xl group-active:shadow-none'
const aboutInfoDepthClass = 'pointer-events-none absolute inset-0 z-0 rounded-xl border border-accent/45 bg-accent/10 opacity-0 shadow-[0_0_24px_rgba(218,197,167,0.12),inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:opacity-100 group-hover:rounded-[4px]'
const aboutInfoCardStyle = { boxShadow: '0 1px 0 0 rgba(255, 255, 255, 0.1)' }

export default function Home() {
  return (
    <main className="isolate relative min-h-screen bg-[#080808]">
      <SmoothScroll />
      <CustomCursor />
      <ProgressScrollbar />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(180deg,#1a1a1a_0%,#101010_28%,#080808_100%)]" />
      <FloatingStars className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-80" count={44} mobileCount={18} />
      <div className="relative z-10">
        <HeroAboutGenie />
        <Navbar />
        <EmailContact />
        <CVButton />
        <Hero />
      
      {/* About Section */}
      <section id="about" className="relative flex min-h-screen items-center overflow-hidden py-20">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.92)_0%,rgba(16,16,16,0.94)_45%,rgba(8,8,8,0.96)_100%),radial-gradient(circle_at_18%_34%,rgba(218,197,167,0.035),transparent_32%),radial-gradient(circle_at_82%_62%,rgba(218,197,167,0.025),transparent_30%)]" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="flex justify-center items-center">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center max-w-6xl w-full">
              {/* Left Content */}
              <div className="lg:col-span-3 lg:col-start-1 space-y-8">
                <div className="text-left md:ml-8">
                  <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                    MORE ABOUT ME
                  </p>
                  <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight group cursor-default" style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.15), 0 0 20px rgba(255, 255, 255, 0.05)'}}>
                      I&apos;m Jesper, a<br />
                      creative <span className="inline-block relative">
                        <GradientText className="italic" style={{fontFamily: 'cursive'}} colors={["#8b7355", "#dac5a7", "#8b7355"]}>developer</GradientText>
                        <span className="absolute -right-16 top-1/2 hidden -translate-y-1/2 text-2xl opacity-0 transition-all duration-300 group-hover:opacity-100 md:block md:text-3xl lg:text-4xl animate-waving">👋</span>
                      </span>
                    </h2>
                  </div>
                  <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
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
                    <p className="font-medium text-white">
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
                    <div data-about-profile className="relative h-64 w-64 rounded-3xl overflow-hidden bg-gradient-to-br from-accent via-accent/95 to-accent/90 z-10 transition-transform duration-300 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2 sm:h-72 sm:w-72">
                      <div className="w-full h-full flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #8b7355, #dac5a7)'}}>
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
                        <div className="text-2xl font-bold text-white">26</div>
                        <div className="text-xs text-muted-foreground font-medium">AGE</div>
                      </div>
                    </div>
                    <div className="about-info-3d group relative cursor-pointer">
                      <div className={aboutInfoDepthClass} />
                      <div className={aboutInfoCardClass} style={aboutInfoCardStyle}>
                        <div className="text-2xl font-bold text-white">4+</div>
                        <div className="text-xs text-muted-foreground font-medium">YEARS EXP</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="about-info-3d group relative cursor-pointer">
                    <div className={aboutInfoDepthClass} />
                    <div className={`${aboutInfoCardClass} p-5`} style={aboutInfoCardStyle}>
                      <div className="text-xl font-bold text-white">Helsinki</div>
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
      <section className="relative -mt-8 overflow-hidden bg-background/80 pb-24 pt-16">
        <div className="absolute left-1/2 top-0 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        <div className="absolute left-1/2 top-0 h-24 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(218,197,167,0.18),transparent_68%)] blur-xl" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl md:h-[720px] md:w-[720px]" />
        <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-2xl md:h-[380px] md:w-[380px]" />
        <div className="relative z-10 flex justify-center">
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

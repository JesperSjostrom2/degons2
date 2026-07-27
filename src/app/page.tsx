import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import CustomCursor from '@/components/custom-cursor'
import FloatingStars from '@/components/floating-stars'
import SmoothScroll from '@/components/smooth-scroll'
import ExperienceSection from '@/components/ExperienceSection'
import TechStackSection from '@/components/TechStackSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/footer'
import ProgressScrollbar from '@/components/ProgressScrollbar'
import AboutSection from '@/components/AboutSection'
import WhyMeSection from '@/components/WhyMeSection'
import ProcessJourney from '@/components/ProcessJourney'
import StoryBridge from '@/components/StoryBridge'
import BentoProcessBridge from '@/components/BentoProcessBridge'
import AtmosphereController from '@/components/AtmosphereController'

export default function Home() {
  return (
    <main className="isolate relative min-h-screen bg-[color:var(--sky-surface)]">
      <SmoothScroll />
      <AtmosphereController />
      <CustomCursor />
      <ProgressScrollbar />
      {/* The water column. Two flat colours; the abyss fades in with depth.
          No gradient anywhere, so there is no shape to ride along with the
          viewport and nothing that can band. */}
      <div className="sky-surface pointer-events-none fixed inset-0 z-0" />
      <div data-atmosphere="abyss" className="sky-abyss pointer-events-none fixed inset-0 z-0" />
      <div className="space-background-meteor space-background-meteor--a pointer-events-none fixed z-0" />
      <div className="space-background-meteor space-background-meteor--b pointer-events-none fixed z-0" />
      <div className="space-background-meteor space-background-meteor--c pointer-events-none fixed z-0" />
      <div className="space-background-meteor space-background-meteor--d pointer-events-none fixed z-0" />
      {/* data-parallax is vh of travel across the full page, resolved to px by
          AtmosphereController. Nearer bands travel further, and are sized and
          brightened to match in LAYER_CONFIG. Each band's bottom overscan must
          exceed its own travel or its lower edge scrolls into view — see the
          .star-band--* rules. */}
      <div data-atmosphere="stars" data-parallax="-18" className="star-band star-band--far pointer-events-none fixed z-0 overflow-hidden">
        <FloatingStars className="absolute inset-0" layer="far" count={26} mobileCount={10} />
      </div>
      <div data-atmosphere="stars" data-parallax="-55" className="star-band star-band--mid pointer-events-none fixed z-0 overflow-hidden">
        <FloatingStars className="absolute inset-0" layer="mid" count={18} mobileCount={0} />
      </div>
      <div data-atmosphere="stars" data-parallax="-120" className="star-band star-band--near pointer-events-none fixed z-0 overflow-hidden">
        <FloatingStars className="absolute inset-0" layer="near" count={10} mobileCount={0} />
      </div>
      <div className="relative z-10">
        <Navbar />
        <Hero />

        <BentoProcessBridge>
          <WhyMeSection />
          <ProcessJourney />
        </BentoProcessBridge>
        <ExperienceSection />
        <StoryBridge />
        <AboutSection />
        <TechStackSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}

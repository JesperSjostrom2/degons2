import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import CustomCursor from '@/components/custom-cursor'
import SmoothScroll from '@/components/smooth-scroll'
import ProjectsSection from '@/components/projects/ProjectsSection'
import TechStackSection from '@/components/TechStackSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/footer'
import ProgressScrollbar from '@/components/ProgressScrollbar'
import AboutSection from '@/components/AboutSection'
import WhyMeSection from '@/components/WhyMeSection'
import ProcessJourney from '@/components/ProcessJourney'
import StoryBridge from '@/components/StoryBridge'
import BentoProcessBridge from '@/components/BentoProcessBridge'
import SiteAtmosphere from '@/components/site-atmosphere'
import SectionHandoff from '@/components/section-handoff'

export default function Home() {
  return (
    <main className="isolate relative min-h-screen bg-[color:var(--sky)]">
      <SmoothScroll />
      <SectionHandoff />
      <CustomCursor />
      <ProgressScrollbar />
      <SiteAtmosphere />
      <div className="relative z-10">
        <Navbar />
        <Hero />

        <BentoProcessBridge>
          <WhyMeSection />
          <ProcessJourney />
        </BentoProcessBridge>
        <ProjectsSection />
        <StoryBridge />
        <AboutSection />
        <TechStackSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}

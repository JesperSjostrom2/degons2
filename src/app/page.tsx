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
        <Hero />

        <WhyMeSection />
        <ExperienceSection />
        <AboutSection />
        <TechStackSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}

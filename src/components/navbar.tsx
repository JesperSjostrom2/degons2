'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MenuCloseIcon } from '@/components/ui/animated-state-icons'
import ProfileCard from '@/components/ui/profile-card'
import Link from 'next/link'
import { FileText } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'Experience', href: '#experience', id: 'experience' },
  { name: 'Skills', href: '#skills', id: 'skills' },
  { name: 'Contact', href: '#contact', id: 'contact' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is 20% from top
      threshold: 0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          setActiveSection(sectionId)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    navItems.forEach((item) => {
      const element = document.querySelector(item.href)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const scrollToSection = (href: string, id: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(id)
    setIsMobileMenuOpen(false)
  }

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <div className="hidden lg:block fixed top-6 left-6 z-50">
        <ProfileCard
          imageSrc="https://ik.imagekit.io/kqmrslzuq/21st.dev%20Components/ProfileCard/logo.png"
          name="Jesper Sjöström"
          role="Full Stack Developer"
          socials={{
            github: "https://github.com/jespersjostrom"
          }}
        />
      </div>
      <motion.nav
        className={`fixed z-50 transition-colors duration-300 w-full top-0 left-0 right-0 ${
        isMobileMenuOpen ? 'bg-transparent border-transparent' : 'bg-[#808080]/15 backdrop-blur-xl border-b border-white/10'
      } lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:w-auto lg:max-w-[95vw] lg:right-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-8`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Desktop Menu */}
      <div className="hidden lg:flex glass-nav items-center relative flex-wrap justify-center" style={{ padding: '0.25rem 0.75rem', gap: '0.75rem' }}>
        {navItems.map((item, index) => (
          <motion.button
            key={item.name}
            onClick={() => scrollToSection(item.href, item.id)}
            className={`relative font-normal transition-colors duration-300 whitespace-nowrap cursor-pointer ${
              activeSection === item.id 
                ? 'text-white' 
                : 'text-white/70 hover:text-white/90'
            }`}
            style={{ 
              fontSize: '0.875rem',
              padding: '0.25rem 0.625rem'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeSection === item.id && (
              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg"
                layoutId="activeGlow"
                style={{
                  bottom: '-0.375rem',
                  width: '2rem',
                  height: '0.125rem',
                  boxShadow: '0 0 0.5rem rgba(255, 255, 255, 0.8), 0 0 1rem rgba(255, 255, 255, 0.4)'
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className="relative z-10">{item.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-6 py-3 relative z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProfileCard
            imageSrc="https://ik.imagekit.io/kqmrslzuq/21st.dev%20Components/ProfileCard/logo.png"
            name="Jesper Sjöström"
            role="Full Stack Developer"
            socials={{
              github: "https://github.com/jespersjostrom"
            }}
          />
        </motion.div>
        <Button
          variant="ghost"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="hover:bg-white/10 cursor-pointer p-2 -mr-2"
        >
          <MenuCloseIcon size={28} isAnimating={isMobileMenuOpen} className="text-white" />
        </Button>
      </div>

      {/* Mobile Fullscreen Kinetic Menu */}
      <div className={`lg:hidden fixed inset-0 h-[100dvh] w-screen overflow-hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        
        {/* Kinetic Backdrop Sweeps */}
        <motion.div
          className="absolute inset-0 bg-[#2a2a2a] z-30"
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? "0%" : "100%" }}
          transition={{ duration: 0.6, ease: [0.65, 0.05, 0, 1], delay: isMobileMenuOpen ? 0 : 0.2 }}
        />
        <motion.div
          className="absolute inset-0 bg-[#dac5a7] z-30"
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? "0%" : "100%" }}
          transition={{ duration: 0.6, ease: [0.65, 0.05, 0, 1], delay: isMobileMenuOpen ? 0.08 : 0.1 }}
        />
        <motion.div
          className="absolute inset-0 bg-background z-30"
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? "0%" : "100%" }}
          transition={{ duration: 0.6, ease: [0.65, 0.05, 0, 1], delay: isMobileMenuOpen ? 0.16 : 0 }}
        />

        {/* Menu Content */}
        <div className="absolute inset-0 z-40 flex flex-col justify-center px-8 sm:px-12 pt-20">
          <div className="space-y-4">
            {navItems.map((item, index) => (
              <div key={item.name} className="overflow-hidden py-1">
                <motion.div
                  initial={{ y: "140%", rotate: 10, opacity: 0 }}
                  animate={{ 
                    y: isMobileMenuOpen ? "0%" : "140%", 
                    rotate: isMobileMenuOpen ? 0 : 10,
                    opacity: isMobileMenuOpen ? 1 : 0
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.65, 0.05, 0, 1], 
                    delay: isMobileMenuOpen ? 0.35 + index * 0.05 : 0 
                  }}
                >
                  <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.div
                      className={`text-4xl sm:text-5xl font-serif tracking-tight cursor-pointer ${
                        activeSection === item.id 
                          ? 'text-accent' 
                          : 'text-white/80 hover:text-white'
                      }`}
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            ))}
            
            <div className="overflow-hidden pt-8 mt-8 border-t border-white/10">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ 
                  y: isMobileMenuOpen ? "0%" : "100%",
                  opacity: isMobileMenuOpen ? 1 : 0
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.65, 0.05, 0, 1], 
                  delay: isMobileMenuOpen ? 0.35 + navItems.length * 0.05 : 0 
                }}
              >
                <Link href="/cv" onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.div
                    className="px-6 py-4 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-medium text-xl w-full sm:w-auto cursor-pointer"
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText className="w-6 h-6" />
                    Resume
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
    </>
  )
}

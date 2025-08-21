'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Experience', href: '#experience', id: 'experience' },
  { name: 'Work', href: '#work', id: 'work' },
  { name: 'Skills', href: '#skills', id: 'skills' },
  { name: 'Contact', href: '#contact', id: 'contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  // Track active section based on scroll position
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

    // Observe all sections
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

  return (
    <motion.nav
      className={`fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 w-auto max-w-[95vw] ${
        isScrolled ? 'glass-nav shadow-xl' : 'glass-nav'
      }`}
      style={{ top: '2rem' }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center relative flex-wrap justify-center" style={{ gap: '0.75rem' }}>
          {navItems.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => scrollToSection(item.href, item.id)}
              className={`relative font-normal transition-colors duration-300 whitespace-nowrap ${
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
              {/* Active section glow */}
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

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between">
          <motion.div
            className="font-normal text-white"
            style={{ fontSize: '1rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Portfolio
          </motion.div>
          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover:bg-white/10"
            style={{ padding: '0.25rem' }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.div>
          </Button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`lg:hidden absolute top-full left-0 right-0 glass-nav overflow-hidden ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
          style={{ 
            marginTop: '0.5rem',
            borderRadius: '1rem'
          }}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            y: isMobileMenuOpen ? 0 : -20,
            scale: isMobileMenuOpen ? 1 : 0.95
          }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ padding: '0.75rem', gap: '0.25rem' }} className="space-y-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href, item.id)}
                className={`w-full text-left rounded-lg transition-all duration-300 font-normal ${
                  activeSection === item.id 
                    ? 'text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                style={{
                  fontSize: '0.875rem',
                  padding: '0.25rem 0.625rem'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
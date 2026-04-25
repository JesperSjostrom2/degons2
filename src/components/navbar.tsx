'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MenuCloseIcon } from '@/components/ui/animated-state-icons'
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

  return (
    <motion.nav
      className="fixed z-50 transition-all duration-300 w-auto max-w-[95vw] glass-nav right-6 top-6 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-8"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
        <div className="hidden lg:flex items-center relative flex-wrap justify-center" style={{ gap: '0.75rem' }}>
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

        <div className="lg:hidden flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover:bg-white/10 cursor-pointer p-2"
          >
            <MenuCloseIcon size={28} isAnimating={isMobileMenuOpen} className="text-white" />
          </Button>
        </div>

        <motion.div
          className={`lg:hidden absolute top-full right-0 glass-nav overflow-hidden w-48 ${
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
                className={`w-full text-left rounded-lg transition-all duration-300 font-normal cursor-pointer ${
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
            <div className="pt-2 mt-2 border-t border-white/10">
              <Link href="/cv" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.button
                  className="w-full px-4 py-2 bg-accent/90 hover:bg-accent text-accent-foreground rounded-lg flex items-center justify-center gap-2 transition-all duration-300 font-medium text-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="w-4 h-4" />
                  Resume
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

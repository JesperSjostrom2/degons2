'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuCloseIcon } from '@/components/ui/animated-state-icons'
import ProfileCard from '@/components/ui/profile-card'
import Link from 'next/link'
import { FileText, Moon, Sun } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'Skills', href: '#skills', id: 'skills' },
  { name: 'Contact', href: '#contact', id: 'contact' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'

    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'

      document.documentElement.classList.toggle('dark', nextTheme === 'dark')
      localStorage.setItem('theme', nextTheme)

      return nextTheme
    })
  }

  const renderThemeToggle = () => (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'light'}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )

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

  const handleNavClick = (id: string) => {
    setActiveSection(id)
    setIsMobileMenuOpen(false)
  }

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.classList.add('mobile-menu-open')
    } else {
      document.body.style.overflow = ''
      document.documentElement.classList.remove('mobile-menu-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.classList.remove('mobile-menu-open')
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <div className="hidden lg:block fixed top-6 left-6 z-50">
        <ProfileCard
          imageSrc="/assets/testlogo.png"
          name="Jesper Sjöström"
          role="Front End Developer"
          socials={{
            github: "https://github.com/jespersjostrom2"
          }}
        />
      </div>
      <motion.nav
        className={`fixed z-50 box-border max-w-[100dvw] overflow-x-clip transition-colors duration-300 w-full top-0 left-0 right-0 ${
        isMobileMenuOpen ? 'bg-transparent border-transparent' : 'bg-[color:var(--nav-mobile-bg)] backdrop-blur-xl border-b border-[color:var(--site-border)]'
      } lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:w-auto lg:max-w-[95vw] lg:right-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-8`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Desktop Menu */}
      <div className="hidden lg:flex glass-nav relative items-center justify-center" style={{ padding: '0.35rem 0.85rem', gap: '0.55rem' }}>
        {navItems.map((item, index) => (
          <motion.a
            key={item.name}
            href={item.href}
            onClick={() => handleNavClick(item.id)}
            className={`relative font-normal transition-colors duration-300 whitespace-nowrap cursor-pointer ${
              activeSection === item.id 
                ? 'text-[color:var(--site-text)]' 
                : 'text-[color:var(--site-muted)] hover:text-[color:var(--site-text)]'
            }`}
            style={{ 
              fontSize: '0.875rem',
              padding: '0.35rem 0.7rem'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
          >
            {activeSection === item.id && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-accent"
                layoutId="activeGlow"
                style={{
                  bottom: '-0.375rem',
                  width: '2rem',
                  height: '0.125rem',
                  boxShadow: '0 0 0 1px rgba(218, 197, 167, 0.35), 0 0 16px rgba(218, 197, 167, 0.22)'
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className="relative z-10">{item.name}</span>
          </motion.a>
        ))}
        <div className="ml-1 h-5 w-px bg-[color:var(--site-border)]" />
        {renderThemeToggle()}
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden relative z-50 h-[72px] w-full max-w-[100dvw] overflow-visible px-4 py-3">
        <div className="absolute left-4 top-3 max-w-[calc(100dvw-5.5rem)] overflow-visible">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProfileCard
              imageSrc="/assets/testlogo.png"
              name="Jesper Sjöström"
              role="Front End Developer"
              expandedWidth={190}
              className="justify-start"
              socials={{
                github: "https://github.com/jespersjostrom2"
              }}
            />
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="glass-nav before:hidden absolute right-4 top-3 z-[70] flex h-11 w-11 translate-x-0 items-center justify-center p-0 text-[color:var(--site-text)] transition-colors duration-300 hover:bg-[color:var(--site-hover)]"
          aria-label="Toggle navigation menu"
        >
          <MenuCloseIcon size={24} isAnimating={isMobileMenuOpen} />
        </button>
        <div className="absolute right-[4.75rem] top-4 z-[70]">
          {renderThemeToggle()}
        </div>
      </div>

      {/* Mobile Fullscreen Kinetic Menu */}
      <div className={`fixed inset-0 h-[100dvh] w-auto max-w-[100dvw] overflow-hidden [contain:layout_paint_style] lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        
        {/* Kinetic Backdrop Sweeps */}
        <motion.div
          className="absolute inset-0 z-30 bg-[#30302e] will-change-transform"
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? "0%" : "100%" }}
          transition={{ duration: 0.6, ease: [0.65, 0.05, 0, 1], delay: isMobileMenuOpen ? 0 : 0.2 }}
        />
        <motion.div
          className="absolute inset-0 z-30 bg-[#a88c62] will-change-transform"
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? "0%" : "100%" }}
          transition={{ duration: 0.6, ease: [0.65, 0.05, 0, 1], delay: isMobileMenuOpen ? 0.08 : 0.1 }}
        />
        <motion.div
          className="absolute inset-0 z-30 bg-[#141413] will-change-transform"
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
                  className="will-change-transform"
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
                  <Link href={item.href} onClick={() => handleNavClick(item.id)}>
                    <motion.div
                      className={`cursor-pointer font-sans text-4xl font-semibold tracking-tight sm:text-5xl ${
                        activeSection === item.id 
                          ? 'text-accent' 
                          : 'text-[#f5efe4]/80 hover:text-[#f5efe4]'
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
            
            <div className={`overflow-hidden pt-8 mt-8 border-t transition-colors duration-300 ${isMobileMenuOpen ? 'border-white/10' : 'border-transparent'}`}>
              <motion.div
                className="will-change-transform"
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
                    className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-accent/25 bg-accent/10 px-6 py-4 text-xl font-medium text-accent transition-all duration-300 hover:bg-accent/20 sm:w-auto"
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

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuCloseIcon } from '@/components/ui/animated-state-icons'
import Link from 'next/link'
import Image from 'next/image'
import { FileText } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'Why Me', href: '#why-me', id: 'why-me' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Skills', href: '#skills', id: 'skills' },
  { name: 'Contact', href: '#contact', id: 'contact' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isHeroHeaderVisible, setIsHeroHeaderVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('home')
      if (hero) {
        const heroHeight = hero.offsetHeight
        setIsHeroHeaderVisible(window.scrollY < heroHeight * 0.75)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      <button
        type="button"
        onClick={() => handleNavClick('home')}
        data-scroll-to="home"
        className={`hidden lg:block fixed top-9 left-10 z-50 transition-all duration-500 ease-out cursor-pointer ${
          isHeroHeaderVisible 
            ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-2 blur-sm pointer-events-none'
        }`}
      >
        <Image 
          src="/assets/logotransparent.png" 
          alt="Logo" 
          width={240} 
          height={80} 
          className="h-11 w-auto object-contain transition-all duration-700"
          style={{ filter: 'drop-shadow(0 0 12px rgba(218, 197, 167, 0.08)) blur(0.2px)' }}
          priority
        />
      </button>
      <motion.nav
        className={`fixed z-50 box-border max-w-[100dvw] overflow-x-clip transition-colors duration-300 w-full top-0 left-0 right-0 ${
        isMobileMenuOpen ? 'bg-transparent border-transparent' : 'bg-[color:var(--nav-mobile-bg)] backdrop-blur-xl border-b border-[color:var(--site-border)]'
      } lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:w-auto lg:max-w-[95vw] lg:right-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-8`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Desktop Menu */}
      <div className="hidden lg:flex glass-nav relative items-center justify-center" style={{ padding: '0.35rem 1.15rem', gap: '0.7rem' }}>
        {navItems.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => handleNavClick(item.id)}
            data-scroll-to={item.id}
            className={`relative font-normal tracking-tight transition-all duration-500 whitespace-nowrap cursor-pointer border-none bg-transparent ${
              activeSection === item.id 
                ? 'text-[color:var(--site-text)]' 
                : 'text-[color:var(--site-muted)]/70 hover:text-[color:var(--site-text)]'
            }`}
            style={{ 
              fontSize: '0.85rem',
              padding: '0.35rem 0.75rem'
            }}
          >
            {activeSection === item.id && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-accent"
                layoutId="activeGlow"
                style={{
                  bottom: '-0.38rem',
                  width: '1.8rem',
                  height: '0.125rem',
                  opacity: 0.8,
                  boxShadow: '0 0 10px rgba(218, 197, 167, 0.15)'
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className="relative z-10">{item.name}</span>
          </button>
        ))}
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden relative z-50 h-[72px] w-full max-w-[100dvw] overflow-visible px-4 py-3">
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          data-scroll-to="home"
          className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center h-full border-none bg-transparent cursor-pointer"
        >
          <Image 
            src="/assets/logotransparent.png" 
            alt="Logo" 
            width={180} 
            height={60} 
            className={`h-10 w-auto object-contain transition-all duration-500 ease-out ${
              isHeroHeaderVisible 
                ? 'opacity-100 translate-y-0 blur-0' 
                : 'opacity-0 -translate-y-2 blur-sm'
            }`}
            priority
          />
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="glass-nav before:hidden absolute right-4 top-3 z-[70] flex h-11 w-11 translate-x-0 items-center justify-center p-0 text-[color:var(--site-text)] transition-colors duration-300 hover:bg-[color:var(--site-hover)]"
          aria-label="Toggle navigation menu"
        >
          <MenuCloseIcon size={24} isAnimating={isMobileMenuOpen} />
        </button>
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
                  <button 
                    type="button" 
                    onClick={() => handleNavClick(item.id)} 
                    data-scroll-to={item.id}
                    className="border-none bg-transparent p-0 text-left cursor-pointer"
                  >
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
                  </button>
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

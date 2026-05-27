'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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
  const [isPageScrolled, setIsPageScrolled] = useState(false)
  const scrollFrameRef = useRef(0)
  const isMobileBrandVisible = isHeroHeaderVisible || !isPageScrolled || isMobileMenuOpen

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY

      setIsPageScrolled((isScrolled) => {
        const nextIsScrolled = scrollY > 8
        return isScrolled === nextIsScrolled ? isScrolled : nextIsScrolled
      })
    }

    const handleScroll = () => {
      if (scrollFrameRef.current) return

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = 0
        updateScrollState()
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateScrollState()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.cancelAnimationFrame(scrollFrameRef.current)
    }
  }, [])

  useEffect(() => {
    const hero = document.getElementById('home')

    if (!hero) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroHeaderVisible((isVisible) => isVisible === entry.isIntersecting ? isVisible : entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px 0px -75% 0px',
        threshold: 0,
      }
    )

    observer.observe(hero)

    return () => {
      observer.disconnect()
    }
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
        className="fixed z-50 box-border max-w-[100dvw] overflow-x-clip border-transparent bg-transparent w-full top-0 left-0 right-0 lg:bg-transparent lg:backdrop-blur-none lg:border-none lg:w-auto lg:max-w-[95vw] lg:right-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-8"
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-0 border-b border-[color:var(--site-border)] bg-[color:var(--nav-mobile-bg)] backdrop-blur-xl transition-opacity duration-500 ease-out lg:hidden ${
          isMobileMenuOpen || !isPageScrolled ? 'opacity-0' : 'opacity-100'
        }`}
      />

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
              isMobileBrandVisible 
                ? 'opacity-100 translate-y-0 blur-0' 
                : 'opacity-0 -translate-y-2 blur-sm'
            }`}
            priority
          />
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="absolute right-4 top-3 z-[70] flex h-11 w-11 items-center justify-center border-none bg-transparent p-0 text-[color:var(--site-text)] transition-all duration-300 active:scale-95 hover:opacity-80"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="relative h-5 w-6" aria-hidden="true">
            <span
              className={`absolute left-0 top-[0.35rem] h-px w-6 rounded-full bg-current transition-transform duration-300 ease-out ${
                isMobileMenuOpen ? 'translate-y-[0.28rem] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute right-0 top-[0.95rem] h-px rounded-full bg-current transition-all duration-300 ease-out ${
                isMobileMenuOpen ? 'w-6 -translate-y-[0.32rem] -rotate-45' : 'w-4'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      <div className={`fixed inset-0 h-[100dvh] w-auto max-w-[100dvw] overflow-hidden [contain:layout_paint_style] lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <motion.div
          className="absolute right-0 top-0 z-30 h-[160vmax] w-[160vmax] rounded-full bg-[#141413] will-change-transform"
          initial={false}
          style={{ x: '50%', y: '-50%' }}
          animate={{ scale: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: isMobileMenuOpen ? 0.58 : 0.38, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Menu Content */}
        <div className="absolute inset-0 z-40 flex flex-col justify-center px-8 sm:px-12 pt-20">
          <div className="space-y-4">
            {navItems.map((item, index) => (
              <div key={item.name} className="overflow-hidden py-1">
                <motion.div
                  className="will-change-transform"
                  initial={false}
                  animate={{ 
                    y: isMobileMenuOpen ? "0%" : "42%", 
                    opacity: isMobileMenuOpen ? 1 : 0
                  }}
                  transition={{ 
                    duration: 0.42, 
                    ease: [0.22, 1, 0.36, 1], 
                    delay: isMobileMenuOpen ? 0.16 + index * 0.035 : 0 
                  }}
                >
                  <button 
                    type="button" 
                    onClick={() => handleNavClick(item.id)} 
                    data-scroll-to={item.id}
                    className="border-none bg-transparent p-0 text-left cursor-pointer"
                  >
                    <div
                      className={`cursor-pointer font-sans text-4xl font-semibold tracking-tight sm:text-5xl ${
                        activeSection === item.id 
                          ? 'text-accent' 
                          : 'text-[#f5efe4]/80 hover:text-[#f5efe4]'
                      }`}
                    >
                      {item.name}
                    </div>
                  </button>
                </motion.div>
              </div>
            ))}
            
            <div className={`overflow-hidden pt-8 mt-8 border-t transition-colors duration-300 ${isMobileMenuOpen ? 'border-white/10' : 'border-transparent'}`}>
              <motion.div
                className="will-change-transform"
                initial={false}
                animate={{ 
                  y: isMobileMenuOpen ? "0%" : "35%",
                  opacity: isMobileMenuOpen ? 1 : 0
                }}
                transition={{ 
                  duration: 0.42, 
                  ease: [0.22, 1, 0.36, 1], 
                  delay: isMobileMenuOpen ? 0.16 + navItems.length * 0.035 : 0 
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

'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Work', href: '#work' },
    { name: 'Tech Stack', href: '#tech' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav shadow-xl' : 'glass-nav'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="px-8 py-4 rounded-full">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="relative text-foreground/80 hover:text-foreground transition-colors duration-300 hover-magnetic"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.name}
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-accent rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground hover-magnetic"
              onClick={() => scrollToSection('#contact')}
            >
              Let's Talk
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between">
          <motion.div
            className="text-xl font-bold text-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Portfolio
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover-magnetic"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </Button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden absolute top-full left-0 right-0 mt-3 glass-nav rounded-3xl overflow-hidden ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            y: isMobileMenuOpen ? 0 : -20,
            scale: isMobileMenuOpen ? 1 : 0.95
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="w-full text-left px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.name}
              </motion.button>
            ))}
            <motion.div
              className="pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                variant="outline" 
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={() => scrollToSection('#contact')}
              >
                Let's Talk
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
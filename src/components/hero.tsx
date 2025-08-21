'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import FloatingStars from '@/components/floating-stars'

const typewriterTexts = [
  "Frontend Developer",
  "React Specialist",
  "UI/UX Enthusiast",
  "Creative Coder"
]


export default function Hero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const text = typewriterTexts[currentTextIndex]
    let timeout: NodeJS.Timeout

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length - 1))
        if (displayText === '') {
          setIsDeleting(false)
          setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length)
        }
      }, 100)
    } else {
      timeout = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + 1))
        if (displayText === text) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      }, 150)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentTextIndex])

  const scrollToWork = () => {
    const element = document.querySelector('#work')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="min-h-screen relative overflow-hidden noise bg-background">
      {/* Floating Stars */}
      <FloatingStars />


      <div className="container mx-auto px-6 flex items-center justify-center min-h-screen relative z-10">
        <div className="text-center space-y-8">
          {/* Animated Hello */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-2"
          >
            <motion.p 
              className="text-accent text-lg md:text-xl font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Hello, I'm
            </motion.p>
          </motion.div>

          {/* Main Name with 3D Hover Effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative cursor-pointer"
            whileHover="hover"
          >
            {/* Background shadow layer */}
            <motion.h1
              className="absolute top-0 left-22 text-5xl md:text-7xl lg:text-8xl font-bold pointer-events-none"
              style={{
                color: "rgb(139, 118, 93)"
              }}
              variants={{
                hover: { opacity: 1, x: 2, y: 5 }
              }}
              initial={{ opacity: 0, x: 0, y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Your Name
            </motion.h1>
            
            {/* Foreground text */}
            <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-bold text-gradient pointer-events-none">
              Your Name
            </h1>
          </motion.div>

          {/* Typewriter Effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="h-16 flex items-center justify-center"
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground">
              {displayText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-accent"
              >
                |
              </motion.span>
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            I craft beautiful, interactive digital experiences with modern technologies. 
            Passionate about creating user-centric designs that make a difference.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 hover-magnetic group"
              onClick={scrollToWork}
            >
              View My Work
              <ArrowDown size={20} className="ml-2" />
            </Button>
            
            <div className="flex gap-3">
              {[
                { icon: Github, label: "GitHub", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Mail, label: "Email", href: "#contact" }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    backgroundColor: "rgba(218, 197, 167, 0.1)"
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 glass rounded-full hover:border-accent transition-all duration-300"
                >
                  <social.icon size={20} className="text-accent" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-accent rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-accent rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
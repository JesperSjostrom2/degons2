'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Github, Linkedin, Mail } from 'lucide-react'
import FloatingStars from '@/components/floating-stars'
import LightRays from '@/components/LightRays'
import GlareHover from '@/components/GlareHover'
import GradientText from '@/components/GradientText'

export default function Hero() {
  const [isCopied, setIsCopied] = useState(false)

  const scrollToWork = () => {
    const element = document.querySelector('#work')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('contact@jespersjostrom.se')
      setIsCopied(true)
      
      const notification = document.createElement('div')
      notification.className = 'fixed bottom-24 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transform translate-y-full transition-transform duration-300'
      notification.style.background = '#2a2a2a'
      notification.style.border = '1px solid #4a4a4a'
      notification.style.color = '#ffffff'
      notification.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <div class="font-medium">Copied to clipboard!</div>
            <div class="text-sm opacity-70">Email address copied successfully</div>
          </div>
        </div>
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.style.transform = 'translateY(0)'
      }, 10)
      
      setTimeout(() => {
        notification.style.transform = 'translateY(100%)'
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
      
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <section id="home" className="min-h-screen relative overflow-hidden noise bg-background">
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#dac5a7"
          raysSpeed={0.5}
          lightSpread={1}
          rayLength={2}
          pulsating={false}
          fadeDistance={2}
          saturation={0.5}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0}
          distortion={0}
          className="opacity-40"
        />
      </div>
      
      <FloatingStars />


      <div className="container mx-auto px-6 flex items-center justify-center min-h-screen relative z-10 pt-20">
        <div className="text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-lg md:text-xl text-muted-foreground mb-4 font-medium">
              Hi I'm
            </div>
            <div className="relative inline-block">
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-none space-y-1 relative z-10">
                <div className="relative group/jesper inline-block">
                  <span className="text-accent">
                    Jesper
                  </span>
                  <span className="absolute top-0 left-0 opacity-0 group-hover/jesper:opacity-100 transition-opacity duration-300 -z-10 text-3xl md:text-5xl lg:text-6xl font-bold" style={{ transform: 'translate(6px, 4px)', color: '#8a7a5e' }}>
                    Jesper
                  </span>
                </div>
                <div className="relative group/sjostrom">
                  <span className="inline-block">
                    Sjöström
                  </span>
                  <span className="absolute top-0 left-0 opacity-0 group-hover/sjostrom:opacity-100 transition-opacity duration-300 -z-10 text-3xl md:text-5xl lg:text-6xl font-bold inline-block" style={{ transform: 'translate(6px, 4px)', color: '#4a4a4a' }}>
                    Sjöström
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Passionate full-stack developer with 5+ years of experience creating modern web applications. 
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center"
          >
            <div onClick={() => scrollToWork()}>
              <GlareHover 
                width="auto"
                height="auto"
                background="#dac5a7"
                borderRadius="20px"
                borderColor="#dac5a7"
                className="px-8 py-2 text-lg font-medium text-black hover:!bg-transparent hover:text-accent hover:!border-accent transition-all duration-300 cursor-pointer relative"
                style={{ boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)' }}
              >
                Let's Connect
              </GlareHover>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-6 justify-center items-center mt-16"
          >
            <a
              href="https://github.com/jespersjostrom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/jespersjostrom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-200"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
            <button
              onClick={isCopied ? undefined : copyToClipboard}
              disabled={isCopied}
              className={`flex items-center gap-2 transition-all duration-200 ${
                isCopied 
                  ? 'text-muted-foreground cursor-default' 
                  : 'text-muted-foreground hover:text-accent cursor-pointer'
              }`}
            >
              {isCopied ? (
                <Check className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
              <span>{isCopied ? 'Copied!' : 'contact@jespersjostrom.se'}</span>
            </button>
          </motion.div>

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

      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-px"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.2)'
        }}
      />

    </section>
  )
}
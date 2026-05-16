'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ProgressScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1280px)')
    let frameId = 0
    let isListening = false

    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0

      setScrollProgress((currentProgress) => Math.abs(currentProgress - progress) < 0.2 ? currentProgress : progress)
    }

    const scheduleScrollProgress = () => {
      if (!desktopQuery.matches) return
      if (frameId) return

      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        updateScrollProgress()
      })
    }

    const updateAvailability = () => {
      setIsEnabled(desktopQuery.matches)

      if (desktopQuery.matches) {
        if (!isListening) {
          window.addEventListener('scroll', scheduleScrollProgress, { passive: true })
          window.addEventListener('resize', scheduleScrollProgress)
          isListening = true
        }

        scheduleScrollProgress()
        return
      }

      if (isListening) {
        window.removeEventListener('scroll', scheduleScrollProgress)
        window.removeEventListener('resize', scheduleScrollProgress)
        isListening = false
      }

      window.cancelAnimationFrame(frameId)
      frameId = 0
    }

    updateAvailability()
    desktopQuery.addEventListener('change', updateAvailability)

    return () => {
      desktopQuery.removeEventListener('change', updateAvailability)
      window.removeEventListener('scroll', scheduleScrollProgress)
      window.removeEventListener('resize', scheduleScrollProgress)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        /* Hide default scrollbar */
        ::-webkit-scrollbar {
          display: none;
        }
        
        html {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {isEnabled ? (
        <div className="fixed right-16 top-1/2 z-50 hidden -translate-y-1/2 xl:block">
          <div className="relative h-32 w-1 overflow-hidden rounded-full border border-[color:var(--site-border)] bg-[rgba(20,20,19,0.18)] shadow-[0_0_0_1px_rgba(250,249,245,0.36)] dark:border-white/10 dark:bg-white/20 dark:shadow-none">
            <motion.div
              className="absolute left-0 top-0 w-full origin-top rounded-full bg-accent"
              style={{
                height: `${scrollProgress}%`,
                boxShadow: '0 0 8px rgba(139, 115, 85, 0.45)'
              }}
              initial={{ height: '0%' }}
              animate={{ height: `${scrollProgress}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ProgressScrollbar

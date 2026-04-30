'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ProgressScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      
      setScrollProgress(progress)
    }

    // Initial calculation
    updateScrollProgress()

    // Add scroll event listener with more responsive settings
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    
    // Add resize event listener to recalculate on window resize
    window.addEventListener('resize', updateScrollProgress)

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
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
      
      {/* Custom Vertical Progress Bar - Middle of page vertically */}
      <div className="fixed right-16 top-1/2 z-50 hidden -translate-y-1/2 md:block">
        <div className="relative h-32 w-1 overflow-hidden rounded-full border border-[color:var(--site-border)] bg-[rgba(20,20,19,0.18)] shadow-[0_0_0_1px_rgba(250,249,245,0.36)] dark:border-white/10 dark:bg-white/20 dark:shadow-none">
          {/* Progress Fill - Inside the background, fills from top to bottom */}
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
    </>
  )
}

export default ProgressScrollbar

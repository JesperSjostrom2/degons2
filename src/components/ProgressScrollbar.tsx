'use client'

import { useState, useEffect, useRef } from 'react'

const ProgressScrollbar: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1280px)')
    let frameId = 0
    let isListening = false
    // Cached: reading scrollHeight per frame forces layout, which is
    // especially costly with content-visibility: auto on four sections.
    let maxScroll = 1
    let lastProgress = -1

    const measure = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }

    const updateScrollProgress = () => {
      const bar = barRef.current

      if (!bar) return

      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll))

      if (Math.abs(progress - lastProgress) < 0.002) return

      lastProgress = progress
      // scaleY on an origin-top element: compositor only. The previous
      // implementation animated `height` through a Framer spring that
      // re-targeted every frame, which is a layout property.
      bar.style.transform = `scaleY(${progress})`
    }

    const scheduleScrollProgress = () => {
      if (!desktopQuery.matches) return
      if (frameId) return

      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        updateScrollProgress()
      })
    }

    const handleResize = () => {
      measure()
      scheduleScrollProgress()
    }

    const resizeObserver = new ResizeObserver(handleResize)

    const updateAvailability = () => {
      setIsEnabled(desktopQuery.matches)

      if (desktopQuery.matches) {
        if (!isListening) {
          window.addEventListener('scroll', scheduleScrollProgress, { passive: true })
          window.addEventListener('resize', handleResize)
          resizeObserver.observe(document.body)
          isListening = true
        }

        measure()
        scheduleScrollProgress()
        return
      }

      if (isListening) {
        window.removeEventListener('scroll', scheduleScrollProgress)
        window.removeEventListener('resize', handleResize)
        resizeObserver.disconnect()
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
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      window.cancelAnimationFrame(frameId)
    }
  }, [isEnabled])

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
            <div
              ref={barRef}
              className="absolute left-0 top-0 h-full w-full origin-top rounded-full bg-[color:var(--site-text)] transition-transform duration-150 ease-out"
              style={{ transform: 'scaleY(0)', boxShadow: '0 0 8px rgba(255, 255, 255, 0.35)' }}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ProgressScrollbar

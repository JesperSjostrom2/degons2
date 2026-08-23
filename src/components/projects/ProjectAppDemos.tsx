'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAutoplayInView } from '@/lib/use-autoplay-in-view'

interface Demo {
  videoSrc: string
  title: string
  description: string
  alt: string
}

const ActiveDevice = ({ demo, onEnded }: { demo: Demo; onEnded: () => void }) => {
  const frameRef = useAutoplayInView<HTMLDivElement>()

  return (
    <div ref={frameRef} className="project-page__app-device">
      <div className="project-page__app-speaker" aria-hidden="true" />
      <video
        data-autoplay-preview
        src={demo.videoSrc}
        muted
        playsInline
        preload="none"
        aria-label={demo.alt}
        onEnded={onEnded}
      />
    </div>
  )
}

/** One device and one running recording. The list changes the active flow instead of
 * turning six simultaneous videos into a wall of moving screens. */
const ProjectAppDemos = ({ demos }: { demos: Demo[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const active = demos[activeIndex] ?? demos[0]

  /* On narrow screens the list is a horizontal rail, and the showcase advances itself when a
     recording ends — so the flow that just started playing can be sitting off the side of it.
     Scrolling the rail's own box, rather than calling `scrollIntoView`, keeps the page where
     the reader left it; where the list is a plain column this has nothing to scroll and does
     nothing. */
  useEffect(() => {
    const list = listRef.current
    const chip = list?.children[activeIndex]

    if (!list || !(chip instanceof HTMLElement)) return

    const offset = chip.getBoundingClientRect().left - list.getBoundingClientRect().left
    list.scrollTo({
      left: list.scrollLeft + offset - (list.clientWidth - chip.clientWidth) / 2,
      behavior: 'smooth',
    })
  }, [activeIndex])

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }, [])

  const scheduleNext = useCallback(() => {
    clearAdvanceTimer()
    advanceTimer.current = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % demos.length)
    }, 1200)
  }, [clearAdvanceTimer, demos.length])

  useEffect(() => clearAdvanceTimer, [clearAdvanceTimer])

  const selectFlow = (index: number) => {
    clearAdvanceTimer()
    setActiveIndex(index)
  }

  if (!active) return null

  return (
    <section className="project-page__app-showcase" aria-label="Pikku Pulla product flows">
      <div className="project-page__app-stage">
        <ActiveDevice key={active.videoSrc} demo={active} onEnded={scheduleNext} />
      </div>

      <div className="project-page__app-flows">
        <header className="project-page__features-heading">
          <h2>Features</h2>
          <p>Choose a feature or let the showcase cycle automatically.</p>
        </header>

        <div
          ref={listRef}
          className="project-page__app-flow-list"
          aria-label="Choose a product feature"
        >
          {demos.map((demo, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={demo.videoSrc}
                type="button"
                aria-pressed={isActive}
                className="project-page__app-flow"
                onClick={() => selectFlow(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{demo.title}</strong>
              </button>
            )
          })}
        </div>

        <p className="project-page__app-selected-description" aria-live="polite">
          {active.description}
        </p>
      </div>
    </section>
  )
}

export default ProjectAppDemos

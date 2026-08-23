'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useAutoplayInView } from '@/lib/use-autoplay-in-view'

interface Demo {
  videoSrc: string
  title: string
  description: string
  alt: string
}

const ADVANCE_DELAY = 1200

type ActiveDeviceProps = {
  demo: Demo
  onEnded: () => void
  onDurationChange: (seconds: number) => void
  onPlayingChange: (playing: boolean) => void
}

const ActiveDevice = ({ demo, onEnded, onDurationChange, onPlayingChange }: ActiveDeviceProps) => {
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
        onLoadedMetadata={(event) => onDurationChange(event.currentTarget.duration)}
        /* `playing` and `waiting` rather than `play`: a recording that stalls to buffer would
           otherwise leave the progress line running on ahead of the picture. */
        onPlaying={() => onPlayingChange(true)}
        onWaiting={() => onPlayingChange(false)}
        onPause={() => onPlayingChange(false)}
        onEnded={onEnded}
      />
    </div>
  )
}

/** One device and one running recording. The list changes the active flow instead of
 * turning six simultaneous videos into a wall of moving screens. */
const ProjectAppDemos = ({ demos }: { demos: Demo[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [flowSeconds, setFlowSeconds] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
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

  /* The progress line is a CSS animation the length of the whole flow, so a new recording has
     to blank it until its own length is known — otherwise it inherits the previous one's. */
  const resetProgress = useCallback(() => {
    setFlowSeconds(null)
    setIsRunning(false)
  }, [])

  const scheduleNext = useCallback(() => {
    clearAdvanceTimer()
    /* The recording pauses itself at the end, but the line still has this hold to cross. */
    setIsRunning(true)
    advanceTimer.current = setTimeout(() => {
      resetProgress()
      setActiveIndex((current) => (current + 1) % demos.length)
    }, ADVANCE_DELAY)
  }, [clearAdvanceTimer, demos.length, resetProgress])

  useEffect(() => clearAdvanceTimer, [clearAdvanceTimer])

  const selectFlow = (index: number) => {
    clearAdvanceTimer()
    resetProgress()
    setActiveIndex(index)
  }

  if (!active) return null

  /* The line has to finish where the showcase moves on, not where the recording stops, so it
     runs for the video plus the hold that follows it. */
  const flowState = flowSeconds === null ? 'idle' : isRunning ? 'running' : 'paused'
  const flowStyle =
    flowSeconds === null
      ? undefined
      : ({ '--flow-duration': `${flowSeconds * 1000 + ADVANCE_DELAY}ms` } as CSSProperties)

  return (
    <section className="project-page__app-showcase" aria-label="Pikku Pulla product flows">
      <div className="project-page__app-stage">
        <ActiveDevice
          key={active.videoSrc}
          demo={active}
          onEnded={scheduleNext}
          onDurationChange={(seconds) => setFlowSeconds(Number.isFinite(seconds) ? seconds : null)}
          onPlayingChange={setIsRunning}
        />
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
          data-flow-state={flowState}
          style={flowStyle}
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
                <span className="project-page__app-flow-progress" aria-hidden="true" />
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

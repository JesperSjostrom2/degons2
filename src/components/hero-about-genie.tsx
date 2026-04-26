'use client'

import { useEffect, useRef, useState } from 'react'

interface GenieRect {
  x: number
  y: number
  width: number
  height: number
}

const getElementRect = (selector: string): GenieRect | null => {
  const element = document.querySelector(selector)

  if (!element) {
    return null
  }

  const rect = element.getBoundingClientRect()

  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  }
}

export default function HeroAboutGenie() {
  const isAboutActiveRef = useRef(false)
  const isTravellingRef = useRef(false)
  const currentRectRef = useRef<GenieRect | null>(null)
  const targetIsAboutRef = useRef(false)
  const targetSelectorRef = useRef('')
  const animationFrameRef = useRef<number | null>(null)
  const classUpdateFrameRef = useRef<number | null>(null)
  const startedAtRef = useRef(0)
  const [isTravelling, setIsTravelling] = useState(false)
  const [frameRect, setFrameRect] = useState<GenieRect | null>(null)
  const [isTravellingToAbout, setIsTravellingToAbout] = useState(false)

  useEffect(() => {
    const heroSection = document.querySelector('#home')
    const aboutSection = document.querySelector('#about')

    if (!heroSection || !aboutSection) {
      return
    }

    const playGenie = (enteringAbout: boolean) => {
      if (isAboutActiveRef.current === enteringAbout) {
        return
      }

      if (isTravellingRef.current) {
        isAboutActiveRef.current = enteringAbout
        targetIsAboutRef.current = enteringAbout
        targetSelectorRef.current = enteringAbout ? '[data-about-profile]' : '[data-hero-face]'
        startedAtRef.current = performance.now()
        setIsTravellingToAbout(enteringAbout)
        document.documentElement.classList.add('about-genie-travelling')
        document.documentElement.classList.remove('about-genie-at-about')
        return
      }

      const heroRect = getElementRect('[data-hero-face]')
      const profileRect = getElementRect('[data-about-profile]')

      if (!heroRect || !profileRect) {
        return
      }

      isAboutActiveRef.current = enteringAbout
      isTravellingRef.current = true
      targetIsAboutRef.current = enteringAbout
      currentRectRef.current = enteringAbout ? heroRect : profileRect
      targetSelectorRef.current = enteringAbout ? '[data-about-profile]' : '[data-hero-face]'
      startedAtRef.current = performance.now()
      setFrameRect(currentRectRef.current)
      setIsTravellingToAbout(enteringAbout)
      setIsTravelling(true)

      classUpdateFrameRef.current = window.requestAnimationFrame(() => {
        document.documentElement.classList.add('about-genie-travelling')
        document.documentElement.classList.remove('about-genie-at-about')
      })

      const finishTravel = (targetRect: GenieRect) => {
        currentRectRef.current = targetRect
        setFrameRect(targetRect)
        isTravellingRef.current = false
        document.documentElement.classList.remove('about-genie-travelling')

        if (targetIsAboutRef.current) {
          document.documentElement.classList.add('about-genie-at-about')
        } else {
          document.documentElement.classList.remove('about-genie-at-about')
        }

        window.requestAnimationFrame(() => setIsTravelling(false))
      }

      const updateTravel = () => {
        const currentRect = currentRectRef.current
        const targetRect = getElementRect(targetSelectorRef.current)

        if (!currentRect || !targetRect) {
          animationFrameRef.current = window.requestAnimationFrame(updateTravel)
          return
        }

        const nextRect = {
          x: currentRect.x + (targetRect.x - currentRect.x) * 0.075,
          y: currentRect.y + (targetRect.y - currentRect.y) * 0.075,
          width: currentRect.width + (targetRect.width - currentRect.width) * 0.075,
          height: currentRect.height + (targetRect.height - currentRect.height) * 0.075,
        }
        const distance = Math.hypot(targetRect.x - nextRect.x, targetRect.y - nextRect.y)
        const sizeDistance = Math.abs(targetRect.width - nextRect.width) + Math.abs(targetRect.height - nextRect.height)
        const elapsed = performance.now() - startedAtRef.current

        currentRectRef.current = nextRect
        setFrameRect(nextRect)

        if ((distance < 3 && sizeDistance < 3) || elapsed > 1800) {
          finishTravel(targetRect)
          return
        }

        animationFrameRef.current = window.requestAnimationFrame(updateTravel)
      }

      animationFrameRef.current = window.requestAnimationFrame(updateTravel)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === aboutSection && entry.intersectionRatio >= 0.68) {
            playGenie(true)
          }

          if (entry.target === heroSection && entry.intersectionRatio >= 0.48) {
            playGenie(false)
          }
        })
      },
      { threshold: [0, 0.35, 0.48, 0.68, 0.85, 1] },
    )

    observer.observe(heroSection)
    observer.observe(aboutSection)

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }

      if (classUpdateFrameRef.current) {
        window.cancelAnimationFrame(classUpdateFrameRef.current)
      }

      observer.disconnect()
      document.documentElement.classList.remove('about-genie-at-about')
      document.documentElement.classList.remove('about-genie-travelling')
    }
  }, [])

  if (!isTravelling || !frameRect) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed z-[120] overflow-hidden rounded-full bg-[url('/assets/memoji.png')] bg-contain bg-center bg-no-repeat will-change-[left,top,width,height]"
      style={{
        left: frameRect.x,
        top: frameRect.y,
        width: frameRect.width,
        height: frameRect.height,
        transformOrigin: 'left top',
        opacity: 0.92,
        borderRadius: '50%',
      }}
      data-travelling-to-about={isTravellingToAbout}
    />
  )
}

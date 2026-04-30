'use client'

import { useEffect, useState, type CSSProperties } from 'react'

interface Star {
  id: number
  style: CSSProperties
}

interface FloatingStarsProps {
  className?: string
  count?: number
  mobileCount?: number
}

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, id) => {
    const size = randomBetween(0.3, 1.1)
    const brightness = randomBetween(0.3, 1)
    const flickerSpeed = randomBetween(3, 7)
    const glowIntensity = randomBetween(1, 3)
    const animationDuration = randomBetween(25, 45)

    return {
      id,
      style: {
        left: `${randomBetween(0, 100)}%`,
        top: `${randomBetween(0, 100)}%`,
        '--star-size': `${size}px`,
        '--star-glow-size': `${glowIntensity}px`,
        '--star-brightness': `${brightness}`,
        '--star-brightness-low': `${brightness * 0.6}`,
        '--star-brightness-mid': `${brightness * 0.8}`,
        '--star-flicker-duration': `${flickerSpeed}s`,
        '--star-sparkle-duration': `${flickerSpeed * 1.2}s`,
        '--star-float-duration': `${animationDuration}s`,
        '--star-float-y-duration': `${animationDuration * 1.2}s`,
        '--star-delay': `${id * 0.1}s`,
        '--star-x1': `${randomBetween(-20, 20)}px`,
        '--star-x2': `${randomBetween(-15, 15)}px`,
        '--star-x3': `${randomBetween(-17.5, 17.5)}px`,
        '--star-y1': `${randomBetween(-25, 25)}px`,
        '--star-y2': `${randomBetween(-20, 20)}px`,
        '--star-y3': `${randomBetween(-22.5, 22.5)}px`,
      } as CSSProperties,
    }
  })
}

export default function FloatingStars({
  className = 'absolute inset-0 overflow-hidden pointer-events-none',
  count = 30,
  mobileCount = 12,
}: FloatingStarsProps) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateStars = () => setStars(generateStars(mediaQuery.matches ? mobileCount : count))

    updateStars()
    mediaQuery.addEventListener('change', updateStars)

    return () => mediaQuery.removeEventListener('change', updateStars)
  }, [count, mobileCount])

  return (
    <div className={className}>
      {stars.map((star) => (
        <div key={star.id} className="floating-star absolute will-change-transform" style={star.style}>
          <div className="floating-star-inner relative">
            <div className="floating-star-glow absolute rounded-full bg-white/15 blur-sm" />
            <div className="floating-star-core absolute rounded-full bg-white" />
            <div className="floating-star-sparkle-x absolute" />
            <div className="floating-star-sparkle-y absolute" />
          </div>
        </div>
      ))}
    </div>
  )
}

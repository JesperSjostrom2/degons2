'use client'

import { useEffect, useState, type CSSProperties } from 'react'

export type StarLayer = 'far' | 'mid' | 'near'

interface Star {
  id: number
  style: CSSProperties
}

interface FloatingStarsProps {
  className?: string
  count?: number
  mobileCount?: number
  /** Depth band — nearer layers render larger and brighter. */
  layer?: StarLayer
}

// Sizing/brightness only — parallax travel lives on the wrapping
// [data-atmosphere] band in site-atmosphere.tsx, which AtmosphereController
// writes to.
//
// These must stay in step with the per-band travel: a band that moves faster
// is nearer the viewer, so it also has to be bigger and brighter or the depth
// cue contradicts itself.
const LAYER_CONFIG: Record<StarLayer, { sizeScale: number; brightnessScale: number }> = {
  far: { sizeScale: 0.6, brightnessScale: 0.5 },
  mid: { sizeScale: 1, brightnessScale: 0.85 },
  near: { sizeScale: 1.9, brightnessScale: 1.25 },
}

// Most stars stay white; a handful of tinted ones read as spectral variety.
const STAR_TINTS = ['#dac5a7', '#7fa7c8', '#a79ac7'] as const
const TINT_CHANCE = 0.15

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min

const generateStars = (count: number, layer: StarLayer): Star[] => {
  const { sizeScale, brightnessScale } = LAYER_CONFIG[layer]

  return Array.from({ length: count }, (_, id) => {
    const size = randomBetween(0.5, 1.5) * sizeScale
    const brightness = Math.min(1, randomBetween(0.3, 1) * brightnessScale)
    const flickerSpeed = randomBetween(3, 7)
    const glowIntensity = randomBetween(2, 4) * sizeScale
    const animationDuration = randomBetween(25, 45)
    const tint = Math.random() < TINT_CHANCE ? STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)] : '#ffffff'

    return {
      id,
      style: {
        left: `${randomBetween(0, 100)}%`,
        top: `${randomBetween(0, 100)}%`,
        '--star-size': `${size}px`,
        '--star-glow-size': `${glowIntensity}px`,
        '--star-tint': tint,
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
  layer,
}: FloatingStarsProps) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateStars = () => setStars(generateStars(mediaQuery.matches ? mobileCount : count, layer ?? 'mid'))

    updateStars()
    mediaQuery.addEventListener('change', updateStars)

    return () => mediaQuery.removeEventListener('change', updateStars)
  }, [count, mobileCount, layer])

  /**
   * The far band draws no cross-sparkle.
   *
   * Its stars are scaled to 0.6, which puts them between 0.3px and 0.9px across — the sparkle
   * arms on something that size land under a single device pixel and are not visible at any
   * viewport. They were, however, two more elements and two more infinite animations per star,
   * on the most numerous band of the three. Dropping them removes roughly half the animated
   * elements in the sky and changes nothing anyone can see.
   */
  const drawsSparkle = layer !== 'far'

  return (
    <div className={className}>
      {stars.map((star) => (
        /* No `will-change` here. These elements animate `transform` continuously, so the
           compositor promotes them for the duration of the animation on its own; declaring it as
           well only pinned a layer per star permanently — including while `useOffstagePause` had
           the band's animations paused, which is exactly when the layer should be released. */
        <div key={star.id} className="floating-star absolute" style={star.style}>
          <div className="floating-star-inner relative">
            <div className="floating-star-glow absolute rounded-full blur-sm" />
            <div className="floating-star-core absolute rounded-full" />
            {drawsSparkle ? (
              <>
                <div className="floating-star-sparkle-x absolute" />
                <div className="floating-star-sparkle-y absolute" />
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

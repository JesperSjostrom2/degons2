'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  { id: 'memoji', type: 'image', src: '/assets/memoji.png', alt: 'Jesper memoji' },
  { id: 'logo', type: 'image', src: '/assets/testlogo.png', alt: 'Jesper logo' },
  { id: 'monogram', type: 'mono' as const },
] as const

export default function AboutPhotoRotator() {
  const [activeIndex, setActiveIndex] = useState(0)

  const next = () => setActiveIndex((prev) => (prev + 1) % slides.length)
  const prev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="relative mb-16 flex justify-start">
      <div className="absolute left-4 top-4 z-0 h-64 w-64 rounded-3xl border-2 border-accent/60 sm:left-5 sm:top-5 sm:h-72 sm:w-72" />

      <div className="relative z-10 h-64 w-64 overflow-hidden rounded-3xl bg-gradient-to-br from-[#a88c62] via-accent to-[#8b7355] sm:h-72 sm:w-72">
        {slides[activeIndex].type === 'image' ? (
          <Image
            src={slides[activeIndex].src}
            alt={slides[activeIndex].alt}
            fill
            sizes="(max-width: 640px) 256px, 288px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#a88c62,#dac5a7_58%,#8b7355)]">
            <span className="text-8xl font-bold text-white">JS</span>
          </div>
        )}

        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/35 p-1.5 text-white/90 backdrop-blur-sm transition hover:bg-black/50"
          aria-label="Show previous photo"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/35 p-1.5 text-white/90 backdrop-blur-sm transition hover:bg-black/50"
          aria-label="Show next photo"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition ${index === activeIndex ? 'w-5 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'}`}
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

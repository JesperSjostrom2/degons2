'use client'

import { useCallback, useRef, useState, type CSSProperties } from 'react'
import {
  SiFigma,
  SiFramer,
  SiNextdotjs,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si'
import { type IconType } from 'react-icons'

interface TechItem {
  name: string
  href: string
  icon?: IconType
  wordmark?: string
  featured?: boolean
}

interface HoverBounds {
  opacity: number
  x: number
  y: number
  width: number
  height: number
  borderRadius: string
}

const techStack: TechItem[] = [
  {
    name: 'React',
    href: 'https://react.dev',
    icon: SiReact,
    featured: true,
  },
  {
    name: 'Next.js',
    href: 'https://nextjs.org',
    icon: SiNextdotjs,
    featured: true,
  },
  {
    name: 'TypeScript',
    href: 'https://www.typescriptlang.org',
    icon: SiTypescript,
    featured: true,
  },
  {
    name: 'GSAP',
    href: 'https://gsap.com',
    wordmark: 'GSAP',
  },
  {
    name: 'Tailwind',
    href: 'https://tailwindcss.com',
    icon: SiTailwindcss,
  },
  {
    name: 'Supabase',
    href: 'https://supabase.com',
    icon: SiSupabase,
  },
  {
    name: 'Vercel',
    href: 'https://vercel.com',
    icon: SiVercel,
  },
  {
    name: 'Figma',
    href: 'https://www.figma.com',
    icon: SiFigma,
  },
  {
    name: 'Motion',
    href: 'https://motion.dev',
    icon: SiFramer,
  },
]

export default function TechStackSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeTech, setActiveTech] = useState<string | null>(null)
  const [hoverBounds, setHoverBounds] = useState<HoverBounds>({
    opacity: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    borderRadius: '0px',
  })

  const moveHoverFill = useCallback((element: HTMLElement, techName: string) => {
    const grid = gridRef.current

    if (!grid) {
      return
    }

    const gridRect = grid.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    const threshold = 2
    const touchesTop = Math.abs(elementRect.top - gridRect.top) <= threshold
    const touchesRight = Math.abs(elementRect.right - gridRect.right) <= threshold
    const touchesBottom = Math.abs(elementRect.bottom - gridRect.bottom) <= threshold
    const touchesLeft = Math.abs(elementRect.left - gridRect.left) <= threshold
    const radius = '28px'

    setActiveTech(techName)
    setHoverBounds({
      opacity: 1,
      x: elementRect.left - gridRect.left,
      y: elementRect.top - gridRect.top,
      width: elementRect.width,
      height: elementRect.height,
      borderRadius: `${touchesTop && touchesLeft ? radius : '0px'} ${touchesTop && touchesRight ? radius : '0px'} ${touchesBottom && touchesRight ? radius : '0px'} ${touchesBottom && touchesLeft ? radius : '0px'}`,
    })
  }, [])

  const hideHoverFill = useCallback(() => {
    setActiveTech(null)
    setHoverBounds((currentBounds) => ({ ...currentBounds, opacity: 0 }))
  }, [])

  const hoverFillStyle = {
    opacity: hoverBounds.opacity,
    transform: `translate3d(${hoverBounds.x}px, ${hoverBounds.y}px, 0)`,
    width: hoverBounds.width,
    height: hoverBounds.height,
    borderRadius: hoverBounds.borderRadius,
  } as CSSProperties

  return (
    <section id="skills" className="site-section">
      <div className="container mx-auto px-6">
        <div className="section-header mb-10">
          <p className="section-label">My Personal Toolkit</p>
          <h2 className="section-title">Tech Stack</h2>
        </div>

        <div
          ref={gridRef}
          onPointerLeave={hideHoverFill}
          className="warm-card-surface relative mx-auto flex max-w-7xl flex-wrap overflow-hidden rounded-[22px] md:grid md:grid-cols-3 md:rounded-[28px] lg:grid-cols-6"
        >
          <div
            className="pointer-events-none absolute left-0 top-0 z-0 bg-[#a88c62] transition-[transform,width,height,border-radius,opacity] duration-300 ease-out"
            style={hoverFillStyle}
          />

          {techStack.map((tech) => {
            const Icon = tech.icon
            const isActive = activeTech === tech.name

            return (
              <a
                key={tech.name}
                href={tech.href}
                target="_blank"
                rel="noreferrer"
                onPointerEnter={(event) => moveHoverFill(event.currentTarget, tech.name)}
                onFocus={(event) => moveHoverFill(event.currentTarget, tech.name)}
                onBlur={hideHoverFill}
                className={`group relative z-10 flex basis-1/2 items-center justify-center border-b border-r border-white/10 p-3 transition-colors duration-300 sm:basis-1/3 md:basis-auto ${
                  tech.featured
                    ? 'min-h-[98px] md:col-span-1 md:min-h-[250px] md:p-10 lg:col-span-2 lg:min-h-[330px]'
                    : 'min-h-[86px] md:min-h-[170px] md:p-8 lg:col-span-1 lg:border-b-0'
                } ${isActive ? 'text-background' : 'text-white/90 hover:text-background'}`}
                aria-label={`Open ${tech.name} website`}
              >
                <div className="flex flex-col items-center gap-2 text-center md:gap-4">
                  {Icon ? (
                    <Icon
                      className={`transition-colors duration-300 ${
                        tech.featured ? 'h-9 w-9 md:h-24 md:w-24' : 'h-7 w-7 md:h-14 md:w-14'
                      }`}
                    />
                  ) : (
                    <span className="text-[1.35rem] font-black italic leading-none tracking-[-0.12em] transition-colors duration-300 md:text-[3rem]">
                      {tech.wordmark}
                    </span>
                  )}
                  <span
                    className={`font-semibold transition-colors duration-300 ${
                      tech.featured ? 'text-xs md:text-2xl' : 'text-[0.7rem] md:text-base'
                    }`}
                  >
                    {tech.name}
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarDays, ChevronDown, Code2, ExternalLink, Figma, Layers3, Palette, Sparkles, UserRound, type LucideIcon } from 'lucide-react'
import { SiFramer, SiGreensock, SiHtml5, SiJavascript, SiNextdotjs, SiTailwindcss, SiThreedotjs, SiTypescript } from 'react-icons/si'
import type { IconType } from 'react-icons'

import BorderGlow from '@/components/BorderGlow'


const BORDER_GLOW_BACKGROUND = 'var(--site-card-glow-bg)'

interface ProjectSlide {
  type: 'image' | 'video'
  src: string
  objectPosition?: string
}

interface Project {
  id: number
  title: string
  displayTitle: string
  category: string
  summary: string
  description: string
  bulletPoints: string[]
  skills: string[]
  year: string
  slides: ProjectSlide[]
  accentColor: string
  accentSoftColor: string
  accentBorderColor: string
  glowColor: string
  glowColors: string[]
  liveSite: string
}

const projectsData: Project[] = [
  {
    id: 1,
    title: 'ANDCREATIVE',
    displayTitle: 'ANDCREATIVE',
    category: 'Web Design',
    summary: 'A visual agency site built to make the work feel premium before a visitor reads a word.',
    description:
      "A dark, visual-first website concept for a creative agency. The goal was to make the brand feel sharp, cinematic, and easy to understand from the first scroll.",
    bulletPoints: [
      'Visual direction for a premium creative brand',
      'Responsive pages with motion used to support the story',
      'Media-heavy sections structured to stay usable',
      'Clear path from first impression to contact',
    ],
    skills: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'UI/UX', 'Web Design'],
    year: '2026',
    slides: [
      { type: 'image', src: '/assets/projects/andcreativeproduct.png', objectPosition: 'top' },
      { type: 'video', src: '/assets/projects/creativehero.optimized.mp4' },
      { type: 'video', src: '/assets/projects/creativevisuals.optimized.mp4' },
      { type: 'image', src: '/assets/projects/andcreative.png', objectPosition: '52% 70%' },
    ],
    accentColor: '#f3f3f3',
    accentSoftColor: 'rgba(243, 243, 243, 0.14)',
    accentBorderColor: 'rgba(243, 243, 243, 0.42)',
    glowColor: '0 0 92',
    glowColors: ['#f3f3f3', '#f3f3f3', '#f3f3f3'],
    liveSite: 'andcreative.se',
  },
  {
    id: 2,
    title: 'Café & Bistro Kerma',
    displayTitle: 'TAHKON KERMA',
    category: 'Brand & Web',
    summary: 'A warm restaurant site focused on atmosphere, practical info, and local trust.',
    description:
      'A cozy web direction for Tahkon Kerma Café & Bistro, balancing atmosphere with the basics visitors need quickly: what it is, where it is, and why it feels worth visiting.',
    bulletPoints: [
      'Warm visual style matched to the restaurant setting',
      'Layout built around menu, location, and visit planning',
      'Brand and logo direction for a more finished identity',
      'Mobile-first structure for people checking details on the go',
    ],
    skills: ['Web Design', 'Logo Design', 'Brand Identity', 'UI/UX', 'HTML/CSS', 'JavaScript'],
    year: '2024',
    slides: [
      { type: 'image', src: '/assets/projects/kermaproduct.png', objectPosition: 'top' },
      { type: 'image', src: '/assets/projects/kerma.png', objectPosition: 'center' },
      { type: 'image', src: '/assets/projects/kermaproduct.png', objectPosition: '45% 35%' },
      { type: 'image', src: '/assets/projects/kermaproduct.png', objectPosition: '52% 70%' },
    ],
    accentColor: '#d4af37',
    accentSoftColor: 'rgba(212, 175, 55, 0.14)',
    accentBorderColor: 'rgba(212, 175, 55, 0.42)',
    glowColor: '43 63 55',
    glowColors: ['#d4af37', '#d4af37', '#d4af37'],
    liveSite: 'tahkonkerma.fi',
  },
  {
    id: 3,
    title: 'Portfolio Website',
    displayTitle: 'PORTFOLIO SYSTEM',
    category: 'Development',
    summary: 'My own portfolio, built to test how far I can push motion and presentation without losing usability.',
    description:
      'My personal portfolio and playground for polished frontend work. It is built to show taste, technical range, and the kind of detail I bring into client-facing websites.',
    bulletPoints: [
      'Custom interactive sections instead of a template layout',
      'Responsive structure tuned for desktop and mobile',
      'Motion and WebGL details balanced with performance work',
      'Clearer positioning for both portfolio and freelance inquiries',
    ],
    skills: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'GSAP', 'Three.js'],
    year: '2023',
    slides: [
      { type: 'image', src: '/assets/projects/portfolioproduct.png', objectPosition: 'top' },
      { type: 'image', src: '/assets/projects/ogportfolio.png', objectPosition: 'center' },
      { type: 'image', src: '/assets/projects/portfolioproduct.png', objectPosition: '45% 35%' },
      { type: 'image', src: '/assets/projects/portfolioproduct.png', objectPosition: '52% 70%' },
    ],
    accentColor: '#ff0066',
    accentSoftColor: 'rgba(255, 0, 102, 0.14)',
    accentBorderColor: 'rgba(255, 0, 102, 0.42)',
    glowColor: '332 100 58',
    glowColors: ['#ff0066', '#ff0066', '#ff0066'],
    liveSite: 'jespersjostrom.se',
  },
]

const brandSkillIcons: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  'Tailwind CSS': SiTailwindcss,
  'Framer Motion': SiFramer,
  'HTML/CSS': SiHtml5,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  GSAP: SiGreensock,
  'Three.js': SiThreedotjs,
}

const fallbackSkillIcons: Record<string, LucideIcon> = {
  'UI/UX': Figma,
  'Web Design': Palette,
  'Logo Design': Figma,
  'Brand Identity': Sparkles,
}

const ProjectCard = ({ project }: { project: Project }) => {
  const cardRef = useRef<HTMLElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [canAutoplayMedia, setCanAutoplayMedia] = useState(false)
  const accentLabelStyle = { '--project-accent': project.accentColor } as CSSProperties
  const slideCount = project.slides.length
  const currentSlide = project.slides[activeSlide]

  useEffect(() => {
    if (!cardRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '200px 0px', threshold: 0.05 },
    )

    observer.observe(cardRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateAutoplayPreference = () => setCanAutoplayMedia(!reducedMotionQuery.matches)

    updateAutoplayPreference()
    reducedMotionQuery.addEventListener('change', updateAutoplayPreference)

    return () => reducedMotionQuery.removeEventListener('change', updateAutoplayPreference)
  }, [])

  useEffect(() => {
    if (!cardRef.current) return

    const videos = Array.from(cardRef.current.querySelectorAll<HTMLVideoElement>('video[data-autoplay-preview]'))

    videos.forEach((video) => {
      const isVisible = video.getClientRects().length > 0

      if (canAutoplayMedia && isInView && isVisible) {
        video.muted = true
        void video.play().catch(() => undefined)
        return
      }

      video.pause()
    })
  }, [activeSlide, canAutoplayMedia, isInView])

  const nextSlide = () => {
    setDirection(1)
    setActiveSlide((prev) => (prev + 1) % slideCount)
  }

  const prevSlide = () => {
    setDirection(-1)
    setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount)
  }

  const goToSlide = (target: number) => {
    if (target === activeSlide) return
    setDirection(target > activeSlide ? 1 : -1)
    setActiveSlide(target)
  }

  return (
    <BorderGlow
      className="rounded-[28px]"
      edgeSensitivity={26}
      glowColor={project.glowColor}
      backgroundColor={BORDER_GLOW_BACKGROUND}
      borderRadius={28}
      glowRadius={34}
      glowIntensity={1.35}
      coneSpread={24}
      colors={project.glowColors}
      fillOpacity={0.4}
    >
      <article ref={cardRef} className="group overflow-hidden rounded-[28px] border border-[color:var(--site-border)] bg-[rgba(5,5,5,0.045)] text-[color:var(--site-text)] backdrop-blur-[4px] [backdrop-filter:blur(4px)_saturate(130%)] [-webkit-backdrop-filter:blur(4px)_saturate(130%)] dark:border-white/10">
        <div className="grid border-b border-[color:var(--site-border)] lg:grid-cols-[1.2fr_1fr] dark:border-white/10">
          <div className="relative min-h-[260px] overflow-hidden p-0 sm:min-h-[320px] lg:min-h-[520px] lg:p-8">
            <div className="relative z-10 mx-auto max-w-[760px] overflow-hidden rounded-t-[28px] border-b border-[color:var(--site-border)] bg-[rgba(5,5,5,0.045)] backdrop-blur-[4px] [backdrop-filter:blur(4px)_saturate(130%)] [-webkit-backdrop-filter:blur(4px)_saturate(130%)] dark:border-white/10 lg:mt-2 lg:rounded-2xl lg:border">
              <div className="group/image relative aspect-[16/10] lg:aspect-[4/3]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${project.id}-${activeSlide}`}
                    initial={{ x: direction > 0 ? 32 : -32, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction > 0 ? -32 : 32, opacity: 0 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 transition-transform duration-500 ease-out group-hover/image:scale-[1.02]"
                  >
                    {currentSlide.type === 'video' ? (
                      <video
                        data-autoplay-preview
                        src={currentSlide.src}
                        className="h-full w-full object-cover opacity-90"
                        autoPlay={canAutoplayMedia && isInView}
                        muted
                        loop
                        playsInline
                        preload={isInView ? 'metadata' : 'none'}
                        aria-label={`${project.title} preview ${activeSlide + 1}`}
                      />
                    ) : (
                      <Image
                        src={currentSlide.src}
                        alt={`${project.title} preview ${activeSlide + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover opacity-90"
                        style={{ objectPosition: currentSlide.objectPosition ?? 'center' }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--site-border)]/80 bg-[color:var(--site-hover)]/85 text-[color:var(--site-muted)] transition-all duration-200 hover:text-[color:var(--site-text)] dark:border-white/15 dark:bg-black/35 dark:text-white/75 lg:inline-flex"
                  aria-label="Previous project image"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--site-border)]/80 bg-[color:var(--site-hover)]/85 text-[color:var(--site-muted)] transition-all duration-200 hover:text-[color:var(--site-text)] dark:border-white/15 dark:bg-black/35 dark:text-white/75 lg:inline-flex"
                  aria-label="Next project image"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="relative z-20 mt-5 hidden gap-3 overflow-x-auto pb-1 lg:flex">
              {project.slides.map((slide, thumb) => (
                <button type="button" onClick={() => goToSlide(thumb)} key={`${project.id}-${thumb}`} className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border bg-[rgba(5,5,5,0.045)] backdrop-blur-[4px] [backdrop-filter:blur(4px)_saturate(130%)] [-webkit-backdrop-filter:blur(4px)_saturate(130%)] ${thumb === activeSlide ? 'border-accent ring-1 ring-accent/60' : 'border-[color:var(--site-border)] dark:border-white/10'}`} style={accentLabelStyle} aria-label={`Show preview ${thumb + 1}`} aria-pressed={thumb === activeSlide}>
                  {thumb === activeSlide && <span className="absolute inset-0 z-10 bg-accent/10" />}
                  {slide.type === 'video' ? (
                    <video
                      data-autoplay-preview
                      src={slide.src}
                      className="h-full w-full object-cover opacity-72"
                      autoPlay={canAutoplayMedia && isInView}
                      muted
                      loop
                      playsInline
                      preload={isInView ? 'metadata' : 'none'}
                      aria-label={`${project.title} preview ${thumb + 1}`}
                    />
                  ) : (
                    <Image
                      src={slide.src}
                      alt={`${project.title} preview ${thumb + 1}`}
                      fill
                      sizes="112px"
                      className="object-cover opacity-72"
                      style={{ objectPosition: slide.objectPosition ?? 'center' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 pt-7 sm:p-8 lg:p-10">
            <div className="mb-6 hidden items-center justify-between gap-3 lg:flex">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--project-accent)]" style={accentLabelStyle}>{project.category}</p>
              <span className="rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] px-3 py-1 text-xs font-semibold text-[color:var(--site-muted)] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/72">{project.year}</span>
            </div>
            <h3 className="text-4xl font-bold uppercase leading-tight tracking-tight text-[color:var(--site-text)] dark:text-white">{project.displayTitle}</h3>
            <p className="mt-5 border-b border-[color:var(--site-border)] pb-6 text-sm leading-7 text-[color:var(--site-muted)] dark:border-white/10 dark:text-white/72">{project.description}</p>

            <button
              type="button"
              onClick={() => setDetailsOpen((open) => !open)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] px-4 py-2 text-sm font-medium text-[color:var(--site-text)] transition-colors hover:border-accent/55 hover:text-accent lg:hidden"
              aria-expanded={detailsOpen}
            >
              {detailsOpen ? 'Hide details' : 'Show details'}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${detailsOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className="hidden lg:block">
              <div className="border-b border-[color:var(--site-border)] py-6 dark:border-white/10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--project-accent)]" style={accentLabelStyle}>Project Info</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 text-[color:var(--site-text)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><UserRound className="h-4 w-4" /></div>
                    <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Role</p><p className="text-sm dark:text-white/80">Designer & Developer</p></div>
                  </div>
                  <div className="flex items-center gap-3 text-[color:var(--site-text)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><CalendarDays className="h-4 w-4" /></div>
                    <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Duration</p><p className="text-sm dark:text-white/80">3 Weeks</p></div>
                  </div>
                  <div className="flex items-center gap-3 text-[color:var(--site-text)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><Layers3 className="h-4 w-4" /></div>
                    <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Type</p><p className="text-sm dark:text-white/80">Web Application</p></div>
                  </div>
                  <a href={`https://${project.liveSite}`} target="_blank" rel="noopener noreferrer" className="group/meta flex cursor-pointer items-center gap-3 text-left text-[color:var(--site-text)] transition-all duration-200 hover:text-accent">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] transition-all duration-200 group-hover/meta:-translate-y-0.5 group-hover/meta:translate-x-0.5 group-hover/meta:border-accent/70 group-hover/meta:text-accent dark:border-white/15 dark:bg-white/[0.04]"><ExternalLink className="h-4 w-4" /></div>
                    <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Live Site</p><p className="text-sm transition-transform duration-200 group-hover/meta:translate-x-0.5 dark:text-white/80">{project.liveSite}</p></div>
                  </a>
                </div>
              </div>

              <div className="pt-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--project-accent)]" style={accentLabelStyle}>Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] px-3 py-1.5 text-xs text-[color:var(--site-text)] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/72">
                      {(() => {
                        const BrandIcon = brandSkillIcons[skill]
                        const FallbackIcon = fallbackSkillIcons[skill] || Code2
                        return BrandIcon ? (
                          <BrandIcon className="h-3.5 w-3.5 text-[color:var(--project-accent)]" style={accentLabelStyle} />
                        ) : (
                          <FallbackIcon className="h-3.5 w-3.5 text-[color:var(--project-accent)]" style={accentLabelStyle} />
                        )
                      })()}
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {detailsOpen && (
                <motion.div
                  className="overflow-hidden lg:hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="border-b border-[color:var(--site-border)] py-6 dark:border-white/10">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--project-accent)]" style={accentLabelStyle}>Project Info</p>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-3 text-[color:var(--site-text)]">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><UserRound className="h-4 w-4" /></div>
                        <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Role</p><p className="text-sm dark:text-white/80">Designer & Developer</p></div>
                      </div>
                      <div className="flex items-center gap-3 text-[color:var(--site-text)]">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><CalendarDays className="h-4 w-4" /></div>
                        <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Duration</p><p className="text-sm dark:text-white/80">3 Weeks</p></div>
                      </div>
                      <div className="flex items-center gap-3 text-[color:var(--site-text)]">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><Layers3 className="h-4 w-4" /></div>
                        <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Type</p><p className="text-sm dark:text-white/80">Web Application</p></div>
                      </div>
                      <a href={`https://${project.liveSite}`} target="_blank" rel="noopener noreferrer" className="group/meta flex cursor-pointer items-center gap-3 text-left text-[color:var(--site-text)] transition-all duration-200 hover:text-accent">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] transition-all duration-200 group-hover/meta:-translate-y-0.5 group-hover/meta:translate-x-0.5 group-hover/meta:border-accent/70 group-hover/meta:text-accent dark:border-white/15 dark:bg-white/[0.04]"><ExternalLink className="h-4 w-4" /></div>
                        <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Live Site</p><p className="text-sm transition-transform duration-200 group-hover/meta:translate-x-0.5 dark:text-white/80">{project.liveSite}</p></div>
                      </a>
                    </div>
                  </div>

                  <div className="pt-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--project-accent)]" style={accentLabelStyle}>Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] px-3 py-1.5 text-xs text-[color:var(--site-text)] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/72">
                          {(() => {
                            const BrandIcon = brandSkillIcons[skill]
                            const FallbackIcon = fallbackSkillIcons[skill] || Code2
                            return BrandIcon ? (
                              <BrandIcon className="h-3.5 w-3.5 text-[color:var(--project-accent)]" style={accentLabelStyle} />
                            ) : (
                              <FallbackIcon className="h-3.5 w-3.5 text-[color:var(--project-accent)]" style={accentLabelStyle} />
                            )
                          })()}
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </article>
    </BorderGlow>
  )
}

const ExperienceSection: React.FC = () => {
  return (
    <section id="projects" className="site-section">
      <div className="container mx-auto px-6">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 34, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">Selected Work</p>
          <h2 className="section-title hidden md:block">My Past Projects</h2>
          <p className="section-description hidden md:block">
            A selection of websites and interface projects I&apos;ve designed and built.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto flex max-w-7xl flex-col gap-7"
          initial={{ opacity: 0, y: 52, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>


      </div>
    </section>
  )
}

export default ExperienceSection

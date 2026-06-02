"use client"

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, ChevronDown, Code2, ExternalLink, Eye, Figma, Layers3, Palette, Sparkles, UserRound, type LucideIcon } from 'lucide-react'
import { SiFramer, SiGreensock, SiHtml5, SiJavascript, SiNextdotjs, SiTailwindcss, SiThreedotjs, SiTypescript } from 'react-icons/si'
import type { IconType } from 'react-icons'
import { cinematicHeader, cinematicViewport } from '@/lib/site-motion'

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
  image: ProjectSlide
  accentColor: string
  accentSoftColor: string
  accentBorderColor: string
  glowColor: string
  glowColors: string[]
  atmosphereColor: string
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
    image: { type: 'image', src: '/assets/projects/andcreativeproduct.png', objectPosition: 'top' },
    accentColor: '#f3f3f3',
    accentSoftColor: 'rgba(243, 243, 243, 0.14)',
    accentBorderColor: 'rgba(243, 243, 243, 0.42)',
    glowColor: '0 0 92',
    glowColors: ['#f3f3f3', '#f3f3f3', '#f3f3f3'],
    atmosphereColor: 'rgba(242, 243, 245, 0.11)',
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
    image: { type: 'image', src: '/assets/projects/kermaipad.png', objectPosition: 'top' },
    accentColor: '#d4af37',
    accentSoftColor: 'rgba(212, 175, 55, 0.14)',
    accentBorderColor: 'rgba(212, 175, 55, 0.42)',
    glowColor: '43 63 55',
    glowColors: ['#d4af37', '#d4af37', '#d4af37'],
    atmosphereColor: 'rgba(181, 133, 76, 0.12)',
    liveSite: 'tahkonkerma.fi',
  },
  {
    id: 3,
    title: 'Old Portfolio',
    displayTitle: 'OLD PORTFOLIO',
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
    image: { type: 'image', src: '/assets/projects/portfolioproduct.png', objectPosition: 'top' },
    accentColor: '#ff0066',
    accentSoftColor: 'rgba(255, 0, 102, 0.14)',
    accentBorderColor: 'rgba(255, 0, 102, 0.42)',
    glowColor: '332 100 58',
    glowColors: ['#ff0066', '#ff0066', '#ff0066'],
    atmosphereColor: 'rgba(124, 99, 166, 0.11)',
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
  const previewBadgeRef = useRef<HTMLSpanElement>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [canAutoplayMedia, setCanAutoplayMedia] = useState(false)
  const [isProjectPreviewActive, setIsProjectPreviewActive] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const accentLabelStyle = { '--project-accent': project.accentColor } as CSSProperties
  const projectCardStyle = {
    '--project-accent': project.accentColor,
    '--project-atmosphere': project.atmosphereColor,
  } as CSSProperties

  const handleProjectPreviewPointerMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const badge = previewBadgeRef.current

    if (!badge) {
      return
    }

    badge.style.setProperty('--project-preview-x', `${event.clientX}px`)
    badge.style.setProperty('--project-preview-y', `${event.clientY}px`)
  }

  useEffect(() => {
    setHasMounted(true)
  }, [])

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
  }, [canAutoplayMedia, isInView])

  const projectPreviewBadge = (
    <span
      ref={previewBadgeRef}
      className={`project-preview-badge ${isProjectPreviewActive ? 'project-preview-badge--active' : ''}`}
      aria-hidden="true"
    >
      <span className="project-preview-badge__glow" />
      <svg className="project-preview-badge__ring" viewBox="0 0 100 100">
        <defs>
          <path id={`project-open-path-${project.id}`} d="M50 50 m -34 0 a 34 34 0 1 1 68 0 a 34 34 0 1 1 -68 0" />
        </defs>
        <text>
          <textPath href={`#project-open-path-${project.id}`} startOffset="0%">
            OPEN - VIEW - OPEN - VIEW - OPEN - VIEW - OPEN - VIEW -
          </textPath>
        </text>
      </svg>
      <span className="project-preview-badge__center">
        <Eye className="h-5 w-5" strokeWidth={1.8} />
      </span>
    </span>
  )

  return (
    <>
      <article ref={cardRef} className="project-card-atmosphere premium-glass-surface group overflow-hidden rounded-[28px]" style={projectCardStyle}>
        <div className="grid border-b border-[color:var(--site-border)] lg:grid-cols-[1.2fr_1fr] dark:border-white/10">
          <div className="relative min-h-[220px] overflow-hidden p-0 sm:min-h-[280px] lg:min-h-[440px] lg:p-8">
            <div className="relative z-10 mx-auto max-w-[760px] overflow-hidden rounded-t-[28px] border-b border-[color:var(--site-border)] bg-[rgba(0,0,0,0.15)] backdrop-blur-[4px] [backdrop-filter:blur(4px)_saturate(130%)] [-webkit-backdrop-filter:blur(4px)_saturate(130%)] dark:border-white/10 lg:mt-2 lg:rounded-2xl lg:border">
              <a
                href={`https://${project.liveSite}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} live site`}
                className="group/project-preview project-preview-link relative block aspect-[16/10] overflow-hidden lg:aspect-[4/3]"
                onMouseEnter={(event) => {
                  setIsProjectPreviewActive(true)
                  handleProjectPreviewPointerMove(event)
                }}
                onMouseMove={handleProjectPreviewPointerMove}
                onMouseLeave={() => setIsProjectPreviewActive(false)}
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/project-preview:scale-[1.035]">
                  {project.image.type === 'video' ? (
                    <video
                      data-autoplay-preview
                      src={project.image.src}
                      className="h-full w-full object-cover opacity-90"
                      autoPlay={canAutoplayMedia && isInView}
                      muted
                      loop
                      playsInline
                      preload={isInView ? 'metadata' : 'none'}
                      aria-label={`${project.title} preview`}
                    />
                  ) : (
                    <Image
                      src={project.image.src}
                      alt={`${project.title} preview`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover opacity-90"
                      style={{ objectPosition: project.image.objectPosition ?? 'center' }}
                    />
                  )}
                </div>
              </a>
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
      {hasMounted ? createPortal(projectPreviewBadge, document.body) : null}
    </>
  )
}

const ExperienceSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="projects" className="site-section">
      <div className="container mx-auto px-6">
        <motion.div
          className="mobile-no-load-animation section-header cinematic-section-header"
          variants={cinematicHeader}
          initial="hidden"
          whileInView="visible"
          viewport={cinematicViewport}
        >
          <p className="section-label">Selected Work</p>
          <h2 className="section-title">My Past Projects</h2>
        </motion.div>

        <div className="mobile-no-load-animation mx-auto flex max-w-7xl flex-col gap-7">
          {projectsData.map((project, index) => {
            const depthPreset = [
              { y: 52, scale: 0.985, blur: 10, duration: 0.92, delay: 0 },
              { y: 72, scale: 0.965, blur: 14, duration: 1.02, delay: 0.1 },
              { y: 88, scale: 0.95, blur: 18, duration: 1.14, delay: 0.2 },
            ][index] ?? { y: 72, scale: 0.965, blur: 14, duration: 1.02, delay: 0.1 }

            return (
              <motion.div
                key={project.id}
                className="mobile-no-load-animation cinematic-reveal-card"
                initial={shouldReduceMotion ? false : { opacity: 0, y: depthPreset.y, scale: depthPreset.scale, rotateX: 6, filter: `blur(${depthPreset.blur}px)` }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
                transition={{
                  duration: depthPreset.duration,
                  delay: shouldReduceMotion ? 0 : depthPreset.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ willChange: shouldReduceMotion ? 'auto' : 'transform, opacity, filter' }}
              >
                <ProjectCard project={project} />
              </motion.div>
            )
          })}
        </div>


      </div>
    </section>
  )
}

export default ExperienceSection

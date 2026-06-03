"use client"

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { ComponentType, SVGProps } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, BadgeCheck, ChevronDown, Clock3, Code2, Eye, Figma, Globe, MonitorSmartphone, Palette, Sparkles, type LucideIcon } from 'lucide-react'
import { SiAdobeillustrator, SiCss3, SiFigma, SiFramer, SiHtml5, SiJavascript, SiMongodb, SiNextdotjs, SiReact, SiShadcnui, SiTailwindcss, SiThreedotjs, SiTypescript, SiVercel } from 'react-icons/si'
import type { IconBaseProps } from 'react-icons'
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
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'motion.dev', 'shadcn/ui', 'GSAP', 'Vercel', 'Figma'],
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
    skills: ['React', 'Figma', 'Illustrator', 'Logo Design', 'HTML', 'CSS', 'JavaScript'],
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
    skills: ['Next.js', 'React', 'Figma', 'HTML', 'CSS', 'JavaScript', 'MongoDB'],
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

type SkillIconComponent = ComponentType<IconBaseProps | SVGProps<SVGSVGElement>>

const MotionDevIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 26 9" fill="none" aria-hidden="true" {...props}>
    <path d="M 9.587 0 L 4.57 9 L 0 9 L 3.917 1.972 C 4.524 0.883 6.039 0 7.301 0 Z M 20.794 2.25 C 20.794 1.007 21.817 0 23.079 0 C 24.341 0 25.364 1.007 25.364 2.25 C 25.364 3.493 24.341 4.5 23.079 4.5 C 21.817 4.5 20.794 3.493 20.794 2.25 Z M 10.443 0 L 15.013 0 L 9.997 9 L 5.427 9 Z M 15.841 0 L 20.411 0 L 16.494 7.028 C 15.887 8.117 14.372 9 13.11 9 L 10.825 9 Z" fill="currentColor" />
  </svg>
)

const GsapIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 30" fill="none" aria-hidden="true" {...props}>
    <path d="M23.81 14.012v.013l-1.075 4.666c-.058.264-.322.457-.626.457H20.81a.218.218 0 0 0-.208.156c-1.198 4.064-2.82 6.857-4.962 8.534-1.822 1.428-4.068 2.094-7.069 2.094-2.696 0-4.514-.867-6.056-2.579-2.038-2.262-2.88-5.966-2.37-10.428C1.065 8.548 5.41.095 13.776.095c2.545-.022 4.543.763 5.933 2.33 1.47 1.658 2.216 4.154 2.22 7.422a.55.55 0 0 1-.549.536h-6.13a.42.42 0 0 1-.407-.41c-.05-2.26-.72-3.36-2.052-3.36-2.35 0-3.736 3.19-4.471 4.958-1.027 2.47-1.55 5.153-1.447 7.825.049 1.244.249 2.993 1.43 3.718 1.047.642 2.541.216 3.446-.495.904-.712 1.632-1.943 1.938-3.066.043-.156.046-.277.005-.331-.043-.056-.162-.069-.253-.069h-1.574a.572.572 0 0 1-.438-.202.42.42 0 0 1-.087-.362l1.076-4.674c.053-.239.27-.42.537-.452v-.012h10.33c.024 0 .049 0 .072.005.268.035.457.284.452.556h.002Z" fill="currentColor" />
  </svg>
)

const brandSkillIcons: Record<string, SkillIconComponent> = {
  'Next.js': SiNextdotjs,
  React: SiReact,
  'Tailwind CSS': SiTailwindcss,
  'Framer Motion': SiFramer,
  'motion.dev': MotionDevIcon,
  'shadcn/ui': SiShadcnui,
  HTML: SiHtml5,
  CSS: SiCss3,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  GSAP: GsapIcon,
  Vercel: SiVercel,
  Figma: SiFigma,
  Illustrator: SiAdobeillustrator,
  MongoDB: SiMongodb,
  'Three.js': SiThreedotjs,
}

const fallbackSkillIcons: Record<string, LucideIcon> = {
  'UI/UX': Figma,
  'Web Design': Palette,
  'Logo Design': Palette,
  'Brand Identity': Sparkles,
}

const PROJECT_SKILL_ICON_COLOR = '#dac5a7'

const skillIconClassNames: Record<string, string> = {
  'motion.dev': 'h-[0.6rem] w-[1rem]',
  GSAP: 'h-[0.8rem] w-[0.65rem]',
}

const SkillChip = ({ skill }: { skill: string }) => {
  const BrandIcon = brandSkillIcons[skill]
  const FallbackIcon = fallbackSkillIcons[skill] || Code2
  const iconClassName = skillIconClassNames[skill] ?? 'h-3.5 w-3.5'

  return (
    <span className="project-skill-chip inline-flex items-center gap-1.5 rounded-[0.7rem] px-3 py-1.5 text-xs text-[color:var(--site-text)] dark:text-white/72">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {BrandIcon ? (
          <BrandIcon className={`${iconClassName} shrink-0`} style={{ color: PROJECT_SKILL_ICON_COLOR }} />
        ) : (
          <FallbackIcon className={`${iconClassName} shrink-0`} style={{ color: PROJECT_SKILL_ICON_COLOR }} />
        )}
      </span>
      {skill}
    </span>
  )
}

const projectDetailLabelStyle = { color: '#dac5a7' } as const

interface ProjectMetaItemProps {
  label: string
  value: string
  icon: LucideIcon
  href?: string
}

const ProjectMetaItem = ({ label, value, icon: Icon, href }: ProjectMetaItemProps) => {
  const content = (
    <>
      <span className="project-meta-card__icon-shell" aria-hidden="true">
        <Icon className="project-meta-card__icon" strokeWidth={1.8} />
      </span>
      <span className="project-meta-card__copy">
        <span className="project-meta-card__label">{label}</span>
        <span className="project-meta-card__value">
          {value}
          {href ? <ArrowUpRight className="project-meta-card__arrow" strokeWidth={1.9} /> : null}
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="project-meta-card group/meta-card">
        {content}
      </a>
    )
  }

  return <div className="project-meta-card">{content}</div>
}

const ProjectCard = ({ project }: { project: Project }) => {
  const cardRef = useRef<HTMLElement>(null)
  const previewBadgeRef = useRef<HTMLSpanElement>(null)
  const previewPointerTargetRef = useRef({ x: 0, y: 0 })
  const previewPointerCurrentRef = useRef({ x: 0, y: 0 })
  const previewAnimationFrameRef = useRef<number | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [canAutoplayMedia, setCanAutoplayMedia] = useState(false)
  const [isProjectPreviewActive, setIsProjectPreviewActive] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const accentLabelStyle = { '--project-accent': project.accentColor } as CSSProperties
  const projectCardStyle = {
    '--project-accent': project.accentColor,
    '--project-atmosphere': project.atmosphereColor,
  } as CSSProperties

  const syncProjectPreviewBadgePosition = (x: number, y: number) => {
    const badge = previewBadgeRef.current

    if (!badge) {
      return
    }

    badge.style.setProperty('--project-preview-x', `${x}px`)
    badge.style.setProperty('--project-preview-y', `${y}px`)
  }

  const handleProjectPreviewPointerEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = event

    previewPointerTargetRef.current = { x: clientX, y: clientY }
    previewPointerCurrentRef.current = { x: clientX, y: clientY }
    syncProjectPreviewBadgePosition(clientX, clientY)
    setIsProjectPreviewActive(true)
  }

  const handleProjectPreviewPointerMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = event

    previewPointerTargetRef.current = { x: clientX, y: clientY }

    if (shouldReduceMotion) {
      previewPointerCurrentRef.current = { x: clientX, y: clientY }
      syncProjectPreviewBadgePosition(clientX, clientY)
    }
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

  useEffect(() => {
    if (!isProjectPreviewActive || shouldReduceMotion) {
      if (previewAnimationFrameRef.current !== null) {
        cancelAnimationFrame(previewAnimationFrameRef.current)
        previewAnimationFrameRef.current = null
      }

      return
    }

    const animatePreviewBadge = () => {
      const current = previewPointerCurrentRef.current
      const target = previewPointerTargetRef.current

      current.x += (target.x - current.x) * 0.12
      current.y += (target.y - current.y) * 0.12

      if (Math.abs(target.x - current.x) < 0.1) {
        current.x = target.x
      }

      if (Math.abs(target.y - current.y) < 0.1) {
        current.y = target.y
      }

      syncProjectPreviewBadgePosition(current.x, current.y)
      previewAnimationFrameRef.current = requestAnimationFrame(animatePreviewBadge)
    }

    previewAnimationFrameRef.current = requestAnimationFrame(animatePreviewBadge)

    return () => {
      if (previewAnimationFrameRef.current !== null) {
        cancelAnimationFrame(previewAnimationFrameRef.current)
        previewAnimationFrameRef.current = null
      }
    }
  }, [isProjectPreviewActive, shouldReduceMotion])

  const projectPreviewBadge = (
    <span
      ref={previewBadgeRef}
      className={`project-preview-badge ${isProjectPreviewActive ? 'project-preview-badge--active' : ''}`}
      aria-hidden="true"
    >
      <span className="project-preview-badge__glow" />
      <svg className="project-preview-badge__orbit" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="project-preview-badge__orbit-line" cx="50" cy="50" r="48.25" pathLength="100" />
      </svg>
      <svg className="project-preview-badge__ring" viewBox="0 0 100 100">
        <defs>
          <path id={`project-open-path-${project.id}`} d="M50 50 m -34 0 a 34 34 0 1 1 68 0 a 34 34 0 1 1 -68 0" />
        </defs>
        <text className="project-preview-badge__label">
          <textPath href={`#project-open-path-${project.id}`} startOffset="12.5%" textAnchor="middle">
            OPEN
          </textPath>
        </text>
        <text className="project-preview-badge__label">
          <textPath href={`#project-open-path-${project.id}`} startOffset="45.75%" textAnchor="middle">
            EXPLORE
          </textPath>
        </text>
        <text className="project-preview-badge__label">
          <textPath href={`#project-open-path-${project.id}`} startOffset="81%" textAnchor="middle">
            DISCOVER
          </textPath>
        </text>
        <text className="project-preview-badge__separator">
          <textPath href={`#project-open-path-${project.id}`} startOffset="27.75%" textAnchor="middle">
            •
          </textPath>
        </text>
        <text className="project-preview-badge__separator">
          <textPath href={`#project-open-path-${project.id}`} startOffset="63.75%" textAnchor="middle">
            •
          </textPath>
        </text>
        <text className="project-preview-badge__separator">
          <textPath href={`#project-open-path-${project.id}`} startOffset="98.5%" textAnchor="middle">
            •
          </textPath>
        </text>
      </svg>
      <span className="project-preview-badge__center">
        <Eye className="h-6 w-6" strokeWidth={1.75} />
      </span>
    </span>
  )

  return (
    <>
      <article ref={cardRef} className="project-card-atmosphere premium-glass-surface group overflow-hidden rounded-[28px]" style={projectCardStyle}>
        <div className="grid border-b border-[color:var(--site-border)] lg:grid-cols-[1.2fr_1fr] dark:border-white/10">
          <div className="relative min-h-[220px] overflow-hidden p-0 sm:min-h-[280px] lg:min-h-[420px] lg:self-stretch lg:p-7">
            <div className="relative z-10 mx-auto max-w-[760px] overflow-hidden rounded-t-[28px] border-b border-[color:var(--site-border)] bg-[rgba(0,0,0,0.15)] backdrop-blur-[4px] [backdrop-filter:blur(4px)_saturate(130%)] [-webkit-backdrop-filter:blur(4px)_saturate(130%)] dark:border-white/10 lg:h-full lg:rounded-2xl lg:border">
              <a
                href={`https://${project.liveSite}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} live site`}
                className="group/project-preview project-preview-link relative block aspect-[16/10] overflow-hidden lg:h-full lg:aspect-auto"
                onMouseEnter={handleProjectPreviewPointerEnter}
                onMouseMove={handleProjectPreviewPointerMove}
                onMouseLeave={() => setIsProjectPreviewActive(false)}
              >
                <div className="project-preview-media absolute inset-0">
                  {project.image.type === 'video' ? (
                    <video
                      data-autoplay-preview
                      src={project.image.src}
                      className="h-full w-full object-cover"
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
                      className="object-cover"
                      style={{ objectPosition: project.image.objectPosition ?? 'center' }}
                    />
                  )}
                </div>
              </a>
            </div>
          </div>

          <div className="p-6 pt-7 sm:p-8 lg:flex lg:h-full lg:flex-col lg:px-9 lg:pb-9 lg:pt-8">
            <div className="mb-5 hidden items-center justify-between gap-3 lg:flex">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--project-accent)]" style={accentLabelStyle}>{project.category}</p>
              <span className="project-skill-chip inline-flex items-center rounded-[0.7rem] px-3 py-1.5 text-xs font-semibold text-[color:var(--site-muted)] dark:text-white/72">{project.year}</span>
            </div>
            <h3 className="text-4xl font-bold uppercase leading-tight tracking-tight text-[color:var(--site-text)] dark:text-white">{project.displayTitle}</h3>
            <p className="mt-4 pb-5 text-sm leading-7 text-[color:var(--site-muted)] dark:text-white/72">{project.description}</p>

            <button
              type="button"
              onClick={() => setDetailsOpen((open) => !open)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] px-4 py-2 text-sm font-medium text-[color:var(--site-text)] transition-colors hover:border-accent/55 hover:text-accent lg:hidden"
              aria-expanded={detailsOpen}
            >
              {detailsOpen ? 'Hide details' : 'Show details'}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${detailsOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className="hidden lg:flex lg:flex-1 lg:flex-col">
              <div className="py-5">
                <p className="mb-3.5 text-xs font-semibold uppercase tracking-[0.2em]" style={projectDetailLabelStyle}>Project Info</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ProjectMetaItem label="Role" value="Designer & Developer" icon={BadgeCheck} />
                  <ProjectMetaItem label="Duration" value="3 Weeks" icon={Clock3} />
                  <ProjectMetaItem label="Type" value="Web Application" icon={MonitorSmartphone} />
                  <ProjectMetaItem label="Live Site" value={project.liveSite} icon={Globe} href={`https://${project.liveSite}`} />
                </div>
              </div>

              <div className="pt-5 lg:mt-auto">
                <p className="mb-3.5 text-xs font-semibold uppercase tracking-[0.2em]" style={projectDetailLabelStyle}>Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <SkillChip key={skill} skill={skill} />
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
                  <div className="py-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]" style={projectDetailLabelStyle}>Project Info</p>
                    <div className="grid gap-4">
                      <ProjectMetaItem label="Role" value="Designer & Developer" icon={BadgeCheck} />
                      <ProjectMetaItem label="Duration" value="3 Weeks" icon={Clock3} />
                      <ProjectMetaItem label="Type" value="Web Application" icon={MonitorSmartphone} />
                      <ProjectMetaItem label="Live Site" value={project.liveSite} icon={Globe} href={`https://${project.liveSite}`} />
                    </div>
                  </div>

                  <div className="pt-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]" style={projectDetailLabelStyle}>Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <SkillChip key={skill} skill={skill} />
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

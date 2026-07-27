"use client"

import { useEffect, useMemo, useState, type CSSProperties, type ComponentType, type SVGProps } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  AppWindow,
  ArrowUpRight,
  Code2,
  Gauge,
  MonitorSmartphone,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  SiAdobeillustrator,
  SiCss3,
  SiFigma,
  SiFramer,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiReact,
  SiShadcnui,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
} from 'react-icons/si'
import type { IconBaseProps } from 'react-icons'
import { cinematicHeader, cinematicItem, cinematicViewport } from '@/lib/site-motion'
import { skillIconColors } from '@/lib/skill-colors'

interface ProjectSlide {
  type: 'image' | 'video'
  src: string
  objectPosition?: string
  objectFit?: CSSProperties['objectFit']
}

interface ProjectPaletteColor {
  name: string
  value: string
}

interface ProjectScopeItem {
  label: string
  /** Key into `brandSkillIcons` — renders the real tool logo in its brand colour. */
  brand?: string
  /** Fallback for deliverables that don't map to a tool. */
  icon?: LucideIcon
}

interface Project {
  id: number
  title: string
  displayTitle: string
  tagline: string
  logoSrc?: string
  logoAlt?: string
  skills: string[]
  palette: ProjectPaletteColor[]
  scope: ProjectScopeItem[]
  bulletPoints: string[]
  mediaCaption: string
  outcomes: string[]
  mediaImages: ProjectSlide[]
  image: ProjectSlide
  accentColor: string
  accentSoftColor: string
  accentBorderColor: string
  atmosphereColor: string
  liveSite: string
}

const projectsData: Project[] = [
  {
    id: 1,
    title: 'Andcreative',
    displayTitle: 'Andcreative',
    tagline: 'Photography & film agency',
    logoSrc: '/assets/andcreativewhite.png',
    logoAlt: 'AndCreative logo',
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'motion.dev', 'shadcn/ui', 'GSAP', 'Vercel', 'Figma'],
    palette: [
      { name: 'Cream', value: '#f5efe4' },
      { name: 'Graphite', value: '#676a70' },
      { name: 'Mist', value: '#d9d5cb' },
      { name: 'White', value: '#f3f3f3' },
    ],
    scope: [
      { label: 'Website design', brand: 'Figma' },
      { label: 'Frontend development', brand: 'Next.js' },
      { label: 'Motion & interaction', brand: 'GSAP' },
      { label: 'Image optimization', icon: Gauge },
    ],
    bulletPoints: [
      'Built a contact-focused photography site to improve visibility and turn visitors into leads.',
      'Optimized image delivery across media-heavy pages to keep the portfolio fast without losing quality.',
      'Created a responsive Next.js experience with motion and a clear path from the work to contact.',
    ],
    mediaCaption: 'Photography-led pages',
    outcomes: ['Website design', 'Website development', 'Image optimization', 'SEO structure', 'Responsive UI'],
    mediaImages: [
      { type: 'image', src: '/assets/projects/andcreative1.png', objectPosition: 'top' },
      { type: 'image', src: '/assets/projects/andcreative2.png', objectPosition: 'top' },
      { type: 'image', src: '/assets/projects/andcreativeproduct.webp', objectPosition: 'top' },
    ],
    image: { type: 'image', src: '/assets/projects/andcreativeproduct.webp', objectPosition: 'top' },
    accentColor: '#f3f3f3',
    accentSoftColor: 'rgba(243, 243, 243, 0.14)',
    accentBorderColor: 'rgba(243, 243, 243, 0.42)',
    atmosphereColor: 'rgba(242, 243, 245, 0.11)',
    liveSite: 'andcreative.se',
  },
  {
    id: 2,
    title: 'Cafe & Bistro Kerma',
    displayTitle: 'Tahkon Kerma',
    tagline: 'Cafe & bistro',
    logoSrc: '/assets/kermainverted.png',
    logoAlt: 'Tahkon Kerma logo',
    skills: ['React', 'Figma', 'Illustrator', 'Logo Design', 'HTML', 'CSS', 'JavaScript'],
    palette: [
      { name: 'Ink', value: '#141413' },
      { name: 'Cream', value: '#f7ead8' },
      { name: 'Kerma Gold', value: '#d4af37' },
      { name: 'Bronze', value: '#8b7355' },
      { name: 'Olive', value: '#8fa58a' },
    ],
    scope: [
      { label: 'Logo design', brand: 'Illustrator' },
      { label: 'Website design', brand: 'Figma' },
      { label: 'Frontend build', brand: 'React' },
      { label: 'Local SEO', icon: Search },
    ],
    bulletPoints: [
      'Built a customer-focused site around the menu, opening hours, location and reservation details.',
      'Created the logo and brand identity to give the restaurant a stronger, more consistent presence.',
      'Structured the site around local SEO so customers could actually find the restaurant online.',
    ],
    mediaCaption: 'Menu and visit pages',
    outcomes: ['Logo design', 'Website design', 'Local SEO', 'Menu pages', 'Responsive UI'],
    mediaImages: [
      { type: 'image', src: '/assets/projects/kermaipad.webp', objectPosition: 'top' },
      { type: 'image', src: '/assets/projects/kermaproduct.png', objectPosition: 'top' },
      { type: 'image', src: '/assets/projects/kermaipad.png', objectPosition: 'top' },
    ],
    image: { type: 'image', src: '/assets/projects/kermaipad.webp', objectPosition: 'top' },
    accentColor: '#d4af37',
    accentSoftColor: 'rgba(212, 175, 55, 0.14)',
    accentBorderColor: 'rgba(212, 175, 55, 0.42)',
    atmosphereColor: 'rgba(181, 133, 76, 0.12)',
    liveSite: 'tahkonkerma.fi',
  },
  {
    id: 3,
    title: 'Old Portfolio',
    displayTitle: 'Old Portfolio',
    tagline: 'Personal portfolio',
    skills: ['Next.js', 'React', 'Figma', 'HTML', 'CSS', 'JavaScript', 'MongoDB'],
    palette: [
      { name: 'Black', value: '#080808' },
      { name: 'Pink', value: '#ff0066' },
      { name: 'Violet', value: '#7c63a6' },
      { name: 'Cream', value: '#f5efe4' },
      { name: 'Blue', value: '#3898ec' },
    ],
    scope: [
      { label: 'Portfolio design', brand: 'Figma' },
      { label: 'Frontend build', brand: 'React' },
      { label: 'Backend & database', brand: 'MongoDB' },
      { label: 'Admin panel', icon: MonitorSmartphone },
    ],
    bulletPoints: [
      'Built a full portfolio website with a backend and admin area for managing page content.',
      'Added login-based access so the site could be edited without touching the frontend code.',
      'Used the project as exam work to understand how a complete web system fits together.',
    ],
    mediaCaption: 'Portfolio and admin views',
    outcomes: ['Portfolio UI', 'Admin panel', 'Backend', 'MongoDB', 'Authentication'],
    mediaImages: [
      { type: 'image', src: '/assets/projects/ogportfolionew.webp', objectPosition: 'top' },
      { type: 'image', src: '/assets/projects/ogportfolionew.webp', objectPosition: 'center' },
      { type: 'image', src: '/assets/projects/ogportfolionew.webp', objectPosition: 'bottom' },
    ],
    image: { type: 'image', src: '/assets/projects/ogportfolionew.webp', objectPosition: 'top' },
    accentColor: '#ff0066',
    accentSoftColor: 'rgba(255, 0, 102, 0.14)',
    accentBorderColor: 'rgba(255, 0, 102, 0.42)',
    atmosphereColor: 'rgba(124, 99, 166, 0.11)',
    liveSite: 'jespersjostrom2.github.io',
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

const skillIconClassNames: Record<string, string> = {
  'motion.dev': 'h-[0.72rem] w-[1.2rem]',
  GSAP: 'h-[1rem] w-[0.8rem]',
}

const scopeIconColors = ['#7fb4e8', '#b79cf0', '#68cfb4', '#f0c368']

const tileMotion = (order: number) => ({
  variants: cinematicItem(order * 0.05),
  initial: 'hidden' as const,
  animate: 'visible' as const,
})

// Every swatch is full-height and starts flush at the top, so the pill is always completely
// covered — nothing ever leaves the container. Sliding a colour DOWN is what uncovers the one
// stacked behind it; retracting slides it back up to flush, hiding that colour again.
const PALETTE_BAND_BOTTOM = 70
const PALETTE_STEP_MS = 560
const PALETTE_HOLD_MS = 1400

const usePaletteSequence = (moves: number, enabled: boolean) => {
  const [state, setState] = useState({ settled: 0, retracting: false })

  useEffect(() => {
    if (!enabled || moves < 1) return

    setState({ settled: 0, retracting: false })
    let timer: ReturnType<typeof setTimeout>
    let step = 0

    const tick = () => {
      // 0..moves-1 slides colours down one by one, moves..2*moves-1 slides them back up
      const cycle = step % (moves * 2)
      const isBuilding = cycle < moves
      const next = isBuilding ? cycle + 1 : moves - (cycle - moves) - 1
      setState({ settled: next, retracting: !isBuilding })
      const atBoundary = next === moves || next === 0
      step += 1
      timer = setTimeout(tick, atBoundary ? PALETTE_HOLD_MS : PALETTE_STEP_MS)
    }

    timer = setTimeout(tick, 600)

    return () => clearTimeout(timer)
  }, [moves, enabled])

  return state
}

const ProjectPalette = ({ project }: { project: Project }) => {
  const shouldReduceMotion = useReducedMotion()
  const total = project.palette.length
  // The backmost swatch rests flush at the top, so only the ones in front of it ever travel.
  const { settled, retracting } = usePaletteSequence(total - 1, !shouldReduceMotion)

  const restOffsets = useMemo(
    () =>
      project.palette.map((_, index) =>
        total === 1 ? 0 : PALETTE_BAND_BOTTOM - (PALETTE_BAND_BOTTOM * index) / (total - 1),
      ),
    [project.palette, total],
  )

  return (
    <motion.div className="project-bento-tile project-bento-tile--palette" {...tileMotion(0)}>
      <p className="project-bento-label">Colour Palette</p>
      <div className="project-palette-stack" aria-label={`${project.title} colour palette`}>
        {project.palette.map((color, index) => {
          const isDown = shouldReduceMotion || index < settled

          return (
            <motion.span
              key={color.name}
              className="project-palette-swatch"
              style={{ '--palette-color': color.value, zIndex: total - index } as CSSProperties}
              initial={false}
              animate={{ y: `${isDown ? restOffsets[index] : 0}%` }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : retracting
                    // Slight dip before it heads back up, so it reads as gathering momentum.
                    ? { duration: 0.66, ease: [0.36, -0.18, 0.4, 1] }
                    : { type: 'spring', stiffness: 96, damping: 17, mass: 1.1 }
              }
            />
          )
        })}
      </div>
    </motion.div>
  )
}

/** Four-point star used as both the ring's decoration and the delivered-list bullet. */
const StarMark = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 0c.6 6.2 5.2 10.8 12 12-6.8 1.2-11.4 5.8-12 12-.6-6.2-5.2-10.8-12-12C6.8 10.8 11.4 6.2 12 0Z" />
  </svg>
)

const ORBIT_STAR_ANGLES = [38, 128, 218, 308]

/**
 * Brand name orbiting an empty centre — the logo has its own tile. Reuses the circular
 * textPath treatment from the cursor-following badge in ProjectShowcaseMedia, but spins
 * continuously in place.
 */
const ORBIT_RADIUS = 37
const ORBIT_CIRCUMFERENCE = 2 * Math.PI * ORBIT_RADIUS

const BrandOrbitRing = ({ project }: { project: Project }) => {
  const pathId = `project-orbit-path-${project.id}`
  // One continuous string stretched to exactly one lap, so it can never overlap itself.
  const ringText = `${project.displayTitle} • ${project.tagline} • `

  return (
    <div className="project-orbit-ring">
      <svg className="project-orbit-ring__text" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path
            id={pathId}
            d={`M50 50 m -${ORBIT_RADIUS} 0 a ${ORBIT_RADIUS} ${ORBIT_RADIUS} 0 1 1 ${ORBIT_RADIUS * 2} 0 a ${ORBIT_RADIUS} ${ORBIT_RADIUS} 0 1 1 -${ORBIT_RADIUS * 2} 0`}
          />
        </defs>
        <text>
          <textPath
            href={`#${pathId}`}
            startOffset="0"
            textLength={ORBIT_CIRCUMFERENCE}
            lengthAdjust="spacing"
          >
            {ringText}
          </textPath>
        </text>
      </svg>

      {ORBIT_STAR_ANGLES.map((angle) => (
        <StarMark
          key={angle}
          className="project-orbit-ring__star h-3.5 w-3.5"
          style={{ '--star-angle': `${angle}deg` } as CSSProperties}
        />
      ))}
    </div>
  )
}

const ScopeRowIcon = ({ item, index }: { item: ProjectScopeItem; index: number }) => {
  const BrandIcon = item.brand ? brandSkillIcons[item.brand] : undefined

  if (BrandIcon) {
    return (
      <span className="project-scope-list__icon project-scope-list__icon--brand" aria-hidden="true">
        <BrandIcon
          className={`${skillIconClassNames[item.brand!] ?? 'h-4 w-4'} shrink-0`}
          style={{ color: skillIconColors[item.brand!] ?? '#f5efe4' }}
        />
      </span>
    )
  }

  const FallbackIcon = item.icon ?? Code2

  return (
    <span
      className="project-scope-list__icon"
      style={{ '--scope-color': scopeIconColors[index % scopeIconColors.length] } as CSSProperties}
      aria-hidden="true"
    >
      <FallbackIcon className="h-4 w-4" strokeWidth={1.9} />
    </span>
  )
}

const ProjectScope = ({ project }: { project: Project }) => (
  <motion.div className="project-bento-tile project-bento-tile--scope" {...tileMotion(1)}>
    <div className="project-scope-window">
      <div className="project-scope-window__bar">
        <span className="project-scope-window__app">
          <span className="project-scope-window__app-icon" aria-hidden="true">
            <AppWindow className="h-3.5 w-3.5" strokeWidth={2.1} />
          </span>
          Project scope
        </span>
        <span className="project-scope-window__close" aria-hidden="true">
          <X className="h-3.5 w-3.5" strokeWidth={2.4} />
        </span>
      </div>
      <div className="project-scope-window__byline">
        <span>Completed by:</span>
        <strong className="project-scope-window__byline-badge">Jesper</strong>
      </div>
      <div className="project-scope-list">
        {project.scope.map((item, index) => (
          <div key={item.label} className="project-scope-list__item">
            <ScopeRowIcon item={item} index={index} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <a href={`https://${project.liveSite}`} target="_blank" rel="noopener noreferrer" className="project-scope-window__link">
        open site
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </div>
  </motion.div>
)


const ProjectPreview = ({ project }: { project: Project }) => (
  <motion.div className="project-bento-tile project-bento-tile--preview" {...tileMotion(2)}>
    <BrandOrbitRing project={project} />
  </motion.div>
)

const ProjectBrandCard = ({ project }: { project: Project }) => (
  <motion.div className="project-bento-tile project-bento-tile--brand" {...tileMotion(4)}>
    <div className="project-brand-card__mark">
      {project.logoSrc ? (
        <Image src={project.logoSrc} alt={project.logoAlt ?? ''} width={150} height={90} className="h-auto max-h-20 w-auto max-w-[11rem] object-contain" />
      ) : (
        <span>{project.displayTitle.slice(0, 2)}</span>
      )}
    </div>
  </motion.div>
)

const ProjectDescription = ({ project }: { project: Project }) => (
  <motion.div className="project-bento-tile project-bento-tile--description" {...tileMotion(5)}>
    <p className="project-bento-tagline">{project.tagline}</p>
    <h3>{project.displayTitle}</h3>
    <a href={`https://${project.liveSite}`} target="_blank" rel="noopener noreferrer" className="project-bento-cta group/project-view">
      <span>Check live site</span>
      <span className="project-bento-cta__icon" aria-hidden="true">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </a>
  </motion.div>
)

const ProjectMediaProof = ({ project }: { project: Project }) => (
  <motion.div className="project-bento-tile project-bento-tile--media" {...tileMotion(3)}>
    <div className="project-media-stack">
      {project.mediaImages.slice(0, 3).map((media, index) => (
        <motion.div
          key={`${media.src}-${index}`}
          className="project-media-stack__frame"
          variants={cinematicItem(0.18 + index * 0.1)}
          initial="hidden"
          animate="visible"
        >
          <Image
            src={media.src}
            alt={`${project.title} supporting visual ${index + 1}`}
            fill
            sizes="(max-width: 1024px) 50vw, 18vw"
            className="object-cover"
            style={{
              objectFit: media.objectFit ?? 'cover',
              objectPosition: media.objectPosition ?? 'top',
            }}
          />
        </motion.div>
      ))}
    </div>

    <p className="project-media-caption">{project.mediaCaption}</p>
  </motion.div>
)

const ProjectDelivered = ({ project }: { project: Project }) => (
  <motion.div className="project-bento-tile project-bento-tile--delivered" {...tileMotion(6)}>
    <p className="project-bento-label">What I delivered</p>
    <ul className="project-delivered-list">
      {project.bulletPoints.map((point, index) => (
        <motion.li
          key={point}
          className="project-delivered-list__item"
          variants={cinematicItem(0.32 + index * 0.12)}
          initial="hidden"
          animate="visible"
        >
          <span className="project-delivered-list__star" aria-hidden="true">
            <StarMark className="h-3.5 w-3.5" />
          </span>
          <span className="project-delivered-list__copy">{point}</span>
        </motion.li>
      ))}
    </ul>
  </motion.div>
)

const ProjectOutcomes = ({ project }: { project: Project }) => (
  <motion.div className="project-bento-tile project-bento-tile--outcomes" {...tileMotion(7)}>
    <div className="project-outcome-ribbons">
      {project.outcomes.map((outcome) => (
        <span key={outcome}>{outcome}</span>
      ))}
    </div>
  </motion.div>
)

const ProjectCaseStudy = ({ project }: { project: Project }) => (
  <motion.div
    key={project.id}
    className="project-case-study-grid"
    style={{
      '--project-accent': project.accentColor,
      '--project-accent-soft': project.accentSoftColor,
      '--project-accent-border': project.accentBorderColor,
      '--project-atmosphere': project.atmosphereColor,
    } as CSSProperties}
    initial={{ opacity: 0, y: 18, scale: 0.985 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -14, scale: 0.985 }}
    transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
  >
    <ProjectPalette project={project} />
    <ProjectScope project={project} />
    <ProjectPreview project={project} />
    <ProjectMediaProof project={project} />
    <ProjectBrandCard project={project} />
    <ProjectDescription project={project} />
    <ProjectDelivered project={project} />
    <ProjectOutcomes project={project} />
  </motion.div>
)

const ExperienceSection: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState(projectsData[0].id)
  const shouldReduceMotion = useReducedMotion()
  const activeProject = projectsData.find((project) => project.id === activeProjectId) ?? projectsData[0]

  return (
    <section id="projects" className="site-section relative isolate">

      <div className="container mx-auto px-6">
        <motion.div
          className="mobile-no-load-animation section-header cinematic-section-header"
          variants={cinematicHeader}
          initial="hidden"
          whileInView="visible"
          viewport={cinematicViewport}
        >
          <h2 className="section-title">Past projects</h2>
        </motion.div>

        <motion.div
          className="mobile-no-load-animation mx-auto max-w-[92rem]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 42, scale: 0.99, rotateX: 4 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.14, margin: '0px 0px -14% 0px' }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: shouldReduceMotion ? 'auto' : 'transform, opacity' }}
        >
          <div className="project-bento-picker">
            <span>Pick a project:</span>
            <div className="project-bento-picker__buttons" role="tablist" aria-label="Project showcase picker">
              {projectsData.map((project) => {
                const isActive = project.id === activeProject.id

                return (
                  <button
                    key={project.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`project-bento-picker__button ${isActive ? 'project-bento-picker__button--active' : ''}`}
                    onClick={() => setActiveProjectId(project.id)}
                    style={{ '--project-accent': project.accentColor } as CSSProperties}
                  >
                    {project.logoSrc ? (
                      <Image src={project.logoSrc} alt="" width={58} height={38} className="h-auto max-h-8 w-auto max-w-12 object-contain" />
                    ) : (
                      <span>{project.displayTitle.slice(0, 2)}</span>
                    )}
                    <span className="sr-only">{project.displayTitle}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <ProjectCaseStudy project={activeProject} />
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default ExperienceSection

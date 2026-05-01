"use client"

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, ExternalLink, Layers3, Sparkles, UserRound } from 'lucide-react'

import BorderGlow from '@/components/BorderGlow'
import GlareHover from '@/components/GlareHover'

const BORDER_GLOW_BACKGROUND = 'var(--site-card-glow-bg)'

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
  image: string
  accentColor: string
  accentSoftColor: string
  accentBorderColor: string
  glowColor: string
  glowColors: string[]
}

const projectsData: Project[] = [
  {
    id: 1,
    title: 'ANDCREATIVE',
    displayTitle: 'ANDCREATIVE',
    category: 'Web Design',
    summary: 'A creative agency website focused on high-end visuals and storytelling.',
    description:
      "A modern, premium website built for a creative agency. 'VISUALS WITH MEANING' turns ideas into timeless visuals through photo and film.",
    bulletPoints: [
      'Sleek, dark-themed UI with a visual-first approach',
      'Smooth interactions and scroll animations',
      'Optimized media loading for high-resolution assets',
      'Responsive layout across all devices',
    ],
    skills: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'UI/UX', 'Web Design'],
    year: '2026',
    image: '/assets/projects/andcreative.png',
    accentColor: '#f3f3f3',
    accentSoftColor: 'rgba(243, 243, 243, 0.1)',
    accentBorderColor: 'rgba(243, 243, 243, 0.34)',
    glowColor: '0 0 92',
    glowColors: ['#f3f3f3', '#f3f3f3', '#f3f3f3'],
  },
  {
    id: 2,
    title: 'Café & Bistro Kerma',
    displayTitle: 'TAHKON KERMA',
    category: 'Brand & Web',
    summary: 'A restaurant website that reflects warmth, comfort, and a memorable guest experience.',
    description:
      'A website for Tahkon Kerma Café & Bistro designed to offer a cozy digital experience while showcasing menu, events, and ambience.',
    bulletPoints: [
      'Warm and inviting interface',
      'Integrated menu and reservation flow',
      'Brand identity and logo direction',
      'Smooth scrolling and subtle animations',
    ],
    skills: ['Web Design', 'Logo Design', 'Brand Identity', 'UI/UX', 'HTML/CSS', 'JavaScript'],
    year: '2024',
    image: '/assets/projects/kerma.png',
    accentColor: '#d4af37',
    accentSoftColor: 'rgba(212, 175, 55, 0.14)',
    accentBorderColor: 'rgba(212, 175, 55, 0.42)',
    glowColor: '43 63 55',
    glowColors: ['#d4af37', '#d4af37', '#d4af37'],
  },
  {
    id: 3,
    title: 'Portfolio Website',
    displayTitle: 'PORTFOLIO SYSTEM',
    category: 'Development',
    summary: 'An interactive portfolio built around motion, performance, and polished presentation.',
    description:
      'A modern portfolio experience showcasing projects, experience, and technical strengths through a responsive interactive interface.',
    bulletPoints: [
      'Custom interactive components and visual effects',
      'Responsive layouts across device sizes',
      'Motion-led sections with polished transitions',
      'Performance-minded structure and SEO foundations',
    ],
    skills: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'GSAP', 'Three.js'],
    year: '2023',
    image: '/assets/projects/ogportfolio.png',
    accentColor: '#ff0066',
    accentSoftColor: 'rgba(255, 0, 102, 0.14)',
    accentBorderColor: 'rgba(255, 0, 102, 0.42)',
    glowColor: '332 100 58',
    glowColors: ['#ff0066', '#ff0066', '#ff0066'],
  },
]

const ProjectCard = ({ project, index, total }: { project: Project; index: number; total: number }) => {
  const imageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const accentLabelStyle = { '--project-accent': project.accentColor } as CSSProperties

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
    <article className="warm-card-surface group overflow-hidden rounded-[28px]">
      <div className="grid border-b border-[color:var(--site-border)] lg:grid-cols-[1.2fr_1fr] dark:border-white/10">
        <div ref={imageRef} className="relative min-h-[360px] overflow-hidden p-6 sm:p-8 lg:min-h-[520px]">
          <div className="absolute left-6 top-6 z-20 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-white/85">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <button className="absolute left-6 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/85 backdrop-blur-sm lg:inline-flex" aria-label="Previous project image">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button className="absolute right-6 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/85 backdrop-blur-sm lg:inline-flex" aria-label="Next project image">
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(127,167,200,0.22),transparent_48%)]" />
          <motion.div style={{ y: imageY }} className="relative z-10 mx-auto mt-10 max-w-[640px] overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[16/10]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
          </motion.div>

          <div className="relative z-20 mt-5 flex gap-3 overflow-x-auto pb-1">
            {[0, 1, 2, 3].map((thumb) => (
              <div key={`${project.id}-${thumb}`} className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border ${thumb === 0 ? 'border-[color:var(--project-accent)]' : 'border-white/10'} bg-black/25`} style={accentLabelStyle}>
                <Image src={project.image} alt={`${project.title} preview ${thumb + 1}`} fill sizes="112px" className="object-cover object-center opacity-75" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--project-accent)]" style={accentLabelStyle}>{project.category}</p>
            <span className="rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] px-3 py-1 text-xs font-semibold text-[color:var(--site-muted)] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/72">{project.year}</span>
          </div>
          <h3 className="text-4xl font-bold uppercase leading-tight tracking-tight text-[color:var(--site-text)] dark:text-white">{project.displayTitle}</h3>
          <p className="mt-5 border-b border-[color:var(--site-border)] pb-6 text-sm leading-7 text-[color:var(--site-muted)] dark:border-white/10 dark:text-white/72">{project.description}</p>

          <div className="border-b border-[color:var(--site-border)] py-6 dark:border-white/10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--project-accent)]" style={accentLabelStyle}>Key Features</p>
            <ul className="space-y-2.5">
              {project.bulletPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] px-3 py-2 text-sm text-[color:var(--site-text)] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--project-accent)]" style={accentLabelStyle} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--project-accent)]" style={accentLabelStyle}>Technologies</p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] px-3 py-1.5 text-xs text-[color:var(--site-text)] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/72">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
        <div className="flex items-center gap-3 border-b border-[color:var(--site-border)] pb-3 sm:border-b-0 sm:pb-0 sm:border-r dark:border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><UserRound className="h-4 w-4" /></div>
          <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Role</p><p className="text-sm text-[color:var(--site-text)] dark:text-white/80">Designer & Developer</p></div>
        </div>
        <div className="flex items-center gap-3 border-b border-[color:var(--site-border)] pb-3 sm:border-b-0 sm:pb-0 sm:border-r dark:border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><CalendarDays className="h-4 w-4" /></div>
          <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Duration</p><p className="text-sm text-[color:var(--site-text)] dark:text-white/80">3 Weeks</p></div>
        </div>
        <div className="flex items-center gap-3 border-b border-[color:var(--site-border)] pb-3 sm:border-b-0 sm:pb-0 sm:border-r dark:border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><Layers3 className="h-4 w-4" /></div>
          <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Type</p><p className="text-sm text-[color:var(--site-text)] dark:text-white/80">Web Application</p></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-hover)] dark:border-white/15 dark:bg-white/[0.04]"><ExternalLink className="h-4 w-4" /></div>
          <div><p className="text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--site-muted)]">Live Site</p><p className="text-sm text-[color:var(--site-text)] dark:text-white/80">{project.title.toLowerCase().replace(/\s+/g, '')}.se</p></div>
        </div>
      </div>
    </article>
    </BorderGlow>
  )
}

const ExperienceSection: React.FC = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="projects" className="site-section">
      <div className="container mx-auto px-6">
        <div className="section-header">
          <p className="section-label">Selected Work</p>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-description">
            A collection of projects that demonstrate technical skills and creative problem-solving abilities.
          </p>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-7">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} total={projectsData.length} />
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-7xl pt-2 text-center">
          <div className="mb-5 flex items-center gap-4">
            <div className="site-divider-line h-px flex-1" />
            <div className="group/sparkles relative flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent transition-all duration-300 hover:border-accent/55 hover:bg-accent/15">
              <Sparkles className="h-5 w-5 transition-transform duration-300 ease-out group-hover/sparkles:scale-110" />
            </div>
            <div className="site-divider-line-reverse h-px flex-1" />
          </div>
          <p className="text-sm font-medium text-[color:var(--site-text)]">Have a project in mind?</p>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            I&apos;m always open to discussing new opportunities and exciting ideas.
          </p>
          <div className="mt-6 inline-flex cursor-pointer" onClick={scrollToContact}>
            <GlareHover
              width="auto"
              height="auto"
              background="#dac5a7"
              borderRadius="20px"
              borderColor="#dac5a7"
              className="relative cursor-pointer px-8 py-2 text-lg font-medium text-black transition-all duration-300 hover:!bg-none hover:!bg-transparent hover:!border-accent hover:text-[color:var(--site-text)] dark:hover:text-white"
            >
              <span className="flex cursor-pointer items-center gap-5">
                Let&apos;s Work Together
                <ArrowRight className="h-4 w-4" />
              </span>
            </GlareHover>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection

"use client"

import Image from 'next/image'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

import BorderGlow from '@/components/BorderGlow'
import GlareHover from '@/components/GlareHover'

const BORDER_GLOW_COLORS = ['#8b7355', '#dac5a7', '#f5efe4']
const BORDER_GLOW_HSL = '38 37 76'
const BORDER_GLOW_BACKGROUND = '#050505'

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
  },
]

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <BorderGlow
      className="rounded-[28px]"
      edgeSensitivity={26}
      glowColor={BORDER_GLOW_HSL}
      backgroundColor={BORDER_GLOW_BACKGROUND}
      borderRadius={28}
      glowRadius={34}
      glowIntensity={1.35}
      coneSpread={24}
      colors={BORDER_GLOW_COLORS}
      fillOpacity={0.4}
    >
    <article className="group overflow-hidden rounded-[28px] bg-[#080808]/90 shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:grid lg:grid-cols-[1.45fr_1fr]">
      <div className="relative min-h-[430px] overflow-hidden border-b border-white/10 lg:min-h-[520px] lg:border-b-0 lg:border-r">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover object-center opacity-70 transition-all duration-700 group-hover:scale-[1.035] group-hover:opacity-82"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86),rgba(0,0,0,0.42)_48%,rgba(0,0,0,0.1)),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.88))]" />

        <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-black/45 text-lg font-semibold text-white backdrop-blur-md">
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="absolute bottom-8 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {project.category}
          </div>
          <h3 className="max-w-xl text-3xl font-bold uppercase leading-tight tracking-tight text-white md:text-4xl">
            {project.displayTitle}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/78 md:text-base">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-5 rounded-full border border-white/25 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-accent/55 hover:bg-accent hover:text-background"
            >
              View Project
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Overview</p>
            <p className="text-sm leading-7 text-white/70">{project.description}</p>
          </div>
          <span className="shrink-0 rounded-full border border-accent/30 px-3 py-1 text-xs font-semibold text-accent">
            {project.year}
          </span>
        </div>

        <div className="border-t border-white/10 py-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Key Features</p>
          <ul className="space-y-3">
            {project.bulletPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-6 text-white/78">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 fill-accent/20 text-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 pt-7">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Technologies</p>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <span key={skill} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/72">
                {skill}
              </span>
            ))}
          </div>
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
    <section id="projects" className="bg-background/50 py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-accent/70">
            <span className="h-px w-7 bg-accent/70" />
            Work
            <span className="h-px w-7 bg-accent/70" />
          </div>
          <h2 className="mb-5 text-4xl font-bold text-white md:text-5xl">Featured Projects</h2>
          <p className="text-lg text-muted-foreground">
            A collection of projects that demonstrate technical skills and creative problem-solving abilities.
          </p>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-7">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-7xl pt-2 text-center">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/10" />
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent shadow-[0_0_28px_rgba(218,197,167,0.1)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/10" />
          </div>
          <p className="text-sm font-medium text-white/78">Have a project in mind?</p>
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
              className="relative cursor-pointer px-8 py-2 text-lg font-medium text-black transition-all duration-300 hover:!bg-none hover:!bg-transparent hover:!border-accent hover:text-white"
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

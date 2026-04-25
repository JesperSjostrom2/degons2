'use client'

import { type MouseEvent as ReactMouseEvent } from 'react'
import { gsap } from 'gsap'
import {
  BriefcaseBusiness,
  Code2,
  Cpu,
  GraduationCap,
  Store,
  type LucideIcon,
} from 'lucide-react'

import BorderGlow from '@/components/BorderGlow'
import ShinyText from '@/blocks/TextAnimations/ShinyText/ShinyText'

interface Experience {
  id: number
  company: string
  role: string
  period: string
  summary: string
  skills: string[]
  category: string
  meta: string
  icon: LucideIcon
  current?: boolean
}

const experienceData: Experience[] = [
  {
    id: 1,
    company: 'Wolt',
    role: 'Operations Support Specialist',
    period: '2024 - Present',
    summary:
      'Supporting daily operations in a fast-moving environment, improving internal workflows, and helping teams deliver a more consistent customer experience.',
    skills: ['Operations', 'Support', 'Process Improvement', 'Cross-functional Work'],
    category: 'Operations',
    meta: 'Fast-paced tech environment',
    icon: BriefcaseBusiness,
    current: true,
  },
  {
    id: 2,
    company: 'Cafe & Bistro Kerma',
    role: 'Brand & Web Developer + Restaurant Co-manager',
    period: '2023 - 2024',
    summary:
      'Owned both the brand and digital presence while helping manage restaurant operations, from building the website and identity to maintaining close customer relationships.',
    skills: ['Web Development', 'Brand Design', 'Restaurant Operations', 'Client Communication'],
    category: 'Brand & Web',
    meta: 'Hospitality and digital presence',
    icon: Store,
  },
  {
    id: 3,
    company: 'Vello',
    role: 'Frontend Developer',
    period: '2022 - 2023',
    summary:
      'Built and maintained frontend interfaces with modern web technologies, translating product and design ideas into polished, production-ready user experiences.',
    skills: ['React', 'TypeScript', 'Frontend Architecture', 'UI Implementation'],
    category: 'Product Team',
    meta: 'Frontend product development',
    icon: Code2,
  },
  {
    id: 4,
    company: 'KYH',
    role: 'Frontend Developer Education',
    period: '2021 - 2023',
    summary:
      'Completed a focused frontend education covering modern JavaScript, React, interface development, and the practical foundations needed to build for the web.',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Version Control'],
    category: 'Education',
    meta: 'Higher vocational frontend studies',
    icon: GraduationCap,
  },
  {
    id: 5,
    company: 'Ostra Gymnasium',
    role: 'Computer Engineering Studies',
    period: '2020 - 2021',
    summary:
      'Built an early technical foundation through computer engineering studies focused on programming, systems thinking, and structured problem-solving.',
    skills: ['Programming Basics', 'Computer Engineering', 'Technical Problem Solving'],
    category: 'Foundation',
    meta: 'Technical high school program',
    icon: Cpu,
  },
]

const BORDER_GLOW_COLORS = ['#8b7355', '#dac5a7', '#f5efe4']
const BORDER_GLOW_HSL = '38 37 76'
const BORDER_GLOW_BACKGROUND = '#050505'
const GLOW_COLOR = '218, 197, 167'

const createClickGlow = (event: ReactMouseEvent<HTMLElement>) => {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const maxDistance = Math.max(
    Math.hypot(x, y),
    Math.hypot(x - rect.width, y),
    Math.hypot(x, y - rect.height),
    Math.hypot(x - rect.width, y - rect.height),
  )

  const ripple = document.createElement('div')
  ripple.style.cssText = `
    position: absolute;
    width: ${maxDistance * 2}px;
    height: ${maxDistance * 2}px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${GLOW_COLOR}, 0.4) 0%, rgba(${GLOW_COLOR}, 0.2) 30%, transparent 70%);
    left: ${x - maxDistance}px;
    top: ${y - maxDistance}px;
    pointer-events: none;
    z-index: 20;
  `

  card.appendChild(ripple)

  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 1 },
    {
      scale: 1,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => ripple.remove(),
    },
  )
}

const TimelineExperience: React.FC = () => {
  return (
    <section id="experience" className="bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.28em] text-accent/70">Experience</p>
          <h2 className="mb-5 text-4xl font-bold text-white md:text-5xl">Professional Journey</h2>
          <p className="text-lg text-muted-foreground">
            A cleaner overview of the roles, environments, and responsibilities that shaped how I build,
            collaborate, and solve problems.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
          {experienceData.map((experience) => {
            const Icon = experience.icon

            return (
              <BorderGlow
                key={experience.id}
                className="h-full rounded-[28px]"
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
                <article
                  onClick={createClickGlow}
                  className="relative h-full overflow-hidden rounded-[28px] bg-card/20 p-5 backdrop-blur-sm sm:p-5"
                >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 items-start gap-3.5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] text-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-xl font-semibold text-white">{experience.company}</h3>
                        <span className="rounded-full border border-accent/15 bg-accent/10 px-3 py-1 text-xs font-medium text-accent/85">
                          {experience.category}
                        </span>
                        {experience.current ? (
                          <span className="rounded-full border border-accent/20 bg-accent/12 px-3 py-1 text-xs font-medium text-accent">
                            Current
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{experience.meta}</p>
                    </div>
                  </div>

                  <div className="pl-[3.75rem] text-left md:pl-0 md:text-right">
                    {experience.current ? (
                      <ShinyText
                        text={experience.period}
                        speed={2.4}
                        delay={0.7}
                        color="rgba(255, 255, 255, 0.72)"
                        shineColor="#ffffff"
                        spread={115}
                        className="text-lg font-semibold md:text-xl"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-white/75 md:text-xl">{experience.period}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-[22px] border border-white/6 bg-black/35 p-4 sm:p-5">
                  <div className="flex flex-col gap-3.5">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{experience.role}</h4>
                      <p className="mt-2.5 text-sm leading-6 text-muted-foreground sm:text-[15px]">
                        {experience.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {experience.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-xs text-white/78"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                </article>
              </BorderGlow>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TimelineExperience

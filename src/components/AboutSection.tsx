'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { Clock3, MapPin } from 'lucide-react'
import { SiBackbonedotjs, SiCypress, SiCss3, SiFigma, SiGithub, SiGit, SiHtml5, SiJavascript, SiNodedotjs, SiNextdotjs, SiPostman, SiReact, SiTailwindcss, SiTypescript, SiVercel } from 'react-icons/si'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

import SocialLinks from '@/components/social-links'
import { cinematicEase, cinematicViewport } from '@/lib/site-motion'
import { skillIconColors } from '@/lib/skill-colors'

const experience = [
  {
    dates: 'Apr 2024 to present',
    company: 'Freelance',
    role: 'Frontend Developer',
    visual: 'freelance',
    image: '/assets/minilogobg.png',
    location: 'Helsinki, Finland',
    workplace: 'Remote',
    accent: '#dac5a7',
    details: [
      { lead: 'Responsive websites.', text: 'Design and build them from layout through launch.' },
      { lead: 'Client work.', text: 'Work directly with clients on structure and feedback.' },
      { lead: 'Personal projects.', text: 'Keep improving through new website concepts.' },
    ],
    tools: [
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'React', icon: SiReact },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Git', icon: SiGit },
      { name: 'Vercel', icon: SiVercel },
      { name: 'Figma', icon: SiFigma },
    ],
  },
  {
    dates: 'Nov 2023 to May 2024',
    company: 'Cafe and Bistro Kerma',
    role: 'Brand and Web Developer',
    visual: 'kerma',
    image: '/assets/kermainverted.png',
    location: 'Kuopio, Finland',
    workplace: 'On site',
    accent: '#c2a77b',
    details: [
      { lead: 'Website.', text: 'Built it from scratch with an online menu and reservation system.' },
      { lead: 'Branding.', text: 'Designed the logo and refined the site with the owner.' },
      { lead: 'Customer experience.', text: 'Made the menu, opening hours, location, and reservation details easy to find on mobile.' },
    ],
    tools: [
      { name: 'React', icon: SiReact },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'HTML', icon: SiHtml5 },
      { name: 'CSS', icon: SiCss3 },
      { name: 'Git', icon: SiGit },
    ],
  },
  {
    dates: 'Nov 2022 to Apr 2023',
    company: 'Vello',
    role: 'Frontend Developer',
    visual: 'vello',
    image: '/assets/vello.png',
    location: 'Helsinki, Finland',
    workplace: 'On site',
    accent: '#8fa58a',
    details: [
      { lead: 'Frontend development.', text: 'Contributed to interface design and project work.' },
      { lead: 'Team work.', text: 'Learned coding practices from senior developers.' },
      { lead: 'Professional experience.', text: 'Built stronger communication and problem solving skills.' },
    ],
    tools: [
      { name: 'Backbone.js', icon: SiBackbonedotjs },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Postman', icon: SiPostman },
      { name: 'Cypress', icon: SiCypress },
      { name: 'GitHub', icon: SiGithub },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'HTML', icon: SiHtml5 },
      { name: 'CSS', icon: SiCss3 },
    ],
  },
]

const education = [
  {
    school: 'KYH',
    program: 'Frontend Developer',
    dates: 'Aug 2021 to May 2023',
    detail: 'Specialization in frontend development',
  },
  {
    school: 'Östra Gymnasium',
    program: 'Computer Engineering',
    dates: 'Aug 2020 to Jun 2021',
    detail: 'Specialization in web development',
  },
]

export default function AboutSection() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 95%', 'end 5%'],
  })
  const timelineProgress = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 28,
    mass: 0.35,
  })
  const markerTop = useTransform(timelineProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="about" className="about-scene about-career-section relative overflow-hidden py-20 md:py-28">
      <div className="about-scene-ambient pointer-events-none absolute inset-0" />
      <div className="about-scene-depth pointer-events-none absolute inset-0" />
      <div className="about-scene-haze pointer-events-none absolute inset-0" />
      <div className="about-scene-vignette pointer-events-none absolute inset-0" />
      <div className="about-scene-grain pointer-events-none absolute inset-0 opacity-25" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="about-story-layout mx-auto max-w-6xl">
          <motion.div
            className="about-story-copy"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={cinematicViewport}
            transition={{ duration: 0.7, delay: 0.08, ease: cinematicEase }}
          >
            <h2 className="section-title">My story</h2>
            <p className="about-career-copy">
              I&apos;m Jesper. I&apos;m from Sweden and now live in Helsinki, Finland. I first got exposed to Java in school in 2016, and that was the start of me getting into development.
            </p>
            <p className="about-career-copy">
              In 2020 I graduated as a high school engineer, and in 2023 I graduated as a frontend developer. After that I worked full time as a frontend developer, which gave me a solid base for building real projects.
            </p>
            <p className="about-career-copy">
              Design quickly became the part I enjoyed most, so I decided to go freelance and focus on the kind of websites I actually want to build while helping people get a stronger online presence.
            </p>
            <p className="about-story-closing">
              When I&apos;m not working, you can usually find me gaming, working out, or working on websites and other things I&apos;m into.
            </p>
            <div className="about-story-socials">
              <SocialLinks />
            </div>
          </motion.div>

          <motion.div
            className="about-story-portrait-wrap"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={cinematicViewport}
            transition={{ duration: 0.8, delay: 0.16, ease: cinematicEase }}
          >
            <div className="about-story-planet">
              <span className="about-story-planet-light" aria-hidden="true" />
              <div className="about-story-portrait" role="img" aria-label="Portrait of Jesper">
                <span className="about-story-portrait-corner" aria-hidden="true" />
              </div>
            </div>

          </motion.div>
        </div>

        <motion.div
          className="mobile-no-load-animation section-header cinematic-section-header about-experience-heading"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={cinematicViewport}
          transition={{ duration: 0.7, ease: cinematicEase }}
        >
          <h2 className="section-title">Experience</h2>
        </motion.div>

        <div ref={timelineRef} className="about-career-timeline mx-auto max-w-7xl">
          <div className="about-career-rail" aria-hidden="true">
            <span className="about-career-rail-base" />
            <motion.span
              className="about-career-rail-progress"
              style={{ scaleY: shouldReduceMotion ? 1 : timelineProgress }}
            />
            <motion.span
              className="about-career-marker"
              style={{ top: shouldReduceMotion ? '100%' : markerTop }}
            >
              <span className="about-career-marker-portrait" />
            </motion.span>
          </div>

          {experience.map((item, index) => (
            <motion.article
              key={`${item.company}-${item.role}`}
              className="about-career-entry"
              style={{ '--career-accent': item.accent } as CSSProperties}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.72, delay: index * 0.08, ease: cinematicEase }}
            >
              <div className="about-career-meta">
                <p className="about-career-dates">{item.dates}</p>
                <div className="about-career-company-line">
                  <span className={`about-career-company-mark about-career-company-mark-${item.visual}`} aria-hidden="true">
                    <Image src={item.image} alt="" width={64} height={64} unoptimized />
                  </span>
                  <div>
                    <h3>{item.company}</h3>
                  </div>
                </div>
                <div className="about-career-meta-rows">
                  <p className="about-career-location">
                    <MapPin aria-hidden="true" />
                    {item.location}
                  </p>
                  <p className="about-career-location">
                    <Clock3 aria-hidden="true" />
                    Full time · {item.workplace}
                  </p>
                </div>
              </div>

              <div className="about-career-axis-point" aria-hidden="true">
                <span />
              </div>

              <div className="about-career-content">
                <div className="about-career-role-heading">
                  <h3>{item.role}</h3>
                </div>
                <ul className="about-career-details">
                  {item.details.map((detail) => (
                    <li key={detail.lead}>
                      <strong>{detail.lead}</strong> {detail.text}
                    </li>
                  ))}
                </ul>
                <div className="about-career-skills" aria-label="Tools used">
                  {item.tools.map(({ name, icon: ToolIcon }) => (
                    <span key={name} className="project-skill-chip inline-flex items-center gap-1.5 rounded-[0.7rem] px-3 py-1.5 text-xs text-[color:var(--site-text)] dark:text-white/72">
                      <ToolIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" style={{ color: skillIconColors[name] ?? '#b0aea5' }} />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="about-education mx-auto mt-16 max-w-7xl md:mt-20"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={cinematicViewport}
          transition={{ duration: 0.72, ease: cinematicEase }}
        >
          <div className="about-education-heading">
            <h3>Education</h3>
          </div>

          <div className="about-education-list">
            {education.map((item) => (
              <article key={item.school}>
                <div>
                  <h4>{item.school}</h4>
                  <p>{item.program}</p>
                </div>
                <p>{item.detail}</p>
                <span>{item.dates}</span>
              </article>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

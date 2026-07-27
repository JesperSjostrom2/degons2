'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, CalendarClock, ChevronDown, Github, Linkedin, Loader2, Mail, MessageSquare, UserRound } from 'lucide-react'
import { FiMail } from 'react-icons/fi'
import { cinematicHeader, cinematicPanel, cinematicViewport } from '@/lib/site-motion'

const projectTypes = ['Landing page', 'SaaS', 'SEO improvements', 'Redesign', 'Branding']

const frequentlyAskedQuestions = [
  {
    question: 'Do I need a finished brief?',
    answer: 'No. A rough idea, a reference, or a link is enough to start the conversation.',
  },
  {
    question: 'What kind of websites do you build?',
    answer: 'I work on a wide range of website projects, including personal sites, portfolios, business websites, product pages, landing pages, redesigns, and more. If you have something specific in mind, feel free to ask.',
  },
  {
    question: 'How much does a website cost?',
    answer: 'Every project is scoped individually, so I do not use a fixed price list. Once I understand your goals, pages, and functionality, I will send a clear quote before any work begins.',
  },
  {
    question: 'How long does a project take?',
    answer: 'The timeline depends on the scope and feedback speed. After our first conversation, I will outline the expected schedule and milestones before we begin.',
  },
  {
    question: 'How does the project work?',
    answer: 'We define the goal, agree on the direction, then move through design, development, feedback, and launch with clear next steps.',
  },
  {
    question: 'Can you improve an existing site?',
    answer: 'Yes. I can refine the design, improve usability, rebuild weak sections, or give the whole site a clearer direction.',
  },
]

const socialLinks = [
  {
    name: 'GitHub',
    handle: '@jespersjostrom2',
    href: 'https://github.com/jespersjostrom2',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    handle: 'jesper sjöström',
    href: 'https://www.linkedin.com/in/jesper-sj%C3%B6str%C3%B6m-521995232/',
    icon: Linkedin,
  },
  {
    name: 'Email',
    handle: 'contact@jespersjostrom.com',
    href: 'mailto:contact@jespersjostrom.com',
    icon: FiMail,
  },
]

export default function ContactSection() {
  const socialGridRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [projectType, setProjectType] = useState(projectTypes[0])
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const [activeSocial, setActiveSocial] = useState<string | null>(null)
  const [hoverBounds, setHoverBounds] = useState({
    opacity: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    borderRadius: '0px',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const moveSocialFill = useCallback((element: HTMLElement, socialName: string) => {
    const grid = socialGridRef.current

    if (!grid) {
      return
    }

    const gridRect = grid.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    const threshold = 2
    const touchesRight = Math.abs(elementRect.right - gridRect.right) <= threshold
    const touchesBottom = Math.abs(elementRect.bottom - gridRect.bottom) <= threshold
    const touchesLeft = Math.abs(elementRect.left - gridRect.left) <= threshold
    const radius = '20px'

    setActiveSocial(socialName)
    setHoverBounds({
      opacity: 1,
      x: elementRect.left - gridRect.left,
      y: elementRect.top - gridRect.top,
      width: elementRect.width,
      height: elementRect.height,
      borderRadius: `0px 0px ${touchesBottom && touchesRight ? radius : '0px'} ${touchesBottom && touchesLeft ? radius : '0px'}`,
    })
  }, [])

  const hideSocialFill = useCallback(() => {
    setActiveSocial(null)
    setHoverBounds((currentBounds) => ({ ...currentBounds, opacity: 0 }))
  }, [])

  const hoverFillStyle = {
    opacity: hoverBounds.opacity,
    transform: `translate3d(${hoverBounds.x}px, ${hoverBounds.y}px, 0)`,
    width: hoverBounds.width,
    height: hoverBounds.height,
    borderRadius: hoverBounds.borderRadius,
  } as CSSProperties

  useEffect(() => {
    if (status === 'sent') {
      const timer = setTimeout(() => setStatus('idle'), 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, projectType, budget, message }),
      })

      const rawResponse = await response.text()
      const data = rawResponse ? JSON.parse(rawResponse) : {}

      if (!response.ok) {
        throw new Error(data.error || 'Could not send message.')
      }

      setStatus('sent')

      setName('')
      setEmail('')
      setProjectType(projectTypes[0])
      setBudget('')
      setMessage('')
    } catch (error) {
      console.error('[ContactSection] mail failed to send', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Could not send message.')
    }
  }

  return (
    <section id="contact" className="site-section relative isolate min-h-screen">
      <div className="container relative mx-auto px-6">
        <motion.div
          className="mobile-no-load-animation section-header cinematic-section-header"
          variants={cinematicHeader}
          initial="hidden"
          whileInView="visible"
          viewport={cinematicViewport}
        >
          <h2 className="section-title">Let&apos;s talk about your site</h2>
          <p className="section-description">
            Tell me what you&apos;re building, where it stands, and what you want next.
          </p>
        </motion.div>

        <motion.div
          className="mobile-no-load-animation cinematic-reveal-card mx-auto max-w-7xl"
          variants={cinematicPanel('deep')}
          initial="hidden"
          whileInView="visible"
          viewport={cinematicViewport}
        >
            <div className="contact-panel relative z-10 grid overflow-hidden rounded-[28px] border border-[color:var(--rim-border)] lg:grid-cols-[1fr_1.2fr]">
              <aside className="flex flex-col border-b border-white/[0.07] p-6 md:p-8 lg:border-b-0 lg:border-r">
                <h3 className="mb-6 text-xl font-bold tracking-[-0.025em] text-[color:var(--site-text)] md:text-2xl">Frequently asked questions</h3>

                {/* Hugs its content rather than stretching to the column
                    height — otherwise the rows have to absorb the slack and
                    the box reads as half empty. */}
                <div className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-white/[0.02]">
                  {frequentlyAskedQuestions.map((item, index) => {
                    const isOpen = openQuestion === index
                    return (
                      // Natural height, never flex-1 + justify-center: that
                      // made every row share the container height and
                      // re-centre its content whenever one opened, which is
                      // what threw the questions upward.
                      <div
                        key={item.question}
                        className="border-b border-white/[0.07] last:border-b-0"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-${index}`}
                          onClick={() => setOpenQuestion(isOpen ? null : index)}
                          className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium"
                        >
                          <span className="bg-gradient-to-b from-[#dcd7cc] to-[#8f8b82] bg-clip-text text-transparent transition-opacity duration-300 group-hover:opacity-75">
                            {item.question}
                          </span>
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="shrink-0 text-lg font-light text-[color:var(--site-muted)]"
                          >
                            +
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.div
                              id={`faq-answer-${index}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-white/[0.06] px-4 py-4">
                                <p className="text-sm leading-6 text-muted-foreground">
                                  {item.answer}
                                </p>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </aside>

              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-4 pl-0.5">
                    <span className="flex items-center gap-2 text-base font-semibold text-[color:var(--site-text)]"><UserRound className="h-4 w-4 text-[color:var(--site-muted)]" />Name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="w-full rounded-[20px] border border-[color:var(--site-border)] bg-white/[0.035] px-4 py-3 text-[color:var(--site-text)] outline-none transition-colors duration-300 placeholder:text-[#8f8b82] focus:border-accent/60 focus:bg-white/[0.065] dark:rounded-[20px] dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-white/50 dark:focus:bg-white/[0.065]"
                        placeholder="Your name"
                      />
                  </label>

                  <label className="space-y-4 pl-0.5">
                    <span className="flex items-center gap-2 text-base font-semibold text-[color:var(--site-text)]"><Mail className="h-4 w-4 text-[color:var(--site-muted)]" />Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="w-full rounded-[20px] border border-[color:var(--site-border)] bg-white/[0.035] px-4 py-3 text-[color:var(--site-text)] outline-none transition-colors duration-300 placeholder:text-[#8f8b82] focus:border-accent/60 focus:bg-white/[0.065] dark:rounded-[20px] dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-white/50 dark:focus:bg-white/[0.065]"
                        placeholder="you@example.com"
                      />
                  </label>

                  <label className="space-y-4 pl-0.5">
                    <span className="flex items-center gap-2 text-base font-semibold text-[color:var(--site-text)]"><BriefcaseBusiness className="h-4 w-4 text-[color:var(--site-muted)]" />Project type</span>
                    <div className="relative">
                      <select
                        value={projectType}
                        onChange={(event) => setProjectType(event.target.value)}
                        className="w-full appearance-none rounded-[20px] border border-[color:var(--site-border)] bg-white/[0.035] py-3 pl-4 pr-12 text-[color:var(--site-text)] outline-none transition-colors duration-300 focus:border-accent/60 focus:bg-white/[0.065] dark:rounded-[20px] dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:focus:bg-white/[0.065]"
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type} className="bg-[#050505] text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--site-muted)] dark:text-white/50" />
                    </div>
                  </label>

                  <label className="space-y-4 pl-0.5">
                    <span className="flex items-center gap-2 text-base font-semibold text-[color:var(--site-text)]"><CalendarClock className="h-4 w-4 text-[color:var(--site-muted)]" />Budget / timeline</span>
                    <input
                      value={budget}
                      onChange={(event) => setBudget(event.target.value)}
                        className="w-full rounded-[20px] border border-[color:var(--site-border)] bg-white/[0.035] px-4 py-3 text-[color:var(--site-text)] outline-none transition-colors duration-300 placeholder:text-[#8f8b82] focus:border-accent/60 focus:bg-white/[0.065] dark:rounded-[20px] dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-white/50 dark:focus:bg-white/[0.065]"
                        placeholder="Optional, even a rough range helps"
                      />
                  </label>
                </div>

                <label className="mt-4 block space-y-4 pl-0.5">
                  <span className="flex items-center gap-2 text-base font-semibold text-[color:var(--site-text)]"><MessageSquare className="h-4 w-4 text-[color:var(--site-muted)]" />Message</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    rows={7}
                    className="w-full resize-none rounded-[20px] border border-[color:var(--site-border)] bg-white/[0.035] px-4 py-3 text-[color:var(--site-text)] outline-none transition-colors duration-300 placeholder:text-[#8f8b82] focus:border-accent/60 focus:bg-white/[0.065] dark:rounded-[20px] dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-white/50 dark:focus:bg-white/[0.065]"
                    placeholder="Tell me a bit about what you need."
                  />
                </label>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                    {status === 'sent'
                      ? 'Message sent. I will get back to you soon.'
                      : status === 'error'
                        ? errorMessage
                        : 'Usually replies within one to two business days.'}
                  </p>
                  <div className="relative shrink-0">
                    <button
                      type="submit"
                      disabled={status === 'sending' || status === 'sent'}
                      className="group/contact-cta relative flex h-[48px] min-w-max cursor-pointer items-center overflow-hidden rounded-full border border-[#dac5a7]/20 bg-[#141413]/40 pl-7 pr-1.5 text-base font-medium text-[#f5efe4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#f5efe4]/70 disabled:pointer-events-none disabled:opacity-70"
                    >
                      {status === 'sending' ? (
                        <>
                          <span className="relative z-10 mr-5 whitespace-nowrap">Sending...</span>
                          <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5efe4] text-[#141413]">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </span>
                        </>
                      ) : status === 'sent' ? (
                        <>
                          <span className="relative z-10 mr-5 whitespace-nowrap">Sent!</span>
                          <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5efe4] text-[#141413]">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-[#f5efe4] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/contact-cta:right-0 group-hover/contact-cta:h-full group-hover/contact-cta:w-full" />
                          <span className="relative z-10 mr-5 whitespace-nowrap transition-colors duration-300 group-hover/contact-cta:text-[#141413]">Send inquiry</span>
                          <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[#141413]">
                            <ArrowRight className="absolute h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/contact-cta:translate-x-5 group-hover/contact-cta:opacity-0" />
                            <ArrowRight className="absolute h-4 w-4 -translate-x-5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/contact-cta:translate-x-0 group-hover/contact-cta:opacity-100" />
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>

              <div className="border-t border-[color:var(--site-border)] lg:col-span-2 dark:border-white/10">
                <p className="px-6 pb-4 pt-5 text-sm text-muted-foreground">You can also reach me here.</p>
                <div
                  ref={socialGridRef}
                  onPointerLeave={hideSocialFill}
                  className="relative grid overflow-hidden border-t border-[color:var(--site-border)] sm:grid-cols-3 dark:border-white/10"
                >
                  <div
                    className="pointer-events-none absolute left-0 top-0 z-0 bg-[#c2a77b] transition-[transform,width,height,border-radius,opacity] duration-300 ease-out"
                    style={hoverFillStyle}
                  />
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    const isExternal = social.href.startsWith('http')
                    const isActive = activeSocial === social.name

                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noreferrer' : undefined}
                        onPointerEnter={(event) => moveSocialFill(event.currentTarget, social.name)}
                        onFocus={(event) => moveSocialFill(event.currentTarget, social.name)}
                        onBlur={hideSocialFill}
                        className={`group relative z-10 flex min-w-0 items-center gap-3 px-6 py-5 transition-colors duration-300 ${index < socialLinks.length - 1 ? 'border-b sm:border-b-0 sm:border-r' : ''} border-[color:var(--site-border)] ${isActive ? 'text-background' : 'text-[color:var(--site-text)] dark:text-white/90'}`}
                      >
                        <Icon className="h-5 w-5 shrink-0 transition-colors duration-300" />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{social.name}</span>
                          <span className={`block truncate text-xs transition-colors duration-300 ${isActive ? 'text-background/70' : 'text-muted-foreground'}`}>{social.handle}</span>
                        </span>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
        </motion.div>

      </div>
    </section>
  )
}

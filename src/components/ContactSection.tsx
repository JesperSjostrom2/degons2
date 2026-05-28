'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Github, Linkedin, Loader2, type LucideIcon } from 'lucide-react'
import { FiMail } from 'react-icons/fi'
import type { IconType } from 'react-icons'

const projectTypes = ['Landing page', 'Business website', 'Portfolio', 'Redesign / UI polish', 'Frontend build', 'Other']

interface SocialLink {
  name: string
  handle: string
  href: string
  icon: LucideIcon | IconType
}

interface HoverBounds {
  opacity: number
  x: number
  y: number
  width: number
  height: number
  borderRadius: string
}

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    handle: '@jespersjostrom2',
    href: 'https://github.com/jespersjostrom2',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    handle: 'jesper-sjostrom',
    href: 'https://www.linkedin.com/in/jesper-sj%C3%B6str%C3%B6m-521995232/',
    icon: Linkedin,
  },
  {
    name: 'Email',
    handle: 'contact@jespersjostrom.se',
    href: 'mailto:contact@jespersjostrom.se',
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
  const [activeSocial, setActiveSocial] = useState<string | null>(null)
  const [hoverBounds, setHoverBounds] = useState<HoverBounds>({
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
    const touchesTop = Math.abs(elementRect.top - gridRect.top) <= threshold
    const touchesRight = Math.abs(elementRect.right - gridRect.right) <= threshold
    const touchesBottom = Math.abs(elementRect.bottom - gridRect.bottom) <= threshold
    const touchesLeft = Math.abs(elementRect.left - gridRect.left) <= threshold
    const radius = '24px'

    setActiveSocial(socialName)
    setHoverBounds({
      opacity: 1,
      x: elementRect.left - gridRect.left,
      y: elementRect.top - gridRect.top,
      width: elementRect.width,
      height: elementRect.height,
      borderRadius: `${touchesTop && touchesLeft ? radius : '0px'} ${touchesTop && touchesRight ? radius : '0px'} ${touchesBottom && touchesRight ? radius : '0px'} ${touchesBottom && touchesLeft ? radius : '0px'}`,
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
    <section id="contact" className="site-section min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div
          className="mobile-no-load-animation section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08, margin: '0px 0px -18% 0px' }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-label">Contact</p>
          <h2 className="section-title">Let&apos;s talk about your site</h2>
          <p className="section-description">
            Tell me what you need online: a landing page, portfolio, business site, redesign, or just a better first impression.
          </p>
        </motion.div>

        <motion.div
          className="mobile-no-load-animation mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 52, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.08, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 0.75, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="surface-hover-glow premium-glass-surface relative grid overflow-hidden rounded-[28px] backdrop-blur-sm lg:grid-cols-[0.9fr_1.35fr]">
              <aside className="flex flex-col justify-between border-b border-[color:var(--site-border)] p-6 md:p-8 lg:border-b-0 lg:border-r dark:border-white/10">
                <div>
                  <p className="mb-3 text-sm uppercase tracking-[0.24em] text-accent/70">Find Me</p>
                  <h3 className="text-2xl font-bold tracking-[-0.025em] text-[color:var(--site-text)] md:text-3xl">Send the rough version</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    You do not need a polished brief. A goal, a link, or a few notes is enough to start the conversation.
                  </p>
                </div>

                <div
                  ref={socialGridRef}
                  onPointerLeave={hideSocialFill}
                  className="premium-glass-surface relative mt-8 grid overflow-hidden rounded-[24px] sm:grid-cols-3 lg:grid-cols-1"
                >
                  <div
                    className="pointer-events-none absolute left-0 top-0 z-0 bg-[#a88c62] transition-[transform,width,height,border-radius,opacity] duration-300 ease-out"
                    style={hoverFillStyle}
                  />

                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    const isActive = activeSocial === social.name
                    const isExternal = social.href.startsWith('http')

                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noreferrer' : undefined}
                        onPointerEnter={(event) => moveSocialFill(event.currentTarget, social.name)}
                        onFocus={(event) => moveSocialFill(event.currentTarget, social.name)}
                        onBlur={hideSocialFill}
                        className={`group relative z-10 flex min-h-32 items-center gap-4 border-b border-[color:var(--site-border)] p-5 transition-colors duration-300 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b lg:border-r-0 dark:border-white/10 ${
                          isActive ? 'text-background' : 'text-[color:var(--site-text)] hover:text-background dark:text-white/90'
                        }`}
                      >
                        <Icon className="h-9 w-9 shrink-0 transition-colors duration-300" />
                        <span>
                          <span className="block text-lg font-semibold">{social.name}</span>
                          <span className={`mt-1 block break-all text-sm transition-colors duration-300 ${isActive ? 'text-background/70' : 'text-[color:var(--site-muted)] group-hover:text-background/70 dark:text-white/45'}`}>
                            {social.handle}
                          </span>
                        </span>
                      </a>
                    )
                  })}
                </div>
              </aside>

              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[color:var(--site-text)]">Name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                        className="w-full rounded-xl border border-[color:var(--site-border)] bg-[rgba(5,5,5,0.045)] px-4 py-3 text-[color:var(--site-text)] outline-none transition-colors duration-300 placeholder:text-[color:var(--site-muted)] focus:border-accent/60 focus:bg-[rgba(5,5,5,0.1)] dark:rounded-2xl dark:border-white/10 dark:bg-[rgba(5,5,5,0.045)] dark:text-white dark:placeholder:text-white/30 dark:focus:bg-[rgba(5,5,5,0.1)]"
                        placeholder="Your name"
                      />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[color:var(--site-text)]">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                        className="w-full rounded-xl border border-[color:var(--site-border)] bg-[rgba(5,5,5,0.045)] px-4 py-3 text-[color:var(--site-text)] outline-none transition-colors duration-300 placeholder:text-[color:var(--site-muted)] focus:border-accent/60 focus:bg-[rgba(5,5,5,0.1)] dark:rounded-2xl dark:border-white/10 dark:bg-[rgba(5,5,5,0.045)] dark:text-white dark:placeholder:text-white/30 dark:focus:bg-[rgba(5,5,5,0.1)]"
                        placeholder="you@example.com"
                      />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[color:var(--site-text)]">Project type</span>
                    <div className="relative">
                      <select
                        value={projectType}
                        onChange={(event) => setProjectType(event.target.value)}
                        className="w-full appearance-none rounded-xl border border-[color:var(--site-border)] bg-[rgba(5,5,5,0.045)] py-3 pl-4 pr-12 text-[color:var(--site-text)] outline-none transition-colors duration-300 focus:border-accent/60 focus:bg-[rgba(5,5,5,0.1)] dark:rounded-2xl dark:border-white/10 dark:bg-[rgba(5,5,5,0.045)] dark:text-white dark:focus:bg-[rgba(5,5,5,0.1)]"
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

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-[color:var(--site-text)]">Budget / timeline</span>
                    <input
                      value={budget}
                      onChange={(event) => setBudget(event.target.value)}
                        className="w-full rounded-xl border border-[color:var(--site-border)] bg-[rgba(5,5,5,0.045)] px-4 py-3 text-[color:var(--site-text)] outline-none transition-colors duration-300 placeholder:text-[color:var(--site-muted)] focus:border-accent/60 focus:bg-[rgba(5,5,5,0.1)] dark:rounded-2xl dark:border-white/10 dark:bg-[rgba(5,5,5,0.045)] dark:text-white dark:placeholder:text-white/30 dark:focus:bg-[rgba(5,5,5,0.1)]"
                        placeholder="Optional, even a rough range helps"
                      />
                  </label>
                </div>

                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-medium text-[color:var(--site-text)]">Message</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    rows={7}
                    className="w-full resize-none rounded-xl border border-[color:var(--site-border)] bg-[rgba(5,5,5,0.045)] px-4 py-3 text-[color:var(--site-text)] outline-none transition-colors duration-300 placeholder:text-[color:var(--site-muted)] focus:border-accent/60 focus:bg-[rgba(5,5,5,0.1)] dark:rounded-2xl dark:border-white/10 dark:bg-[rgba(5,5,5,0.045)] dark:text-white dark:placeholder:text-white/30 dark:focus:bg-[rgba(5,5,5,0.1)]"
                    placeholder="What are you trying to put online, improve, or explain better?"
                  />
                </label>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                    {status === 'sent'
                      ? 'Message sent. I will get back to you soon.'
                      : status === 'error'
                        ? errorMessage
                        : 'I read every message myself and reply with an honest next step.'}
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
            </div>
        </motion.div>
      </div>
    </section>
  )
}

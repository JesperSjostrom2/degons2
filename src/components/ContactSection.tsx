'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { ChevronDown, Github, Linkedin, Loader2, Mail, type LucideIcon } from 'lucide-react'
import { SendIcon } from '@/components/ui/animated-state-icons'

import BorderGlow from '@/components/BorderGlow'

const BORDER_GLOW_COLORS = ['#8b7355', '#dac5a7', '#f5efe4']
const BORDER_GLOW_HSL = '38 37 76'
const BORDER_GLOW_BACKGROUND = '#050505'

const projectTypes = ['Website', 'Frontend app', 'Portfolio', 'UI polish', 'Other']

interface SocialLink {
  name: string
  handle: string
  href: string
  icon: LucideIcon
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
    handle: '@jespersjostrom',
    href: 'https://github.com/jespersjostrom',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    handle: 'jespersjostrom',
    href: 'https://linkedin.com/in/jespersjostrom',
    icon: Linkedin,
  },
  {
    name: 'Email',
    handle: 'contact@jespersjostrom.se',
    href: 'mailto:contact@jespersjostrom.se',
    icon: Mail,
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
    console.log('[ContactSection] submit started', {
      name,
      email,
      projectType,
      budget,
      messageLength: message.length,
      status,
    })

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

      console.log('[ContactSection] API response received', {
        ok: response.ok,
        status: response.status,
        data,
      })

      if (!response.ok) {
        throw new Error(data.error || 'Could not send message.')
      }

      setStatus('sent')
      console.log('[ContactSection] mail successfully sent', { id: data.id })

      const notification = document.createElement('div')
      notification.className = 'fixed bottom-24 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transform translate-y-full transition-transform duration-300'
      notification.style.background = '#2a2a2a'
      notification.style.border = '1px solid #4a4a4a'
      notification.style.color = '#ffffff'
      notification.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <div class="font-medium">Message sent!</div>
            <div class="text-sm opacity-70">Your inquiry has been successfully sent.</div>
          </div>
        </div>
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.style.transform = 'translateY(0)'
      }, 10)
      
      setTimeout(() => {
        notification.style.transform = 'translateY(100%)'
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)

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
    <section id="contact" className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.28em] text-accent/70">Contact</p>
          <h2 className="mb-5 text-4xl font-bold text-white md:text-5xl">Let&apos;s Build Something</h2>
          <p className="text-lg text-muted-foreground">
            Tell me what you want to create, improve, or launch. Send the details here or reach me through the links beside it.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
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
            <div className="relative grid overflow-hidden rounded-[28px] bg-card/20 backdrop-blur-sm lg:grid-cols-[0.9fr_1.35fr]">
              <aside className="flex flex-col justify-between border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
                <div>
                  <p className="mb-3 text-sm uppercase tracking-[0.24em] text-accent/70">Find Me</p>
                  <h3 className="text-2xl font-bold text-white md:text-3xl">More ways to connect</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Prefer a quick intro, code deep-dive, or a direct email? These stay close to the form so the next step feels connected.
                  </p>
                </div>

                <div
                  ref={socialGridRef}
                  onPointerLeave={hideSocialFill}
                  className="relative mt-8 grid overflow-hidden rounded-[24px] border border-white/10 bg-black/30 sm:grid-cols-3 lg:grid-cols-1"
                >
                  <div
                    className="pointer-events-none absolute left-0 top-0 z-0 bg-accent transition-[transform,width,height,border-radius,opacity] duration-300 ease-out"
                    style={hoverFillStyle}
                  />

                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    const isActive = activeSocial === social.name

                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={social.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                        onPointerEnter={(event) => moveSocialFill(event.currentTarget, social.name)}
                        onFocus={(event) => moveSocialFill(event.currentTarget, social.name)}
                        onBlur={hideSocialFill}
                        className={`group relative z-10 flex min-h-32 items-center gap-4 border-b border-white/10 p-5 transition-colors duration-300 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b lg:border-r-0 ${
                          isActive ? 'text-background' : 'text-white/90 hover:text-background'
                        }`}
                      >
                        <Icon className="h-9 w-9 shrink-0 transition-colors duration-300" />
                        <span>
                          <span className="block text-lg font-semibold">{social.name}</span>
                          <span className={`mt-1 block break-all text-sm transition-colors duration-300 ${isActive ? 'text-background/70' : 'text-white/45 group-hover:text-background/70'}`}>
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
                    <span className="text-sm font-medium text-white/75">Name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-accent/45"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white/75">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-accent/45"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white/75">Project type</span>
                    <div className="relative">
                      <select
                        value={projectType}
                        onChange={(event) => setProjectType(event.target.value)}
                        className="w-full appearance-none rounded-2xl border border-white/10 bg-black/35 py-3 pl-4 pr-12 text-white outline-none transition-colors duration-300 focus:border-accent/45"
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type} className="bg-[#050505]">
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white/75">Budget / timeline</span>
                    <input
                      value={budget}
                      onChange={(event) => setBudget(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-accent/45"
                      placeholder="Optional"
                    />
                  </label>
                </div>

                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-medium text-white/75">Message</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    rows={7}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-accent/45"
                    placeholder="A short description of the project, goals, and what you need help with."
                  />
                </label>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    {status === 'sent'
                      ? 'Message sent. I will get back to you soon.'
                      : status === 'error'
                        ? errorMessage
                        : 'Messages are sent directly through the form.'}
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'sending' || status === 'sent'}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/35 bg-accent/15 px-6 py-3 text-sm font-semibold text-accent transition-colors duration-300 hover:bg-accent hover:text-background disabled:pointer-events-none disabled:opacity-70"
                  >
                    {status === 'sending' ? (
                      <>
                        Sending...
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        {status === 'sent' ? 'Sent!' : 'Send inquiry'}
                        <SendIcon size={16} isAnimating={status === 'sent'} className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </BorderGlow>
        </div>
      </div>
    </section>
  )
}

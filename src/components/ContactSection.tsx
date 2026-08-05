'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { AlertCircle, ArrowRight, BriefcaseBusiness, CalendarClock, Check, ChevronDown, Github, HelpCircle, Linkedin, Loader2, Mail, MessageSquare, Plus, UserRound } from 'lucide-react'
import { FiMail } from 'react-icons/fi'
import { cinematicHeader, cinematicHeaderCompact, cinematicPanel, cinematicPanelCompact, cinematicViewport, useCompactMotion } from '@/lib/site-motion'
import MaskedRise from '@/components/masked-rise'

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

/* Same shape check the API runs — kept deliberately loose so the client never
   rejects an address the server would have accepted. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldName = 'name' | 'email' | 'message'
type FieldErrors = Partial<Record<FieldName, string>>

/* Shared field chrome. The invalid state has to survive focus — a red border
   that disappears the moment you click into the field is exactly the subtlety
   we're replacing. */
/* The background lives in the variants, never in the base: two competing
   background utilities on one element resolve by stylesheet order, not by the
   order they're concatenated here. */
const fieldBase =
  'w-full rounded-[20px] border px-4 py-3 text-[color:var(--site-text)] outline-none transition-[color,background-color,border-color,box-shadow] duration-300 placeholder:text-[#8f8b82]'
const fieldValid =
  'border-[color:var(--site-border)] bg-white/[0.035] focus:border-accent/60 focus:bg-white/[0.065]'
const fieldInvalid =
  'border-[color:var(--form-error-border)] bg-[color:var(--form-error-bg)] shadow-[0_0_0_3px_var(--form-error-ring)] focus:border-[color:var(--form-error)]'

const fieldClass = (isInvalid: boolean) => `${fieldBase} ${isInvalid ? fieldInvalid : fieldValid}`

/* The label turns with the field: colour on the border alone is easy to miss
   on a dark panel, and it is the one cue colour-blind users can't rely on. */
const labelClass = (isInvalid: boolean) =>
  `flex items-center gap-2 text-base font-semibold transition-colors duration-300 ${
    isInvalid ? 'text-[color:var(--form-error)]' : 'text-[color:var(--site-text)]'
  }`

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          id={id}
          key={message}
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start gap-1.5 overflow-hidden text-[13px] font-medium text-[color:var(--form-error)]"
        >
          <AlertCircle className="mt-[9px] h-3.5 w-3.5 shrink-0" />
          <span className="pt-2">{message}</span>
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}

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
  // Honeypot — humans never see the input; the API fakes success when it's filled.
  const [company, setCompany] = useState('')
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const shakeControls = useAnimationControls()
  const prefersReducedMotion = useReducedMotion()

  const shake = useCallback(() => {
    if (prefersReducedMotion) {
      return
    }

    shakeControls.start({
      x: [0, -11, 9, -7, 5, -3, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    })
  }, [prefersReducedMotion, shakeControls])

  /* Errors clear as soon as the field they belong to changes, so the red never
     outlives the mistake. The banner goes with them — leaving "please fix the
     highlighted fields" up while nothing is highlighted reads as a stuck form. */
  const clearFieldError = useCallback((field: FieldName) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })

    setStatus((current) => (current === 'error' ? 'idle' : current))
  }, [])

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
      const timer = setTimeout(() => setStatus('idle'), 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    /* The form carries noValidate, so this runs instead of the browser's own
       bubble — which pointed at one field at a time and vanished on the next
       click. */
    const errors: FieldErrors = {}

    if (!name.trim()) {
      errors.name = 'Please add your name.'
    }

    const trimmedEmail = email.trim()

    /* Split into the two ways an address can fail, because one string covering
       both told people with a valid @ that they were missing one. Same rule the
       API enforces — loosening it here only moves the rejection server-side. */
    if (!trimmedEmail) {
      errors.email = 'Please add an email address so I can reply.'
    } else if (!/^[^\s@]+@[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'That should look like name@domain — one @, no spaces.'
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      errors.email = 'The domain needs a dot in it, like example.com.'
    }

    if (!message.trim()) {
      errors.message = 'Tell me a little about what you need.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setStatus('error')
      setErrorMessage(
        Object.keys(errors).length === 1
          ? 'One field still needs your attention.'
          : `${Object.keys(errors).length} fields still need your attention.`,
      )
      shake()

      const firstInvalid = errors.name ? nameRef.current : errors.email ? emailRef.current : messageRef.current
      firstInvalid?.focus({ preventScroll: true })
      firstInvalid?.scrollIntoView({ block: 'center', behavior: prefersReducedMotion ? 'auto' : 'smooth' })

      return
    }

    setFieldErrors({})
    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, projectType, budget, message, company }),
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
      // Cleared with the rest of the form: a password manager or an over-eager
      // autofill can put a value in the honeypot once, and leaving it there
      // silently turns every later send into the API's fake-success path.
      setCompany('')
    } catch (error) {
      console.error('[ContactSection] mail failed to send', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Could not send message.')
      shake()
    }
  }

  const isCompact = useCompactMotion()

  return (
    <section id="contact" className="site-section relative isolate min-h-screen">
      <div className="container relative mx-auto px-6">
        <motion.div
          className="section-header cinematic-section-header"
          variants={isCompact ? cinematicHeaderCompact : cinematicHeader}
          initial="hidden"
          whileInView="visible"
          viewport={cinematicViewport}
        >
          <h2 className="section-title">
            <MaskedRise delay={0.12}>Let&apos;s talk about your site</MaskedRise>
          </h2>
          <p className="section-description">
            <MaskedRise delay={0.2}>Tell me what you&apos;re building, where it stands, and what you want next.</MaskedRise>
          </p>
        </motion.div>

        <motion.div
          className="cinematic-reveal-card mx-auto max-w-7xl"
          variants={isCompact ? cinematicPanelCompact() : cinematicPanel('deep')}
          initial="hidden"
          whileInView="visible"
          viewport={cinematicViewport}
        >
            <div className="contact-panel relative z-10 grid overflow-hidden rounded-[28px] border border-[color:var(--rim-border)] lg:grid-cols-[1fr_1.2fr]">
              <aside className="flex flex-col border-b border-white/[0.12] bg-white/[0.015] p-6 md:p-8 lg:border-b-0 lg:border-r lg:border-white/[0.07] lg:bg-transparent">
                <div className="mb-6 flex items-center gap-2.5 border-b border-white/[0.07] pb-5">
                  <HelpCircle className="h-5 w-5 shrink-0 text-[color:var(--site-muted)]" />
                  <h3 className="text-xl font-bold tracking-[-0.025em] text-[color:var(--site-text)] md:text-2xl">Frequently asked questions</h3>
                </div>

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
                          className="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left transition-colors duration-300 hover:bg-white/[0.02]"
                        >
                          <span
                            className={`text-base font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                              isOpen ? 'text-[color:var(--site-text-strong)]' : 'text-[color:var(--site-text)] group-hover:text-[color:var(--site-text-strong)]'
                            }`}
                          >
                            {item.question}
                          </span>
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className={`flex shrink-0 items-center justify-center transition-colors duration-300 ${
                              isOpen ? 'text-accent' : 'text-[color:var(--site-muted)] group-hover:text-[color:var(--site-text)]'
                            }`}
                          >
                            <Plus className="h-5 w-5" />
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
                              <div className="px-5 pb-5">
                                <p className="text-[14px] leading-[1.7] text-[color:var(--site-muted)]">
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

              <motion.form onSubmit={handleSubmit} noValidate animate={shakeControls} className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-2.5 border-b border-white/[0.07] pb-5">
                  <MessageSquare className="h-5 w-5 shrink-0 text-[color:var(--site-muted)]" />
                  <h3 className="text-xl font-bold tracking-[-0.025em] text-[color:var(--site-text)] md:text-2xl">Send a message</h3>
                </div>

                {/* Honeypot: off-screen and inert for humans and assistive tech;
                    bots that fill every field trip the API's fake-success path. */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-4 pl-0.5">
                    <span className={labelClass(Boolean(fieldErrors.name))}><UserRound className="h-4 w-4 text-[color:var(--site-muted)]" />Name</span>
                    <div>
                      <input
                        ref={nameRef}
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value)
                          clearFieldError('name')
                        }}
                        required
                        autoComplete="name"
                        maxLength={100}
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                        className={fieldClass(Boolean(fieldErrors.name))}
                        placeholder="Your name"
                      />
                      <FieldError id="contact-name-error" message={fieldErrors.name} />
                    </div>
                  </label>

                  <label className="space-y-4 pl-0.5">
                    <span className={labelClass(Boolean(fieldErrors.email))}><Mail className="h-4 w-4 text-[color:var(--site-muted)]" />Email</span>
                    <div>
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value)
                          clearFieldError('email')
                        }}
                        required
                        autoComplete="email"
                        maxLength={254}
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                        className={fieldClass(Boolean(fieldErrors.email))}
                        placeholder="you@example.com"
                      />
                      <FieldError id="contact-email-error" message={fieldErrors.email} />
                    </div>
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
                      maxLength={100}
                        className="w-full rounded-[20px] border border-[color:var(--site-border)] bg-white/[0.035] px-4 py-3 text-[color:var(--site-text)] outline-none transition-colors duration-300 placeholder:text-[#8f8b82] focus:border-accent/60 focus:bg-white/[0.065] dark:rounded-[20px] dark:border-white/10 dark:bg-white/[0.035] dark:text-white dark:placeholder:text-white/50 dark:focus:bg-white/[0.065]"
                        placeholder="Optional, even a rough range helps"
                      />
                  </label>
                </div>

                <label className="mt-4 block space-y-4 pl-0.5">
                  <span className={labelClass(Boolean(fieldErrors.message))}><MessageSquare className="h-4 w-4 text-[color:var(--site-muted)]" />Message</span>
                  <div>
                    <textarea
                      ref={messageRef}
                      value={message}
                      onChange={(event) => {
                        setMessage(event.target.value)
                        clearFieldError('message')
                      }}
                      required
                      maxLength={5000}
                      rows={7}
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                      className={`${fieldClass(Boolean(fieldErrors.message))} resize-none`}
                      placeholder="Tell me a bit about what you need."
                    />
                    <FieldError id="contact-message-error" message={fieldErrors.message} />
                  </div>
                </label>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* assertive, not polite: an error announced after the user has
                      already moved on is an error they hear about too late. */}
                  <div
                    role="status"
                    aria-live={status === 'error' ? 'assertive' : 'polite'}
                    className="min-w-0 flex-1"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={status === 'sent' ? 'sent' : status === 'error' ? `error-${errorMessage}` : 'idle'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className={`flex items-center gap-2 text-sm ${
                          status === 'sent'
                            ? 'font-medium text-[color:var(--form-success)]'
                            : status === 'error'
                              ? 'font-medium text-[color:var(--form-error)]'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {status === 'sent' ? (
                          <>
                            <Check className="h-4 w-4 shrink-0" />
                            Message sent — I&apos;ll get back to you soon.
                          </>
                        ) : status === 'error' ? (
                          <>
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {errorMessage}
                          </>
                        ) : (
                          'Usually replies within one to two business days.'
                        )}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="relative shrink-0">
                    <button
                      type="submit"
                      disabled={status === 'sending' || status === 'sent'}
                      className={`group/contact-cta relative flex h-[48px] min-w-max cursor-pointer items-center overflow-hidden rounded-full border pl-7 pr-1.5 text-base font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] disabled:pointer-events-none ${
                        status === 'sent'
                          ? 'border-[color:var(--form-success-border)] bg-[color:var(--form-success-bg)] text-[color:var(--form-success)] disabled:opacity-100'
                          : status === 'error'
                            ? 'border-[color:var(--form-error-border)] bg-[color:var(--form-error-bg)] text-[#f5efe4] hover:border-[color:var(--form-error)]'
                            : 'border-[#dac5a7]/20 bg-[#141413]/40 text-[#f5efe4] hover:border-[#f5efe4]/70 disabled:opacity-70'
                      }`}
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
                          <span className="relative z-10 mr-5 whitespace-nowrap">Message sent</span>
                          <motion.span
                            initial={prefersReducedMotion ? false : { scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 520, damping: 18 }}
                            className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--form-success)] text-[#0b0b0a]"
                          >
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </motion.span>
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

              </motion.form>

              <div className="border-t border-[color:var(--site-border)] lg:col-span-2 dark:border-white/10">
                <p className="px-6 pb-4 pt-5 text-sm text-muted-foreground">You can also reach me here.</p>
                <div
                  ref={socialGridRef}
                  onPointerLeave={hideSocialFill}
                  className="relative grid overflow-hidden border-t border-[color:var(--site-border)] sm:grid-cols-3 dark:border-white/10"
                >
                  <div
                    className="pointer-events-none absolute left-0 top-0 z-0 bg-[#f5efe4] transition-[transform,width,height,border-radius,opacity] duration-300 ease-out"
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

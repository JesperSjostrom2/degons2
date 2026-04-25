'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { Loader2, ChevronDown } from 'lucide-react'
import { SendIcon } from '@/components/ui/animated-state-icons'

import BorderGlow from '@/components/BorderGlow'

const BORDER_GLOW_COLORS = ['#8b7355', '#dac5a7', '#f5efe4']
const BORDER_GLOW_HSL = '38 37 76'
const BORDER_GLOW_BACKGROUND = '#050505'

const projectTypes = ['Website', 'Frontend app', 'Portfolio', 'UI polish', 'Other']

export default function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [projectType, setProjectType] = useState(projectTypes[0])
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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
    <section id="contact" className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.28em] text-accent/70">Contact</p>
          <h2 className="mb-5 text-4xl font-bold text-white md:text-5xl">Let&apos;s Build Something</h2>
          <p className="text-lg text-muted-foreground">
            Tell me what you want to create, improve, or launch. I&apos;ll open your email client with everything ready to send.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
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
            <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-[28px] bg-card/20 p-6 backdrop-blur-sm md:p-8">
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
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-black/35 pl-4 pr-12 py-3 text-white outline-none transition-colors duration-300 focus:border-accent/45"
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
          </BorderGlow>
        </div>
      </div>
    </section>
  )
}

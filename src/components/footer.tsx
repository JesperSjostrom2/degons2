'use client'

import { useEffect, useState } from 'react'
import { Code2, Github, Linkedin, Mail } from 'lucide-react'

import { Footer as AnimatedFooter } from '@/components/ui/modem-animated-footer'

const socialLinks = [
  {
    icon: <Github className="h-5 w-5" />,
    hoverIcon: <Github className="h-5 w-5 fill-current" />,
    href: 'https://github.com/jespersjostrom2',
    label: 'GitHub',
  },
  {
    icon: <Linkedin className="h-5 w-5" />,
    hoverIcon: <Linkedin className="h-5 w-5 fill-current" />,
    href: 'https://www.linkedin.com/in/jesper-sj%C3%B6str%C3%B6m-521995232/',
    label: 'LinkedIn',
  },
  {
    icon: <Mail className="h-5 w-5" />,
    hoverIcon: <Mail className="h-5 w-5 fill-current" />,
    href: '#contact',
    label: 'Email',
  },
]

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeInFinland = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }))
      const hours = timeInFinland.getHours().toString().padStart(2, '0')
      const minutes = timeInFinland.getMinutes().toString().padStart(2, '0')
      const seconds = timeInFinland.getSeconds().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const statusSlot = (
    <div className="glass-nav relative px-4 py-2">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" />
          <span className="text-sm font-medium text-[color:var(--site-text)] dark:text-white/90">Available for work</span>
        </div>
        <div className="hidden h-4 w-px bg-[color:var(--site-border)] dark:bg-white/20 sm:block" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[color:var(--site-text)] dark:text-white/90">Local time</span>
          <span className="font-mono text-sm font-medium text-[color:var(--site-text)] dark:text-white/90">{currentTime}</span>
          <span className="text-xs text-[color:var(--site-muted)] dark:text-white/60">EEST</span>
        </div>
      </div>
    </div>
  )

  return (
    <AnimatedFooter
      brandName="Jesper Sjöström"
      socialLinks={socialLinks}
      navLinks={navLinks}
      brandIcon={<Code2 className="h-5 w-5 transition-transform duration-300 ease-out group-hover/footer-code:scale-110" />}
      statusSlot={statusSlot}
    />
  )
}

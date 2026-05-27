'use client'

import { useEffect, useState } from 'react'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

import { Footer as AnimatedFooter } from '@/components/ui/modem-animated-footer'

const socialLinks = [
  {
    icon: <FiGithub className="h-5 w-5" />,
    hoverIcon: <FaGithub className="h-5 w-5" />,
    href: 'https://github.com/jespersjostrom2',
    label: 'GitHub',
  },
  {
    icon: <FiLinkedin className="h-5 w-5" />,
    hoverIcon: <FaLinkedin className="h-5 w-5" />,
    href: 'https://www.linkedin.com/in/jesper-sj%C3%B6str%C3%B6m-521995232/',
    label: 'LinkedIn',
  },
  {
    icon: <FiMail className="h-5 w-5" />,
    hoverIcon: <FaEnvelope className="h-5 w-5" />,
    href: '#contact',
    label: 'Email',
  },
]

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Why Me', href: '#why-me' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
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
    <div className="mx-auto flex w-full max-w-[calc(100vw-1rem)] flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#f5efe4]/78 sm:text-[0.74rem]">
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />
        [ available for projects ]
      </span>
      <span className="whitespace-nowrap text-[#f5efe4]/55">|</span>
      <span className="whitespace-nowrap text-[#f5efe4]/80">
        [ local time <span className="font-semibold text-[#f5efe4]">{currentTime}</span> <span className="text-[#f5efe4]/74">EEST</span> ]
      </span>
    </div>
  )

  return (
    <AnimatedFooter
      brandName="Jesper Sjöström"
      socialLinks={socialLinks}
      navLinks={navLinks}
      statusSlot={statusSlot}
    />
  )
}

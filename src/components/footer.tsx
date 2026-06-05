'use client'

import { useEffect, useState } from 'react'

import { portfolioSocialLinks } from '@/components/social-links'
import { Footer as AnimatedFooter } from '@/components/ui/modem-animated-footer'
import { siteNavItems } from '@/lib/site-config'

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
    <div className="mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[#f5efe4]/78 sm:max-w-[calc(100vw-1rem)] sm:flex-row sm:gap-x-4 sm:gap-y-1 sm:text-[0.74rem] sm:tracking-[0.14em]">
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />
        [ available for projects ]
      </span>
      <span className="hidden whitespace-nowrap text-[#f5efe4]/55 sm:inline">|</span>
      <span className="whitespace-nowrap text-[#f5efe4]/80">
        [ local time <span className="font-semibold text-[#f5efe4]">{currentTime}</span> <span className="text-[#f5efe4]/74">EEST</span> ]
      </span>
    </div>
  )

  return (
    <AnimatedFooter
      brandName="Jesper Sjöström"
      socialLinks={portfolioSocialLinks}
      navLinks={siteNavItems}
      statusSlot={statusSlot}
    />
  )
}

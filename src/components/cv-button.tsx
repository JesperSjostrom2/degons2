'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export default function CVButton() {
  const [isHeroHeaderVisible, setIsHeroHeaderVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('home')
      if (hero) {
        const heroHeight = hero.offsetHeight
        setIsHeroHeaderVisible(window.scrollY < heroHeight * 0.75)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`fixed top-9 right-10 z-50 hidden lg:block transition-all duration-500 ease-out ${
        isHeroHeaderVisible 
          ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto' 
          : 'opacity-0 -translate-y-2 blur-sm pointer-events-none'
      }`}
    >
      <Link href="/cv">
        <div
          className="inline-flex h-[42px] items-center gap-2 rounded-full border border-[#dac5a7]/20 bg-[#141413]/40 backdrop-blur-md px-5 text-sm font-medium text-[#f5efe4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-[#141413]/60 hover:border-[#dac5a7]/40"
        >
          <FileText className="w-4 h-4" />
          Resume
        </div>
      </Link>
    </div>
  )
}

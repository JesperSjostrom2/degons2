'use client'

import { useState, useEffect } from 'react'

export default function Footer() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeInFinland = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Helsinki"}))
      const hours = timeInFinland.getHours().toString().padStart(2, '0')
      const minutes = timeInFinland.getMinutes().toString().padStart(2, '0')
      const seconds = timeInFinland.getSeconds().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="w-full border-t border-white/10 bg-background/80 py-8 relative z-20">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Available for work and Local time combined */}
        <div className="glass-nav relative px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-sm font-medium text-white/90">Available for work</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/90">Local time</span>
              <span className="text-sm font-mono font-medium text-white/90">{currentTime}</span>
              <span className="text-xs text-white/60">EEST</span>
            </div>
          </div>
        </div>

        <div className="text-sm font-medium text-white/50 tracking-wide">
          © {new Date().getFullYear()} Jesper Sjöström. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

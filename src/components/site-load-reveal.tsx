'use client'

import Image from 'next/image'

export default function SiteLoadReveal({ isExiting = false }: { isExiting?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`site-load-reveal pointer-events-none fixed inset-0 z-[9999] overflow-hidden bg-[#050505] ${isExiting ? 'site-load-reveal--exit' : ''}`}
    >
      <div className="site-load-reveal__glow absolute inset-[-18%]" />
      <div className="absolute left-1/2 top-1/2 flex w-[min(62vw,22rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
        <div className="site-load-reveal__logo relative h-16 w-44 sm:h-20 sm:w-56">
          <Image
            src="/assets/logotransparent.png"
            alt=""
            fill
            priority
            sizes="224px"
            className="object-contain drop-shadow-[0_0_24px_rgba(218,197,167,0.16)]"
          />
        </div>

        <div className="site-load-reveal__rail relative h-3 w-full overflow-hidden">
          <div className="site-load-reveal__track absolute inset-x-2 top-1/2 h-px -translate-y-1/2 overflow-hidden">
            <div className="absolute inset-0 bg-[#dac5a7]/10" />
            <div className="site-load-reveal__line absolute inset-0 origin-left bg-gradient-to-r from-[#8b7355]/10 via-[#f5efe4] to-[#dac5a7] shadow-[0_0_18px_rgba(218,197,167,0.34)]" />
            <div className="site-load-reveal__scanner absolute top-1/2 h-1.5 w-5 -translate-y-1/2 rounded-full bg-[#f5efe4]/55 blur-[3px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

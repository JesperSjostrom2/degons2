'use client'

import { useEffect, useState } from 'react'

import { Footer as AnimatedFooter } from '@/components/ui/modem-animated-footer'
import { siteNavItems } from '@/lib/site-config'

/**
 * Wall-clock time in Helsinki, read straight out of Intl.
 *
 * The old version formatted the date into an en-US string and fed that back to
 * `new Date()` to read the hours off it. That roundtrip only parses because V8
 * accepts `8/5/2026, 12:38:40 AM`; the format is not in the spec, and a stricter
 * engine hands back an Invalid Date, which prints as `NaN:NaN:NaN` in the footer
 * of the live site. Formatting once and using the output is both shorter and the
 * thing the API is for.
 *
 * en-GB rather than en-US because it is h23 — `00:38:39`, not `12:38:39 AM`.
 */
const helsinkiClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Helsinki',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

/**
 * EEST or EET, depending on the date.
 *
 * This was the string `EEST`, hardcoded. Finland is UTC+3 only through summer
 * time and drops to UTC+2 (EET) at the end of October, so a constant here is a
 * label that is right when it ships and wrong for five months of the year.
 *
 * No locale prints those two abbreviations, so they come off the offset the
 * runtime already knows — `shortOffset` gives `GMT+3` or `GMT+2`, and Finland
 * has no third case.
 */
const helsinkiZone = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Helsinki',
  timeZoneName: 'shortOffset',
})

const zoneAbbreviation = (date: Date) =>
  helsinkiZone
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')
    ?.value.endsWith('+3')
    ? 'EEST'
    : 'EET'

export default function Footer() {
  const [currentTime, setCurrentTime] = useState('')
  const [zoneLabel, setZoneLabel] = useState('')

  useEffect(() => {
    let interval = 0

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(helsinkiClock.format(now))
      setZoneLabel(zoneAbbreviation(now))
    }

    /* A seconds hand nobody is looking at is still a repaint a second. The tab
       being backgrounded is the one case where that is certain, so the timer
       stops there and the clock catches up on return rather than ticking
       through it. */
    const start = () => {
      if (interval || document.hidden) return
      updateTime()
      interval = window.setInterval(updateTime, 1000)
    }

    const stop = () => {
      window.clearInterval(interval)
      interval = 0
    }

    const handleVisibilityChange = () => (document.hidden ? stop() : start())

    updateTime()
    start()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const statusSlot = (
    <div className="mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[#f5efe4]/78 sm:max-w-[calc(100vw-1rem)] sm:flex-row sm:gap-x-4 sm:gap-y-1 sm:text-[0.74rem] sm:tracking-[0.14em]">
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />
        [ available for projects ]
      </span>
      <span className="hidden whitespace-nowrap text-[#f5efe4]/55 sm:inline">|</span>
      <span className="whitespace-nowrap text-[#f5efe4]/80">
        [ local time <span className="font-semibold text-[#f5efe4]">{currentTime}</span> <span className="text-[#f5efe4]/74">{zoneLabel}</span> ]
      </span>
    </div>
  )

  return (
    <AnimatedFooter
      brandName="Jesper Sjöström"
      navLinks={siteNavItems}
      statusSlot={statusSlot}
    />
  )
}

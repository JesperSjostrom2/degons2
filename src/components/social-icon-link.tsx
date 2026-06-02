'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

type SocialIconLinkProps = {
  href: string
  label: string
  icon: ReactNode
  hoverIcon?: ReactNode
}

const socialLinkClass = 'premium-glass-surface group inline-flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--site-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/70 hover:text-accent dark:hover:border-accent/70 dark:hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 dark:text-white/72'
const iconClass = 'block h-5 w-5 transition-all duration-200 group-hover:scale-75 group-hover:opacity-0'
const hoverIconClass = 'absolute block h-5 w-5 scale-75 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100'

export function SocialIconLink({ href, label, icon, hoverIcon }: SocialIconLinkProps) {
  const content = (
    <>
      <span className={iconClass}>{icon}</span>
      {hoverIcon ? <span className={hoverIconClass}>{hoverIcon}</span> : null}
      <span className="sr-only">{label}</span>
    </>
  )

  if (href.startsWith('#')) {
    return (
      <button type="button" data-scroll-to={href} className={socialLinkClass}>
        {content}
      </button>
    )
  }

  return (
    <Link
      href={href}
      className={socialLinkClass}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {content}
    </Link>
  )
}

'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

type SocialIconLinkProps = {
  href: string
  label: string
  icon: ReactNode
  hoverIcon?: ReactNode
}

export function SocialIconLink({ href, label, icon, hoverIcon }: SocialIconLinkProps) {
  const content = (
    <>
      <span className="social-icon-link-fill" aria-hidden="true" />
      <span className="social-icon-link-glyph">{icon}</span>
      {hoverIcon ? <span className="social-icon-link-glyph social-icon-link-glyph-hover">{hoverIcon}</span> : null}
      <span className="sr-only">{label}</span>
    </>
  )

  if (href.startsWith('#')) {
    return (
      <button type="button" data-scroll-to={href} className="social-icon-link">
        {content}
      </button>
    )
  }

  return (
    <Link
      href={href}
      className="social-icon-link"
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {content}
    </Link>
  )
}

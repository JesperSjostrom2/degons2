"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface FooterLink {
  label: string
  href: string
}

interface SocialLink {
  icon: ReactNode
  hoverIcon?: ReactNode
  href: string
  label: string
}

interface FooterProps {
  brandName?: string
  brandDescription?: string
  socialLinks?: SocialLink[]
  navLinks?: FooterLink[]
  creatorName?: string
  creatorUrl?: string
  statusSlot?: ReactNode
  className?: string
}

export const Footer = ({
  brandName = "YourBrand",
  brandDescription = "Your description here",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  statusSlot,
  className,
}: FooterProps) => {
  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      <footer className="relative overflow-hidden bg-[color:var(--site-bg)]">
        <div className="footer-top-glow pointer-events-none absolute left-1/2 top-0 z-20 h-px w-[94%] max-w-7xl -translate-x-1/2" />
        <div className="relative mx-auto flex max-w-7xl flex-col px-6 py-10 md:py-12">
          <div className="flex flex-col items-center text-center">
            {statusSlot && <div className="mb-8">{statusSlot}</div>}

            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--site-border)] bg-[rgba(5,5,5,0.045)] text-[color:var(--site-muted)] backdrop-blur-[4px] [backdrop-filter:blur(4px)_saturate(130%)] [-webkit-backdrop-filter:blur(4px)_saturate(130%)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/70 hover:text-accent dark:hover:border-accent/70 dark:hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 dark:border-white/15 dark:bg-[rgba(5,5,5,0.045)] dark:text-white/72"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <span className="block h-5 w-5 transition-all duration-200 group-hover:scale-75 group-hover:opacity-0">{link.icon}</span>
                    {link.hoverIcon && (
                      <span className="absolute block h-5 w-5 scale-75 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                        {link.hoverIcon}
                      </span>
                    )}
                    <span className="sr-only">{link.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {navLinks.length > 0 && (
              <nav className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-muted-foreground">
                {navLinks.map((link) => (
                  <Link key={link.label} className="transition-colors duration-300 hover:text-accent" href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="relative z-10 mt-10 flex flex-col items-center gap-3 md:mt-12">
            <p className="text-center text-sm font-medium text-muted-foreground">
              Design & built by {brandName}
            </p>
            {creatorName && creatorUrl && (
              <Link href={creatorUrl} className="text-xs text-[color:var(--site-muted)] transition-colors duration-300 hover:text-accent">
                Built by {creatorName}
              </Link>
            )}
          </div>
        </div>

      </footer>
    </section>
  )
}

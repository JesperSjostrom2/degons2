"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import Image from "next/image"

import { SocialIconLink } from "@/components/social-icon-link"
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
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  statusSlot,
  className,
}: FooterProps) => {
  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      {/* Same flat black as every other panel. Safe against the sky because
          --sky is a constant #030303, so this always reads as a surface rather
          than a seam — and it occludes the star field, which transparency did
          not. */}
      <footer className="relative overflow-hidden bg-[color:var(--panel-bg)]">
        <div className="footer-top-glow pointer-events-none absolute left-1/2 top-0 z-20 h-px w-[94%] max-w-7xl -translate-x-1/2" />
        <div className="relative mx-auto flex max-w-7xl flex-col px-6 pb-10 pt-14 md:pb-14 md:pt-20">
          <div className="flex flex-col items-center text-center">
            {statusSlot && <div className="mb-7 md:mb-8">{statusSlot}</div>}

            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((link) => (
                  <SocialIconLink key={link.label} {...link} />
                ))}
              </div>
            )}

            {navLinks.length > 0 && (
              <nav className="mt-7 flex w-full max-w-[21rem] flex-nowrap items-center justify-between text-[0.72rem] font-semibold text-muted-foreground min-[390px]:max-w-[23rem] min-[390px]:text-[0.8rem] sm:w-auto sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-3 sm:text-sm">
                {navLinks.map((link) => (
                  link.href.startsWith("#") ? (
                    <button
                      key={link.label}
                      type="button"
                      data-scroll-to={link.href}
                      className="transition-colors duration-300 hover:text-accent"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link key={link.label} className="transition-colors duration-300 hover:text-accent" href={link.href}>
                      {link.label}
                    </Link>
                  )
                ))}
              </nav>
            )}
          </div>

          <div className="relative z-10 mt-10 flex flex-col items-center gap-3 md:mt-12">
            <p className="inline-flex items-center text-center text-sm font-medium text-muted-foreground">
              © {new Date().getFullYear()} · Design & built by {brandName}
              <Image
                src="/assets/minilogo.png"
                alt=""
                width={12}
                height={12}
                className="ml-1 h-3 w-3 shrink-0 self-center opacity-60"
              />
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

"use client"

import Link from "next/link"
import { NotepadTextDashed } from "lucide-react"
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
  brandIcon?: ReactNode
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
  brandIcon,
  statusSlot,
  className,
}: FooterProps) => {
  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      <footer className="warm-section-bg relative overflow-hidden border-t border-white/10">
        <div className="relative mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-between px-6 py-10 md:min-h-[25rem]">
          <div className="flex flex-col items-center text-center">
            {statusSlot && <div className="mb-8">{statusSlot}</div>}

            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45"
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

          <div className="relative z-10 mt-20 flex flex-col items-center justify-center gap-3 md:mt-24">
            <p className="text-center text-sm font-medium text-muted-foreground md:text-left">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
          </div>
        </div>

        <div className="absolute bottom-20 left-1/2 z-10 flex w-full max-w-7xl -translate-x-1/2 items-center gap-4 px-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-white/10" />
          <div className="group/footer-code flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent transition-all duration-300 hover:border-accent/55 hover:bg-accent/15">
            {brandIcon || <NotepadTextDashed className="h-5 w-5 transition-transform duration-300 ease-out group-hover/footer-code:scale-110" />}
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/10" />
        </div>

      </footer>
    </section>
  )
}

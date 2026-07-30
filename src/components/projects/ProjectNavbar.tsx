'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { requestSectionOnHome } from '@/lib/section-handoff'

/**
 * The project page's navbar — the homepage's furniture (same `.glass-nav` pill, logo
 * top-left, availability tag top-right) so the page reads as part of the site.
 *
 * Both links go home and then scroll, via the sessionStorage handoff in `lib/section-handoff`.
 * They cannot use the site's usual `data-scroll-to` because that is handled by
 * `smooth-scroll.tsx` on the *current* page and these targets live on another one, and they
 * cannot use `/#section` because the home page's content is still behind the loader on
 * arrival. See that file for the full reasoning.
 */
const links = [
  { section: 'projects', label: 'All projects', back: true },
  { section: 'contact', label: 'Start a project' },
]

const ProjectNavbar = () => (
  <>
    <Link
      href="/"
      className="fixed left-10 top-6 z-50 hidden lg:block"
      aria-label="Jesper Sjöström — home"
    >
      <Image
        src="/assets/logotransparent.png"
        alt=""
        width={240}
        height={80}
        className="h-11 w-auto object-contain"
        style={{ filter: 'drop-shadow(0 0 12px rgba(218, 197, 167, 0.08)) blur(0.2px)' }}
        priority
      />
    </Link>

    <div
      className="fixed right-10 top-6 z-50 hidden lg:block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#f5efe4]/62"
      aria-label="Availability status"
    >
      [ available for projects ]
    </div>

    <motion.nav
      className="project-nav fixed left-1/2 top-4 z-50 max-w-[95vw] -translate-x-1/2 lg:top-6"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="glass-nav relative flex items-center justify-center"
        style={{ padding: '0.35rem 1.15rem', gap: '0.35rem' }}
      >
        {links.map((link) => (
          <Link
            key={link.section}
            href="/"
            onClick={() => requestSectionOnHome(link.section)}
            className={`project-nav__link${link.back ? ' project-nav__link--back group/back' : ''}`}
          >
            {link.back ? (
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/back:-translate-x-0.5" />
            ) : null}
            {link.label}
          </Link>
        ))}
      </div>
    </motion.nav>
  </>
)

export default ProjectNavbar

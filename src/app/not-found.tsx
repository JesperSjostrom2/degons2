import type { Metadata } from 'next'
import Image from 'next/image'

import CustomCursor from '@/components/custom-cursor'
import NotFoundView from '@/components/not-found-view'
import SiteAtmosphere from '@/components/site-atmosphere'
import TransitionLink from '@/components/transition/transition-link'
import { notFoundMetadata } from '@/lib/not-found-metadata'

/**
 * The site's only 404.
 *
 * It was two: this one for anything unmatched, and a second under `work/[slug]` for a project
 * slug that does not exist. They said different things, and the project one had drifted far
 * enough that its back link carried a class (`.project-page__back`) with no rule behind it any
 * more — an unstyled blue-grey anchor under a heading. A wrong URL is one situation, so it now
 * has one page: deleting `work/[slug]/not-found.tsx` sends `notFound()` from the project route
 * up to this boundary, which is also the one Next serves for every address that matches no
 * route at all.
 *
 * The backdrop is the home page's, shared verbatim through `SiteAtmosphere` — same flat sky,
 * same meteors, same three parallax star bands. Furniture is the project pages': wordmark top
 * left, availability tag top right. Nothing here is drawn twice.
 */

export const metadata: Metadata = notFoundMetadata

export default function NotFound() {
  return (
    <main id="main" className="isolate relative min-h-screen bg-[color:var(--sky)]">
      <CustomCursor />
      <SiteAtmosphere />

      <TransitionLink
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
          style={{ filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.08)) blur(0.2px)' }}
          priority
        />
      </TransitionLink>

      <div
        className="fixed right-10 top-6 z-50 hidden lg:block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#f5efe4]/62"
        aria-label="Availability status"
      >
        [ available for projects ]
      </div>

      <div className="relative z-10">
        <NotFoundView />
      </div>
    </main>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { requestSectionOnHome } from '@/lib/section-handoff'
import { projects } from '@/data/projects'

/**
 * The project page's navbar — the homepage's furniture (same `.glass-nav` pill, logo
 * top-left, availability tag top-right) so the page reads as part of the site.
 *
 * Navigation only: home, then every project, all in one flat row. No call to action — the
 * homepage's CTA was the odd one out here, asking for a commitment on a page whose job is
 * to show the work. Contact is still one click away in the footer, which now routes across
 * pages. Home reads as a plain word alongside the project names, with no arrow or rule
 * setting it apart: it is another place to go, not a different kind of thing.
 *
 * Every project is listed rather than only the next one, so moving between them is a
 * single click from anywhere on the page instead of a scroll to the foot. The chain at
 * the bottom stays — it is a recommendation to keep going, which is a different job from
 * navigation.
 *
 * `Home` uses the sessionStorage handoff in `lib/section-handoff` rather than the site's
 * usual `data-scroll-to`, because the home page's content is still behind the loader on
 * arrival and the target does not exist yet. See that file for the full reasoning.
 */
const ProjectNavbar = () => {
  const pathname = usePathname()
  const activeSlug = pathname?.split('/work/')[1]?.split('/')[0] ?? ''

  return (
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
          style={{ filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.08)) blur(0.2px)' }}
          priority
        />
      </Link>

      <div
        className="fixed right-10 top-6 z-50 hidden lg:block text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#f5efe4]/62"
        aria-label="Availability status"
      >
        [ available for projects ]
      </div>

      {/* Deliberately unanimated. The navbar is the one thing that persists between
          project pages, so a drop-in on every route change would make the furniture
          look like it had been rebuilt each time. It stays put; the page moves. */}
      <nav
        className="project-nav fixed left-1/2 top-4 z-50 max-w-[95vw] -translate-x-1/2 lg:top-6"
        aria-label="Project navigation"
      >
        {/* The pill and the scrolling row are two elements, not one. The row has to
            clip its overflow to scroll, and the active marker's glow sits just under
            the pill's bottom rim — on one element the clip would cut the glow off.
            The pill is centred by the nav's own translate, so it still sits
            mid-screen at every width. */}
        <div
          className="glass-nav project-nav__pill relative flex items-center"
          style={{ padding: '0.35rem 1.15rem' }}
        >
          <div className="project-nav__rail">
            <Link
              href="/"
              onClick={() => requestSectionOnHome('home')}
              className="project-nav__link project-nav__link--back"
            >
              Home
            </Link>

            {projects.map((project) =>
              project.slug === activeSlug ? (
                // The page you are already on names itself instead of offering a click
                // that goes nowhere.
                <span
                  key={project.slug}
                  className="project-nav__link project-nav__link--active"
                  aria-current="page"
                >
                  {project.displayName}
                </span>
              ) : (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="project-nav__link"
                >
                  {project.displayName}
                </Link>
              ),
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default ProjectNavbar

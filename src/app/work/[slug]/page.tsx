import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'

import { getNextProject, getProjectBySlug, projectSlugs } from '@/data/projects'
import ProjectShot from '@/components/projects/ProjectShot'
import ProjectMacFrame from '@/components/projects/ProjectMacFrame'
import ProjectPhoneRow from '@/components/projects/ProjectPhoneRow'
import ProjectFacts from '@/components/projects/ProjectFacts'
import ProjectTypography from '@/components/projects/ProjectTypography'
import ProjectPaletteBoard from '@/components/projects/ProjectPaletteBoard'
import ProjectTech from '@/components/projects/ProjectTech'
import NextProjectLink from '@/components/projects/NextProjectLink'
import ProjectNavbar from '@/components/projects/ProjectNavbar'
import SiteLinkPill from '@/components/site-link-pill'
import { serializeJsonLd } from '@/lib/json-ld'
import { notFoundMetadata } from '@/lib/not-found-metadata'
import { SITE_URL } from '@/lib/site-config'
import ScrollToTop from '@/components/scroll-to-top'
import CustomCursor from '@/components/custom-cursor'
import SmoothScroll from '@/components/smooth-scroll'
import SiteAtmosphere from '@/components/site-atmosphere'
import Footer from '@/components/footer'

export const generateStaticParams = () => projectSlugs.map((slug) => ({ slug }))

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> => {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  /* An unknown slug renders the site's one 404 (`app/not-found.tsx`) — but this route's
     `generateMetadata` still owns the `<head>`, so the title has to come from the same place
     that page's does or the tab disagrees with the screen. */
  if (!project) {
    return notFoundMetadata
  }

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `${SITE_URL}/work/${project.slug}` },
    openGraph: {
      type: 'article',
      title: `${project.name} | Jesper Sjöström`,
      description: project.description,
      url: `${SITE_URL}/work/${project.slug}`,
      images: [{ url: project.cover.src, alt: project.cover.alt }],
    },
    /* Without this, X falls back to the root layout's twitter block and a
       shared project link shows the generic site card. */
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} | Jesper Sjöström`,
      description: project.description,
      images: [project.cover.src],
    },
  }
}

/**
 * A project page.
 *
 * The backdrop is the home page's, shared verbatim via `SiteAtmosphere` — same sky, same
 * abyss, same meteors, same three parallax star bands driven by the same controller.
 *
 * The navbar is deliberately absent. `navbar.tsx` resolves its links with
 * `document.querySelector('#home')` and friends, all of which are null off the home page —
 * so this gets one honest back link instead.
 */
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const next = getNextProject(project.slug)

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: `${SITE_URL}/work/${project.slug}`,
    image: `${SITE_URL}${project.cover.src}`,
    dateModified: project.lastUpdated,
    author: {
      '@type': 'Person',
      name: 'Jesper Sjöström',
      url: SITE_URL,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: project.name,
        item: `${SITE_URL}/work/${project.slug}`,
      },
    ],
  }

  return (
    <main
      className="project-page isolate relative min-h-screen"
      style={{ '--project-accent': project.accent } as CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(projectJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <ScrollToTop />
      <SmoothScroll />
      <CustomCursor />
      <SiteAtmosphere />

      <ProjectNavbar />

      <div className="relative z-10">
        <div className="container mx-auto px-6">
          <div className="project-page__inner">
            {/* ── Head. Title and the way in on the left, the facts on the right, and
                nothing else — the description lives on the index card, so the page does
                not repeat it, and the role reads better below the work than above it. ── */}
            <section className="project-page__head">
              <div className="project-page__head-main">
                {project.logo ? (
                  <Image
                    src={project.logo.src}
                    alt={project.logo.alt}
                    width={project.logo.width * 2}
                    height={project.logo.height * 2}
                    className="project-page__logo"
                    style={
                      project.logo.scale
                        ? ({ '--project-logo-scale': project.logo.scale } as CSSProperties)
                        : undefined
                    }
                    priority
                  />
                ) : (
                  <span className="project-page__wordmark">{project.displayName}</span>
                )}

                <h1 className="project-page__title">{project.name}</h1>

                <SiteLinkPill href={project.liveUrl} label={`Visit ${project.liveLabel}`} external />
              </div>
            </section>
          </div>
        </div>

        {/* ── The work. Its own wider column, so the devices are bigger than the
            prose they sit between. Nothing is ever printed under a visual. ── */}
        <div className="container mx-auto px-6">
          <section className="project-page__visuals" aria-label={`${project.name} screenshots`}>
            {project.visuals.map((visual, index) => {
              if (visual.frame === 'mac') {
                return (
                  <ProjectMacFrame
                    key={visual.videoSrc}
                    videoSrc={visual.videoSrc}
                    posterSrc={visual.posterSrc}
                    alt={visual.alt}
                  />
                )
              }

              if (visual.frame === 'phones') {
                return <ProjectPhoneRow key={visual.phones[0]?.src ?? index} phones={visual.phones} />
              }

              return (
                <ProjectShot
                  key={visual.src}
                  shot={visual}
                  liveLabel={project.liveLabel}
                  sizes="(max-width: 899px) 92vw, 84rem"
                  priority={index === 0}
                />
              )
            })}
          </section>
        </div>

        <div className="container mx-auto px-6">
          <div className="project-page__inner project-page__inner--tail">
            {/* Role and the facts read as one statement about the job, so they share a
                band — the prose on the left, the hard numbers beside it. */}
            <section className="project-page__brief">
              <div className="project-page__block">
                <h2 className="project-page__label">Role</h2>
                <p className="project-page__prose">{project.roleSummary}</p>
              </div>

              {/* No heading — the rows label themselves. */}
              <div className="project-page__brief-facts">
                <ProjectFacts facts={project.facts} />
              </div>
            </section>

            <section className="project-page__block">
              <h2 className="project-page__label">Typography</h2>
              <ProjectTypography typography={project.typography} />
            </section>

            <section className="project-page__block">
              <h2 className="project-page__label">Colour</h2>
              <ProjectPaletteBoard palette={project.palette} />
            </section>

            <section className="project-page__block">
              <h2 className="project-page__label">Built with</h2>
              <ProjectTech tech={project.tech} />
            </section>

            {next ? <NextProjectLink project={next} /> : null}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}

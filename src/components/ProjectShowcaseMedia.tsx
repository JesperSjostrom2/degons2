import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Eye } from 'lucide-react'

interface ProjectShowcaseMediaProps {
  href: string
  primaryImage: string
  secondaryImage: string
  primaryAlt: string
  secondaryAlt: string
  projectLabel?: string
  priority?: boolean
}

export default function ProjectShowcaseMedia({
  href,
  primaryImage,
  secondaryImage,
  primaryAlt,
  secondaryAlt,
  projectLabel = 'project',
  priority = false,
}: ProjectShowcaseMediaProps) {
  const previewBadgeRef = useRef<HTMLSpanElement>(null)
  const previewPointerTargetRef = useRef({ x: 0, y: 0 })
  const previewPointerCurrentRef = useRef({ x: 0, y: 0 })
  const previewAnimationFrameRef = useRef<number | null>(null)
  const [isProjectPreviewActive, setIsProjectPreviewActive] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  const shouldReduceMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const syncProjectPreviewBadgePosition = (x: number, y: number) => {
    const badge = previewBadgeRef.current

    if (!badge) return

    badge.style.setProperty('--project-preview-x', `${x}px`)
    badge.style.setProperty('--project-preview-y', `${y}px`)
  }

  const handlePointerEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = event
    previewPointerTargetRef.current = { x: clientX, y: clientY }
    previewPointerCurrentRef.current = { x: clientX, y: clientY }
    syncProjectPreviewBadgePosition(clientX, clientY)
    setIsProjectPreviewActive(true)
  }

  const handlePointerMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = event
    previewPointerTargetRef.current = { x: clientX, y: clientY }

    if (shouldReduceMotion) {
      previewPointerCurrentRef.current = { x: clientX, y: clientY }
      syncProjectPreviewBadgePosition(clientX, clientY)
    }
  }

  useEffect(() => {
    if (!isProjectPreviewActive || shouldReduceMotion) return

    const animatePreviewBadge = () => {
      const current = previewPointerCurrentRef.current
      const target = previewPointerTargetRef.current
      current.x += (target.x - current.x) * 0.12
      current.y += (target.y - current.y) * 0.12
      syncProjectPreviewBadgePosition(current.x, current.y)
      previewAnimationFrameRef.current = requestAnimationFrame(animatePreviewBadge)
    }

    previewAnimationFrameRef.current = requestAnimationFrame(animatePreviewBadge)

    return () => {
      if (previewAnimationFrameRef.current !== null) {
        cancelAnimationFrame(previewAnimationFrameRef.current)
        previewAnimationFrameRef.current = null
      }
    }
  }, [isProjectPreviewActive, shouldReduceMotion])

  const projectPreviewBadge = (
    <span
      ref={previewBadgeRef}
      className={`project-preview-badge ${isProjectPreviewActive ? 'project-preview-badge--active' : ''}`}
      aria-hidden="true"
    >
      <span className="project-preview-badge__glow" />
      <svg className="project-preview-badge__orbit" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="project-preview-badge__orbit-line" cx="50" cy="50" r="48.25" pathLength="100" />
      </svg>
      <svg className="project-preview-badge__ring" viewBox="0 0 100 100">
        <defs>
          <path id="project-open-path-andcreative" d="M50 50 m -34 0 a 34 34 0 1 1 68 0 a 34 34 0 1 1 -68 0" />
        </defs>
        <text className="project-preview-badge__label"><textPath href="#project-open-path-andcreative" startOffset="12.5%" textAnchor="middle">OPEN</textPath></text>
        <text className="project-preview-badge__label"><textPath href="#project-open-path-andcreative" startOffset="45.75%" textAnchor="middle">EXPLORE</textPath></text>
        <text className="project-preview-badge__label"><textPath href="#project-open-path-andcreative" startOffset="81%" textAnchor="middle">DISCOVER</textPath></text>
        <text className="project-preview-badge__separator"><textPath href="#project-open-path-andcreative" startOffset="27.75%" textAnchor="middle">•</textPath></text>
        <text className="project-preview-badge__separator"><textPath href="#project-open-path-andcreative" startOffset="63.75%" textAnchor="middle">•</textPath></text>
        <text className="project-preview-badge__separator"><textPath href="#project-open-path-andcreative" startOffset="98.5%" textAnchor="middle">•</textPath></text>
      </svg>
      <span className="project-preview-badge__center"><Eye className="h-6 w-6" strokeWidth={1.75} /></span>
    </span>
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${projectLabel} live site`}
      className="project-showcase-media group/project-showcase"
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setIsProjectPreviewActive(false)}
    >
      {hasMounted ? createPortal(projectPreviewBadge, document.body) : null}
      <span className="project-showcase-media__brand-word" aria-hidden="true">
        ANDCREATIVE
      </span>

      <div className="project-showcase-media__stage">
        <div className="project-showcase-frame project-showcase-frame--primary">
          <div className="project-showcase-frame__inner">
            <Image
              src={primaryImage}
              alt={primaryAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="project-showcase-frame__image"
              priority={priority}
            />
          </div>
        </div>

        <div className="project-showcase-frame project-showcase-frame--secondary">
          <div className="project-showcase-frame__inner">
            <Image
              src={secondaryImage}
              alt={secondaryAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="project-showcase-frame__image"
            />
          </div>
        </div>
      </div>
    </a>
  )
}

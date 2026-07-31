'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Eye } from 'lucide-react'

/**
 * The cursor badge over a project shot: OPEN • EXPLORE • DISCOVER orbiting an eye,
 * trailing the pointer with a little inertia.
 *
 * One instance for the whole index, not one per card. The original version portalled a
 * badge out of every card, which meant a rAF loop, a listener set and a duplicate SVG
 * path id per project; cards now just mark their shot with `data-project-cursor` and
 * this picks them all up. Nothing needs to change here when a project is added.
 *
 * PERFORMANCE — the lerp writes two custom properties on this element only, never on
 * :root (see AtmosphereController for why), and only while the pointer is actually over
 * a shot. The ring's spin is paused in CSS until the badge is active.
 */

// How much of the remaining distance the badge closes per frame. Lower is heavier.
const POINTER_LERP = 0.12

export default function ProjectCursorBadge() {
  const badgeRef = useRef<HTMLSpanElement>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef(0)
  const [hasMounted, setHasMounted] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => setHasMounted(true), [])

  const place = (x: number, y: number) => {
    const badge = badgeRef.current

    if (!badge) {
      return
    }

    badge.style.setProperty('--project-preview-x', `${x}px`)
    badge.style.setProperty('--project-preview-y', `${y}px`)
  }

  useEffect(() => {
    if (!hasMounted) {
      return
    }

    // A badge that trails a pointer is meaningless on touch, where the tap lands and the
    // finger leaves. Same gate the custom cursor uses.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return
    }

    const zones = Array.from(document.querySelectorAll<HTMLElement>('[data-project-cursor]'))

    if (!zones.length) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleEnter = (event: PointerEvent) => {
      const zone = event.currentTarget as HTMLElement
      // Portalled to <body>, so the card's accent cannot be inherited — read it off the
      // card the pointer actually entered.
      const accent = getComputedStyle(zone).getPropertyValue('--project-accent').trim()

      if (accent) {
        badgeRef.current?.style.setProperty('--project-accent', accent)
      }

      targetRef.current = { x: event.clientX, y: event.clientY }
      currentRef.current = { x: event.clientX, y: event.clientY }
      place(event.clientX, event.clientY)
      setIsActive(true)
    }

    const handleMove = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY }

      // Under reduced motion there is no rAF loop, so the badge is placed straight onto
      // the pointer rather than easing toward it.
      if (reducedMotion.matches) {
        currentRef.current = { x: event.clientX, y: event.clientY }
        place(event.clientX, event.clientY)
      }
    }

    const handleLeave = () => setIsActive(false)

    for (const zone of zones) {
      zone.addEventListener('pointerenter', handleEnter)
      zone.addEventListener('pointermove', handleMove)
      zone.addEventListener('pointerleave', handleLeave)
    }

    return () => {
      for (const zone of zones) {
        zone.removeEventListener('pointerenter', handleEnter)
        zone.removeEventListener('pointermove', handleMove)
        zone.removeEventListener('pointerleave', handleLeave)
      }
    }
  }, [hasMounted])

  useEffect(() => {
    if (!isActive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const step = () => {
      const current = currentRef.current
      const target = targetRef.current

      current.x += (target.x - current.x) * POINTER_LERP
      current.y += (target.y - current.y) * POINTER_LERP

      // Snap the last fraction of a pixel, or the loop never settles.
      if (Math.abs(target.x - current.x) < 0.1) {
        current.x = target.x
      }

      if (Math.abs(target.y - current.y) < 0.1) {
        current.y = target.y
      }

      place(current.x, current.y)
      frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)

    return () => cancelAnimationFrame(frameRef.current)
  }, [isActive])

  if (!hasMounted) {
    return null
  }

  return createPortal(
    <span
      ref={badgeRef}
      className={`project-preview-badge${isActive ? ' project-preview-badge--active' : ''}`}
      aria-hidden="true"
    >
      <span className="project-preview-badge__glow" />

      <svg className="project-preview-badge__orbit" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="project-preview-badge__orbit-line" cx="50" cy="50" r="48.25" pathLength="100" />
      </svg>

      <svg className="project-preview-badge__ring" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="project-cursor-badge-path" d="M50 50 m -34 0 a 34 34 0 1 1 68 0 a 34 34 0 1 1 -68 0" />
        </defs>
        <text className="project-preview-badge__label">
          <textPath href="#project-cursor-badge-path" startOffset="12.5%" textAnchor="middle">
            OPEN
          </textPath>
        </text>
        <text className="project-preview-badge__label">
          <textPath href="#project-cursor-badge-path" startOffset="45.75%" textAnchor="middle">
            EXPLORE
          </textPath>
        </text>
        <text className="project-preview-badge__label">
          <textPath href="#project-cursor-badge-path" startOffset="81%" textAnchor="middle">
            DISCOVER
          </textPath>
        </text>
        <text className="project-preview-badge__separator">
          <textPath href="#project-cursor-badge-path" startOffset="27.75%" textAnchor="middle">
            •
          </textPath>
        </text>
        <text className="project-preview-badge__separator">
          <textPath href="#project-cursor-badge-path" startOffset="63.75%" textAnchor="middle">
            •
          </textPath>
        </text>
        <text className="project-preview-badge__separator">
          <textPath href="#project-cursor-badge-path" startOffset="98.5%" textAnchor="middle">
            •
          </textPath>
        </text>
      </svg>

      <span className="project-preview-badge__center">
        <Eye className="h-6 w-6" strokeWidth={1.75} />
      </span>
    </span>,
    document.body,
  )
}

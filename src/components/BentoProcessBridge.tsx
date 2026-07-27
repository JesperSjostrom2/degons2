'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

type ConnectorGeometry = {
  left: number
  top: number
  width: number
  height: number
  path: string
}

export default function BentoProcessBridge({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [geometry, setGeometry] = useState<ConnectorGeometry | null>(null)

  const measureConnector = useCallback(() => {
    const wrapper = wrapperRef.current
    const source = wrapper?.querySelector<HTMLElement>('[data-bento-card="fastDelivery"]')
    const target = wrapper?.querySelector<HTMLElement>('[data-process-panel]')

    if (!wrapper || !source || !target || window.innerWidth < 768) {
      setGeometry(null)
      return
    }

    const wrapperRect = wrapper.getBoundingClientRect()
    const sourceRect = source.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    const horizontalOffset = 18
    const startX = sourceRect.right - wrapperRect.left + 28 + horizontalOffset
    const startY = sourceRect.top - wrapperRect.top + sourceRect.height * 0.63
    const endX = targetRect.right - wrapperRect.left + 6 + horizontalOffset
    const endY = targetRect.top - wrapperRect.top + 24
    const outward = Math.min(110, Math.max(82, wrapperRect.width - Math.max(startX, endX) - 12))

    const controlOneX = startX + outward
    const controlOneY = startY + 38
    const controlTwoX = endX + outward
    const controlTwoY = endY - 48
    const left = Math.min(startX, endX) - 18
    const top = Math.min(startY, endY) - 18
    const right = Math.max(controlOneX, controlTwoX) + 22
    const bottom = Math.max(startY, endY) + 22
    const width = right - left
    const height = bottom - top

    const localStartX = startX - left
    const localStartY = startY - top
    const localEndX = endX - left
    const localEndY = endY - top

    setGeometry({
      left,
      top,
      width,
      height,
      path: `M ${localStartX} ${localStartY} C ${controlOneX - left} ${controlOneY - top}, ${controlTwoX - left} ${controlTwoY - top}, ${localEndX} ${localEndY}`,
    })
  }, [])

  const scheduleMeasurement = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null
      measureConnector()
    })
  }, [measureConnector])

  useEffect(() => {
    const wrapper = wrapperRef.current

    if (!wrapper) return

    const source = wrapper.querySelector<HTMLElement>('[data-bento-card="fastDelivery"]')
    const target = wrapper.querySelector<HTMLElement>('[data-process-panel]')
    const resizeObserver = new ResizeObserver(scheduleMeasurement)

    resizeObserver.observe(wrapper)
    if (source) resizeObserver.observe(source)
    if (target) resizeObserver.observe(target)

    // Deliberately no scroll listener: every value in measureConnector is a
    // difference between two rects in the same document flow, so it is
    // scroll-invariant. Recomputing it per frame cost three forced layouts, a
    // setState and an SVG path rebuild for an identical result.
    window.addEventListener('resize', scheduleMeasurement, { passive: true })
    scheduleMeasurement()

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', scheduleMeasurement)

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [scheduleMeasurement])

  return (
    <div ref={wrapperRef} className="bento-process-bridge relative">
      {children}

      {geometry ? (
        <svg
          className="bento-process-connector"
          aria-hidden="true"
          focusable="false"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          style={{ left: geometry.left, top: geometry.top, width: geometry.width, height: geometry.height }}
        >
          <defs>
            <marker
              id="bento-process-arrowhead"
              markerWidth="18"
              markerHeight="22"
              viewBox="0 0 139 172"
              refX="-40"
              refY="24.3"
              orient="auto"
              markerUnits="userSpaceOnUse"
              overflow="visible"
            >
              <image href="/assets/rocket-icon.svg" x="0" y="0" width="139" height="172" transform="rotate(90 64.3 24.3)" />
            </marker>
          </defs>
          <path className="bento-process-connector-path" d={geometry.path} markerEnd="url(#bento-process-arrowhead)" />
        </svg>
      ) : null}
    </div>
  )
}

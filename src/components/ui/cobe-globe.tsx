"use client"

import { useEffect, useRef, useCallback, useMemo } from "react"
import createGlobe from "cobe"

let globeEngineWarmupPromise: Promise<void> | null = null

export const warmCobeGlobeEngine = () => {
  if (typeof window === "undefined") {
    return Promise.resolve()
  }

  if (globeEngineWarmupPromise) {
    return globeEngineWarmupPromise
  }

  globeEngineWarmupPromise = new Promise<void>((resolve) => {
    const canvas = document.createElement("canvas")
    canvas.width = 48
    canvas.height = 48
    canvas.style.cssText = "position:fixed;left:-100px;top:-100px;width:48px;height:48px;opacity:0;pointer-events:none;"
    document.body.appendChild(canvas)

    try {
      const globe = createGlobe(canvas, {
        devicePixelRatio: 1,
        width: 48,
        height: 48,
        phi: 0,
        theta: 0.1,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 900,
        mapBrightness: 16,
        baseColor: [0.1, 0.1, 0.1],
        markerColor: [0.5, 0.64, 0.78],
        glowColor: [1, 1, 1],
        markerElevation: 0.01,
        markers: [],
        arcs: [],
        arcColor: [0.42, 0.55, 0.68],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.7,
      })

      globe.update({ phi: 0.02, theta: 0.1 })
      window.requestAnimationFrame(() => {
        globe.destroy()
        canvas.remove()
        resolve()
      })
    } catch {
      canvas.remove()
      resolve()
    }
  })

  return globeEngineWarmupPromise
}

const scheduleIdleWork = (callback: () => void) => {
  const requestIdleCallback = window.requestIdleCallback?.bind(window)
  const cancelIdleCallback = window.cancelIdleCallback?.bind(window)

  if (requestIdleCallback && cancelIdleCallback) {
    const idleId = requestIdleCallback(callback, { timeout: 900 })

    return () => cancelIdleCallback(idleId)
  }

  const timeoutId = window.setTimeout(callback, 120)

  return () => window.clearTimeout(timeoutId)
}

interface Marker {
  id: string
  location: [number, number]
  label: string
}

interface Arc {
  id: string
  from: [number, number]
  to: [number, number]
  label?: string
}

interface GlobeProps {
  markers?: Marker[]
  arcs?: Arc[]
  className?: string
  markerColor?: [number, number, number]
  baseColor?: [number, number, number]
  arcColor?: [number, number, number]
  glowColor?: [number, number, number]
  dark?: number
  mapBrightness?: number
  markerSize?: number
  markerElevation?: number
  arcWidth?: number
  arcHeight?: number
  speed?: number
  theta?: number
  diffuse?: number
  mapSamples?: number
  maxDevicePixelRatio?: number
  targetFps?: number
  initRootMargin?: string
  eagerInit?: boolean
  interactive?: boolean
  showLabels?: boolean
  pauseOnScroll?: boolean
}

export function Globe({
  markers = [],
  arcs = [],
  className = "",
  markerColor = [0.3, 0.45, 0.85],
  baseColor = [1, 1, 1],
  arcColor = [0.3, 0.45, 0.85],
  glowColor = [0.94, 0.93, 0.91],
  dark = 0,
  mapBrightness = 10,
  markerSize = 0.025,
  markerElevation = 0.01,
  arcWidth = 0.5,
  arcHeight = 0.25,
  speed = 0.003,
  theta = 0.2,
  diffuse = 1.5,
  mapSamples = 16000,
  maxDevicePixelRatio = 2,
  targetFps = 60,
  initRootMargin = "80px 0px",
  eagerInit = false,
  interactive = true,
  showLabels = true,
  pauseOnScroll = false,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const velocity = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const isScrollPausedRef = useRef(false)
  const startAnimatingRef = useRef<() => void>(() => {})
  const stopAnimatingRef = useRef<() => void>(() => {})
  const markerData = useMemo(
    () => markers.map((m) => ({ location: m.location, size: markerSize, id: m.id })),
    [markers, markerSize],
  )
  const arcData = useMemo(
    () => arcs.map((a) => ({ from: a.from, to: a.to, id: a.id })),
    [arcs],
  )

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x
      const deltaY = e.clientY - pointerInteracting.current.y
      dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 }
      const now = Date.now()
      if (lastPointer.current) {
        const dt = Math.max(now - lastPointer.current.t, 1)
        const maxVelocity = 0.15
        velocity.current = {
          phi: Math.max(
            -maxVelocity,
            Math.min(maxVelocity, ((e.clientX - lastPointer.current.x) / dt) * 0.3)
          ),
          theta: Math.max(
            -maxVelocity,
            Math.min(maxVelocity, ((e.clientY - lastPointer.current.y) / dt) * 0.08)
          ),
        }
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      lastPointer.current = null
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "pointer"
    isPausedRef.current = false
    window.removeEventListener("pointermove", handlePointerMove)
    window.removeEventListener("pointerup", handlePointerUp)
    startAnimatingRef.current()
  }, [handlePointerMove])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive) return

      pointerInteracting.current = { x: e.clientX, y: e.clientY }
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
      isPausedRef.current = true
      window.addEventListener("pointermove", handlePointerMove, { passive: true })
      window.addEventListener("pointerup", handlePointerUp, { passive: true })
      startAnimatingRef.current()
    },
    [handlePointerMove, handlePointerUp, interactive]
  )

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId = 0
    let initObserver: IntersectionObserver | null = null
    let observer: IntersectionObserver | null = null
    let resizeObserver: ResizeObserver | null = null
    let cancelIdleInit: (() => void) | null = null
    let phi = 0
    let isVisible = false
    let shouldInitialize = false
    let lastFrameTime = 0
    const minFrameDuration = 1000 / Math.max(1, targetFps)

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      const isMobileViewport = window.matchMedia('(max-width: 767px)').matches
      const dpr = isMobileViewport ? 1 : Math.min(window.devicePixelRatio || 1, maxDevicePixelRatio)
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width,
        height: width,
        phi: 0,
        theta,
        dark,
        diffuse,
        mapSamples,
        mapBrightness,
        baseColor,
        markerColor,
        glowColor,
        markerElevation,
        markers: markerData,
        arcs: arcData,
        arcColor,
        arcWidth,
        arcHeight,
        opacity: 0.7,
      })
      globe.update({ phi, theta })
      canvas.style.opacity = "1"

      function animate(timestamp: number) {
        if (isScrollPausedRef.current) {
          animationId = 0
          return
        }

        if (lastFrameTime && timestamp - lastFrameTime < minFrameDuration) {
          animationId = requestAnimationFrame(animate)
          return
        }

        const frameScale = lastFrameTime ? Math.min((timestamp - lastFrameTime) / (1000 / 60), 2) : 1
        lastFrameTime = timestamp

        const hasVelocity =
          Math.abs(velocity.current.phi) > 0.0001 ||
          Math.abs(velocity.current.theta) > 0.0001
        const hasThetaCorrection = thetaOffsetRef.current < -0.4 || thetaOffsetRef.current > 0.4

        if (!isPausedRef.current) {
          phi += speed * frameScale
          if (hasVelocity) {
            phiOffsetRef.current += velocity.current.phi * frameScale
            thetaOffsetRef.current += velocity.current.theta * frameScale
            velocity.current.phi *= 0.95
            velocity.current.theta *= 0.95
          }
          const thetaMin = -0.4,
            thetaMax = 0.4
          if (thetaOffsetRef.current < thetaMin) {
            thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1
          } else if (thetaOffsetRef.current > thetaMax) {
            thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1
          }
        }
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: theta + thetaOffsetRef.current + dragOffset.current.theta,
        })

        const shouldContinue =
          isVisible &&
          !document.hidden &&
          !isScrollPausedRef.current &&
          (speed !== 0 || pointerInteracting.current !== null || hasVelocity || hasThetaCorrection)

        if (shouldContinue) {
          animationId = requestAnimationFrame(animate)
          return
        }

        animationId = 0
      }

      function startAnimating() {
        if (animationId || !isVisible || document.hidden) return
        lastFrameTime = 0
        animationId = requestAnimationFrame(animate)
      }

      startAnimatingRef.current = startAnimating

      function stopAnimating() {
        if (!animationId) return
        cancelAnimationFrame(animationId)
        animationId = 0
      }

      stopAnimatingRef.current = stopAnimating

      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting
          if (isVisible) {
            startAnimating()
          } else {
            stopAnimating()
          }
        },
        { threshold: 0.05 },
      )
      observer.observe(canvas)

      const handleVisibilityChange = () => {
        if (document.hidden) {
          stopAnimating()
          return
        }

        startAnimating()
      }

      let scrollPauseTimeout = 0
      const handleScroll = () => {
        if (!pauseOnScroll || !isVisible || pointerInteracting.current !== null) {
          return
        }

        isScrollPausedRef.current = true
        stopAnimating()
        window.clearTimeout(scrollPauseTimeout)
        scrollPauseTimeout = window.setTimeout(() => {
          isScrollPausedRef.current = false
          startAnimating()
        }, 140)
      }

      document.addEventListener("visibilitychange", handleVisibilityChange)
      if (pauseOnScroll) {
        window.addEventListener("scroll", handleScroll, { passive: true })
      }

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        window.removeEventListener("scroll", handleScroll)
        window.clearTimeout(scrollPauseTimeout)
        startAnimatingRef.current = () => {}
        stopAnimatingRef.current = () => {}
      }
    }

    let cleanupVisibilityChange: (() => void) | undefined

    const maybeInitialize = () => {
      if (!shouldInitialize || cleanupVisibilityChange || cancelIdleInit || canvas.offsetWidth <= 0) return

      if (eagerInit) {
        resizeObserver?.disconnect()
        resizeObserver = null
        cleanupVisibilityChange = init()
        return
      }

      cancelIdleInit = scheduleIdleWork(() => {
        cancelIdleInit = null

        if (!shouldInitialize || cleanupVisibilityChange || canvas.offsetWidth <= 0) return

        resizeObserver?.disconnect()
        resizeObserver = null
        cleanupVisibilityChange = init()
      })
    }

    initObserver = new IntersectionObserver(
      ([entry]) => {
        shouldInitialize = entry.isIntersecting
        if (shouldInitialize) {
          initObserver?.disconnect()
          initObserver = null
          maybeInitialize()
        }
      },
        { rootMargin: initRootMargin, threshold: 0 },
    )
    initObserver.observe(canvas)

    resizeObserver = new ResizeObserver(() => {
      maybeInitialize()
    })
    resizeObserver.observe(canvas)

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      initObserver?.disconnect()
      observer?.disconnect()
      resizeObserver?.disconnect()
      cancelIdleInit?.()
      cleanupVisibilityChange?.()
      if (globe) globe.destroy()
    }
  }, [markerData, arcData, markerColor, baseColor, arcColor, glowColor, dark, mapBrightness, markerElevation, arcWidth, arcHeight, speed, theta, diffuse, mapSamples, maxDevicePixelRatio, targetFps, initRootMargin, eagerInit, pauseOnScroll])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: interactive ? "pointer" : "default",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: interactive ? "none" : "auto",
        }}
      />
      {showLabels && markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 8,
            padding: "2px 6px",
            background: "#fff",
            color: "#000",
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            whiteSpace: "nowrap" as const,
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            transition: "opacity 0.45s ease",
          }}
        >
          {m.label}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translate3d(-50%, -1px, 0)",
              border: "5px solid transparent",
              borderTopColor: "#fff",
            }}
          />
        </div>
      ))}
      {showLabels && arcs
        .filter((a) => a.label)
        .map((a) => (
          <div
            key={a.id}
            style={{
              position: "absolute",
              // @ts-expect-error CSS Anchor Positioning
              positionAnchor: `--cobe-arc-${a.id}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              translate: "-50% 0",
              marginBottom: 8,
              padding: "2px 6px",
              background: "#fff",
              color: "#1a1a2e",
              fontFamily: "monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              whiteSpace: "nowrap" as const,
              pointerEvents: "none" as const,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              opacity: `var(--cobe-visible-arc-${a.id}, 0)`,
              transition: "opacity 0.45s ease",
            }}
          >
            {a.label}
            <span
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translate3d(-50%, -1px, 0)",
                border: "5px solid transparent",
                borderTopColor: "#fff",
              }}
            />
          </div>
        ))}
    </div>
  )
}

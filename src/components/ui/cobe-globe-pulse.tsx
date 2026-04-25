'use client';

import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import createGlobe from 'cobe';

type GlobeColor = [number, number, number];
const DEFAULT_THETA = 0.2;
const FOCUS_STIFFNESS = 0.035;
const FOCUS_DAMPING = 0.86;
const IDLE_DAMPING = 0.9;
const THETA_RETURN_STIFFNESS = 0.018;
const FULL_ROTATION = Math.PI * 2;

export interface PulseMarker {
  id: string;
  location: [number, number];
  delay: number;
  size?: number;
  color?: GlobeColor;
}

interface GlobePulseProps {
  markers?: PulseMarker[];
  className?: string;
  speed?: number;
  scale?: number;
  focusLocation?: [number, number];
}

const defaultMarkers: PulseMarker[] = [
  { id: 'pulse-1', location: [51.51, -0.13], delay: 0 },
  { id: 'pulse-2', location: [40.71, -74.01], delay: 0.5 },
  { id: 'pulse-3', location: [35.68, 139.65], delay: 1 },
  { id: 'pulse-4', location: [-33.87, 151.21], delay: 1.5 },
];

const normalizeAngle = (angle: number) => {
  let normalizedAngle = angle % FULL_ROTATION;

  if (normalizedAngle > Math.PI) {
    normalizedAngle -= FULL_ROTATION;
  }

  if (normalizedAngle < -Math.PI) {
    normalizedAngle += FULL_ROTATION;
  }

  return normalizedAngle;
};

const getFocusAngles = ([lat, lng]: [number, number]) => ({
  phi: (-lng * Math.PI) / 180,
  theta: (lat * Math.PI) / 180,
});

export function GlobePulse({
  markers = defaultMarkers,
  className = '',
  speed = 0.003,
  scale = 1,
  focusLocation,
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiRef = useRef(0);
  const thetaRef = useRef(DEFAULT_THETA);
  const phiVelocityRef = useRef(0);
  const thetaVelocityRef = useRef(0);
  const markersRef = useRef(markers);
  const focusLocationRef = useRef(focusLocation);
  const scaleRef = useRef(scale);
  const speedRef = useRef(speed);
  const isPausedRef = useRef(false);

  useEffect(() => {
    markersRef.current = markers;
    focusLocationRef.current = focusLocation;
    scaleRef.current = scale;
    speedRef.current = speed;
  }, [focusLocation, markers, scale, speed]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = { x: event.clientX, y: event.clientY };
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current) {
      phiRef.current = normalizeAngle(phiRef.current + dragOffset.current.phi);
      thetaRef.current += dragOffset.current.theta;
      phiVelocityRef.current = 0;
      thetaVelocityRef.current = 0;
      dragOffset.current = { phi: 0, theta: 0 };
    }

    pointerInteracting.current = null;

    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }

    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerInteracting.current) {
        return;
      }

      dragOffset.current = {
        phi: (event.clientX - pointerInteracting.current.x) / 300,
        theta: (event.clientY - pointerInteracting.current.y) / 1000,
      };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    let globe: ReturnType<typeof createGlobe> | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let animationId = 0;

    const renderGlobe = () => {
      const width = canvas.offsetWidth;

      if (!width || globe) {
        return;
      }

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: phiRef.current,
        theta: thetaRef.current,
        dark: 1,
        diffuse: 1.5,
        scale: scaleRef.current,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [0.38, 0.38, 0.38],
        markerColor: [0.2, 0.8, 0.9],
        glowColor: [0.05, 0.05, 0.05],
        markerElevation: 0,
        markers: markersRef.current.map(({ id, location, size, color }) => ({
          id,
          location,
          size: size ?? 0.025,
          color,
        })),
        arcs: [],
        arcColor: [0.3, 0.85, 0.95],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.7,
      });

      const animate = () => {
        if (!globe) {
          return;
        }

        if (!isPausedRef.current) {
          const focusLocation = focusLocationRef.current;

          if (focusLocation) {
            const targetAngles = getFocusAngles(focusLocation);

            phiVelocityRef.current += normalizeAngle(targetAngles.phi - phiRef.current) * FOCUS_STIFFNESS;
            thetaVelocityRef.current += (targetAngles.theta - thetaRef.current) * FOCUS_STIFFNESS;
            phiVelocityRef.current *= FOCUS_DAMPING;
            thetaVelocityRef.current *= FOCUS_DAMPING;

            phiRef.current = normalizeAngle(phiRef.current + phiVelocityRef.current);
            thetaRef.current += thetaVelocityRef.current;
          } else {
            thetaVelocityRef.current += (DEFAULT_THETA - thetaRef.current) * THETA_RETURN_STIFFNESS;
            phiVelocityRef.current *= IDLE_DAMPING;
            thetaVelocityRef.current *= IDLE_DAMPING;

            phiRef.current = normalizeAngle(phiRef.current + speedRef.current + phiVelocityRef.current);
            thetaRef.current += thetaVelocityRef.current;
          }
        }

        globe.update({
          phi: phiRef.current + dragOffset.current.phi,
          theta: thetaRef.current + dragOffset.current.theta,
          markers: markersRef.current.map(({ id, location, size, color }) => ({
            id,
            location,
            size: size ?? 0.025,
            color,
          })),
          scale: scaleRef.current,
        });

        animationId = window.requestAnimationFrame(animate);
      };

      animationId = window.requestAnimationFrame(animate);

      canvas.style.opacity = '1';
    };

    if (canvas.offsetWidth > 0) {
      renderGlobe();
    } else {
      resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width) {
          resizeObserver?.disconnect();
          renderGlobe();
        }
      });

      resizeObserver.observe(canvas);
    }

    return () => {
      if (animationId) {
        window.cancelAnimationFrame(animationId);
      }

      resizeObserver?.disconnect();
      globe?.destroy();
    };
  }, []);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scale(0.3); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 1.2s ease',
          borderRadius: '50%',
          touchAction: 'none',
        }}
      />
      {markers.map((marker) => {
        const markerStyle = {
          position: 'absolute',
          positionAnchor: `--cobe-${marker.id}`,
          bottom: 'anchor(center)',
          left: 'anchor(center)',
          transform: 'translate(-50%, 50%)',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: `var(--cobe-visible-${marker.id}, 0)`,
          filter: `blur(calc((1 - var(--cobe-visible-${marker.id}, 0)) * 8px))`,
          transition: 'opacity 0.4s, filter 0.4s',
        } as CSSProperties & { positionAnchor: string };

        const pulseColor = marker.color ?? [0.2, 0.8, 0.9];
        const pulseRgb = `rgb(${pulseColor.map((value) => Math.round(value * 255)).join(' ')})`;

        return (
          <div key={marker.id} style={markerStyle}>
            <span
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px solid ${pulseRgb}`,
                borderRadius: '50%',
                opacity: 0,
                animation: `pulse-expand 2s ease-out infinite ${marker.delay}s`,
              }}
            />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px solid ${pulseRgb}`,
                borderRadius: '50%',
                opacity: 0,
                animation: `pulse-expand 2s ease-out infinite ${marker.delay + 0.5}s`,
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                background: pulseRgb,
                borderRadius: '50%',
                boxShadow: `0 0 0 3px #111, 0 0 0 5px ${pulseRgb}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

'use client'

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Copy, Check, User, Search, FileText, Smile, Send, Globe as GlobeIcon, Braces, Gift, ScanLine } from "lucide-react";
import { Globe } from "@/components/ui/cobe-globe";
import TextType from "@/components/ui/TextType";

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
  customContent?: React.ReactNode;
  customBackground?: React.CSSProperties;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "218, 197, 167";
const MOBILE_BREAKPOINT = 768;
const BENTO_ACCENTS = {
  brass: "#a88c62",
  champagne: "#c2a77b",
  gold: "#dac5a7",
  bronze: "#8b7355",
  olive: "#8fa58a",
  blue: "#7fa7c8",
  silver: "#b0aea5",
  lavender: "#a79ac7",
};

const CHAT_CLIENT_MESSAGE = "Can we simplify this section a bit?";
const CHAT_JESPER_MESSAGE = "Yes. I’ll clean it up and share a preview.";

const WORKFLOW_ITEMS = [
  { key: "structure", title: "Structure", icon: Braces, color: "#dac5a7", position: "left-top" },
  { key: "frontend", title: "Frontend", icon: FileText, color: "#8fa58a", position: "left-middle" },
  { key: "launch", title: "Launch", icon: ScanLine, color: "#a79ac7", position: "left-bottom" },
  { key: "seo", title: "SEO", icon: Gift, color: "#7fa7c8", position: "right-top" },
  { key: "refine", title: "Refine", icon: Search, color: "#b0aea5", position: "right-middle" },
  { key: "ready", title: "Ready", icon: User, color: "#dac5a7", position: "right-bottom" },
];

const REMOTE_GLOBE_MARKERS = [
  { id: "helsinki", location: [60.1699, 24.9384] as [number, number], label: "Helsinki" },
  { id: "tokyo", location: [35.6762, 139.6503] as [number, number], label: "Tokyo" },
  { id: "sydney", location: [-33.8688, 151.2093] as [number, number], label: "Sydney" },
  { id: "newyork", location: [40.7128, -74.006] as [number, number], label: "New York" },
  { id: "capetown", location: [-33.9249, 18.4241] as [number, number], label: "Cape Town" },
];

const REMOTE_GLOBE_ARCS = [
  { id: "ny-hel", from: [40.7128, -74.006] as [number, number], to: [60.1699, 24.9384] as [number, number] },
  { id: "hel-ct", from: [60.1699, 24.9384] as [number, number], to: [-33.9249, 18.4241] as [number, number] },
  { id: "ct-tokyo", from: [-33.9249, 18.4241] as [number, number], to: [35.6762, 139.6503] as [number, number] },
  { id: "tokyo-syd", from: [35.6762, 139.6503] as [number, number], to: [-33.8688, 151.2093] as [number, number] },
];
const ExecutionWorkflowMap = () => {
  return (
    <div className="execution-map pointer-events-none relative h-full min-h-[14rem] w-full" aria-hidden="true">
      <svg className="execution-graphic" viewBox="0 0 520 260" preserveAspectRatio="none">
        <defs>
          <radialGradient id="executionBgGlow" cx="50%" cy="47%" r="58%">
            <stop offset="0%" stopColor="#dac5a7" stopOpacity="0.14" />
            <stop offset="42%" stopColor="#f5efe4" stopOpacity="0.035" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="executionHubGradient" cx="48%" cy="18%" r="78%">
            <stop offset="0%" stopColor="#8b8a84" stopOpacity="0.72" />
            <stop offset="46%" stopColor="#3c3c39" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#171716" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="executionNodeGradient" cx="42%" cy="18%" r="80%">
            <stop offset="0%" stopColor="#8f8e88" stopOpacity="0.68" />
            <stop offset="48%" stopColor="#4a4a46" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#242421" stopOpacity="1" />
          </radialGradient>
          <filter id="executionHubShadow" x="-45%" y="-45%" width="190%" height="190%">
            <feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#000000" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#dac5a7" floodOpacity="0.08" />
          </filter>
          <filter id="executionNodeShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#000000" floodOpacity="0.38" />
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f5efe4" floodOpacity="0.06" />
          </filter>
          <pattern id="executionDots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="9" r="1.1" fill="#f5efe4" opacity="0.16" />
          </pattern>
          <mask id="executionDotFade">
            <rect width="520" height="260" fill="black" />
            <ellipse cx="260" cy="124" rx="210" ry="118" fill="white" />
          </mask>
        </defs>

        <rect width="520" height="260" fill="url(#executionBgGlow)" />
        <rect x="36" y="0" width="448" height="240" fill="url(#executionDots)" mask="url(#executionDotFade)" />
        <ellipse className="execution-side-arc" cx="-28" cy="132" rx="142" ry="128" />
        <ellipse className="execution-side-arc" cx="548" cy="132" rx="142" ry="128" />

        <g className="execution-rails">
          <path className="execution-wall-rail" d="M0 130 C20 130 31 72 50 72" />
          <path className="execution-wall-rail" d="M0 130 C20 130 31 188 50 188" />
          <path className="execution-wall-rail" d="M520 130 C500 130 489 72 470 72" />
          <path className="execution-wall-rail" d="M520 130 C500 130 489 188 470 188" />
          <path className="execution-rail" d="M226 130 H178 C154 130 154 72 126 72 H58" />
          <path className="execution-rail" d="M226 130 H158 C142 130 136 130 116 130 H90" />
          <path className="execution-rail" d="M226 130 H178 C154 130 154 188 126 188 H58" />
          <path className="execution-rail" d="M294 130 H342 C366 130 366 72 394 72 H462" />
          <path className="execution-rail" d="M294 130 H362 C378 130 384 130 404 130 H430" />
          <path className="execution-rail" d="M294 130 H342 C366 130 366 188 394 188 H462" />
          <path className="execution-rail execution-rail-soft" d="M88 72 C116 104 113 154 88 188" />
          <path className="execution-rail execution-rail-soft" d="M432 72 C404 104 407 154 432 188" />
          <path className="execution-stub" d="M58 72 H82" />
          <path className="execution-stub" d="M82 130 H106" />
          <path className="execution-stub" d="M58 188 H82" />
          <path className="execution-stub" d="M438 72 H462" />
          <path className="execution-stub" d="M414 130 H438" />
          <path className="execution-stub" d="M438 188 H462" />
        </g>

        <g className="execution-flows">
          <path className="execution-flow-path execution-flow-a" d="M58 72 H126 C154 72 154 130 178 130 H226" />
          <path className="execution-flow-path execution-flow-b" d="M90 130 H226" />
          <path className="execution-flow-path execution-flow-c" d="M58 188 H126 C154 188 154 130 178 130 H226" />
          <path className="execution-flow-path execution-flow-d" d="M294 130 H342 C366 130 366 72 394 72 H462" />
          <path className="execution-flow-path execution-flow-e" d="M294 130 H430" />
          <path className="execution-flow-path execution-flow-f" d="M294 130 H342 C366 130 366 188 394 188 H462" />
        </g>

        <g className="execution-svg-nodes">
          <circle cx="58" cy="72" r="28" />
          <circle cx="90" cy="130" r="28" />
          <circle cx="58" cy="188" r="28" />
          <circle cx="462" cy="72" r="28" />
          <circle cx="430" cy="130" r="28" />
          <circle cx="462" cy="188" r="28" />
        </g>

        <rect className="execution-svg-hub" x="225" y="95" width="70" height="70" rx="17" />
        <g className="execution-svg-dots">
          <circle cx="249" cy="121" r="2.45" />
          <circle cx="260" cy="121" r="2.45" />
          <circle cx="271" cy="121" r="2.45" />
          <circle cx="249" cy="130" r="2.45" />
          <circle cx="260" cy="130" r="2.45" />
          <circle cx="271" cy="130" r="2.45" />
          <circle cx="249" cy="139" r="2.45" />
          <circle cx="260" cy="139" r="2.45" />
          <circle cx="271" cy="139" r="2.45" />
        </g>
        <circle className="execution-corner-dot-svg" cx="28" cy="130" r="4" />
        <circle className="execution-corner-dot-svg" cx="492" cy="130" r="4" />
      </svg>

      <div className="execution-hub">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {WORKFLOW_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className={`execution-node execution-node-${item.position}`}
            style={{ '--service-color': item.color } as React.CSSProperties}
          >
            <Icon className="h-4 w-4" strokeWidth={1.85} />
            <span>{item.title}</span>
          </div>
        );
      })}
    </div>
  );
};

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR,
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const createRipple = (element: HTMLElement, x: number, y: number, glowColor: string) => {
  const rect = element.getBoundingClientRect();
  const maxDistance = Math.max(
    Math.hypot(x, y),
    Math.hypot(x - rect.width, y),
    Math.hypot(x, y - rect.height),
    Math.hypot(x - rect.width, y - rect.height),
  );
  const ripple = document.createElement("div");

  ripple.style.cssText = `
    position: absolute;
    width: ${maxDistance * 2}px;
    height: ${maxDistance * 2}px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
    left: ${x - maxDistance}px;
    top: ${y - maxDistance}px;
    pointer-events: none;
    z-index: 1000;
  `;

  element.appendChild(ripple);
  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 1 },
    {
      scale: 1,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => ripple.remove(),
    },
  );
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = false,
  clickEffect = false,
  enableMagnetism = false,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef<HTMLDivElement[]>([]);
    const particlesInitialized = useRef(false);
    const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

    const initializeParticles = useCallback(() => {
      if (particlesInitialized.current || !cardRef.current) return;

      const { width, height } = cardRef.current.getBoundingClientRect();
      memoizedParticles.current = Array.from({ length: particleCount }, () =>
        createParticleElement(
          Math.random() * width,
          Math.random() * height,
          glowColor,
        ),
      );
      particlesInitialized.current = true;
    }, [particleCount, glowColor]);

    const clearAllParticles = useCallback(() => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      magnetismAnimationRef.current?.kill();

      particlesRef.current.forEach((particle) => {
        gsap.to(particle, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "back.in(1.7)",
          onComplete: () => {
            particle.parentNode?.removeChild(particle);
          },
        });
      });
      particlesRef.current = [];
    }, []);

    const animateParticles = useCallback(() => {
      if (!cardRef.current || !isHoveredRef.current) return;

      if (!particlesInitialized.current) {
        initializeParticles();
      }

      memoizedParticles.current.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHoveredRef.current || !cardRef.current) return;

          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.current.appendChild(clone);
          particlesRef.current.push(clone);

          gsap.fromTo(
            clone,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
          );

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: "none",
            repeat: -1,
            yoyo: true,
          });

          gsap.to(clone, {
            opacity: 0.3,
            duration: 1.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
        }, index * 100);

        timeoutsRef.current.push(timeoutId);
      });
    }, [initializeParticles]);

    useEffect(() => {
      if (disableAnimations || !cardRef.current) return;

      const element = cardRef.current;

      const handleMouseEnter = () => {
        isHoveredRef.current = true;
        animateParticles();

        if (enableTilt) {
          gsap.to(element, {
            rotateX: 5,
            rotateY: 5,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 1000,
          });
        }
      };

      const handleMouseLeave = () => {
        isHoveredRef.current = false;
        clearAllParticles();

        if (enableTilt) {
          gsap.to(element, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }

        if (enableMagnetism) {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableTilt && !enableMagnetism) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (enableTilt) {
          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;

          gsap.to(element, {
            rotateX,
            rotateY,
            duration: 0.04,
            ease: "power2.out",
            overwrite: "auto",
            transformPerspective: 1000,
          });
        }

        if (enableMagnetism) {
          const magnetX = (x - centerX) * 0.05;
          const magnetY = (y - centerY) * 0.05;

          magnetismAnimationRef.current = gsap.to(element, {
            x: magnetX,
            y: magnetY,
            duration: 0.08,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      const handleClick = (e: MouseEvent) => {
        if (!clickEffect) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        createRipple(element, x, y, glowColor);
      };

      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("click", handleClick);

      return () => {
        isHoveredRef.current = false;
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("click", handleClick);
        clearAllParticles();
      };
    }, [
      animateParticles,
      clearAllParticles,
      disableAnimations,
      enableTilt,
      enableMagnetism,
      clickEffect,
      glowColor,
    ]);

    return (
      <div
        ref={cardRef}
        className={`${className} relative overflow-hidden`}
        style={{ ...style, position: "relative", overflow: "hidden" }}
      >
        {children}
      </div>
    );
  };

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
    const spotlightRef = useRef<HTMLDivElement | null>(null);
    const isInsideSection = useRef(false);

    useEffect(() => {
      if (disableAnimations || !gridRef?.current || !enabled) return;

      const spotlight = document.createElement("div");
      spotlight.className = "global-spotlight";
      spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
      document.body.appendChild(spotlight);
      spotlightRef.current = spotlight;

      const handleMouseMove = (e: MouseEvent) => {
        if (!spotlightRef.current || !gridRef.current) return;

        const section = gridRef.current.closest(".bento-section");
        const rect = section?.getBoundingClientRect();
        const mouseInside =
          rect &&
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        isInsideSection.current = mouseInside || false;
        const cards = gridRef.current.querySelectorAll(".card");

        if (!mouseInside) {
          gsap.to(spotlightRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          });
          cards.forEach((card) => {
            (card as HTMLElement).style.setProperty("--glow-intensity", "0");
          });
          return;
        }

        const { proximity, fadeDistance } =
          calculateSpotlightValues(spotlightRadius);
        let minDistance = Infinity;

        cards.forEach((card) => {
          const cardElement = card as HTMLElement;
          const cardRect = cardElement.getBoundingClientRect();
          const centerX = cardRect.left + cardRect.width / 2;
          const centerY = cardRect.top + cardRect.height / 2;
          const distance =
            Math.hypot(e.clientX - centerX, e.clientY - centerY) -
            Math.max(cardRect.width, cardRect.height) / 2;
          const effectiveDistance = Math.max(0, distance);

          minDistance = Math.min(minDistance, effectiveDistance);

          let glowIntensity = 0;
          if (effectiveDistance <= proximity) {
            glowIntensity = 1;
          } else if (effectiveDistance <= fadeDistance) {
            glowIntensity =
              (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
          }

          updateCardGlowProperties(
            cardElement,
            e.clientX,
            e.clientY,
            glowIntensity,
            spotlightRadius,
          );
        });

        gsap.set(spotlightRef.current, {
          left: e.clientX,
          top: e.clientY,
        });

        const targetOpacity =
          minDistance <= proximity
            ? 0.8
            : minDistance <= fadeDistance
              ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
              : 0;

        gsap.to(spotlightRef.current, {
          opacity: targetOpacity,
          duration: targetOpacity > 0 ? 0.2 : 0.5,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        isInsideSection.current = false;
        gridRef.current?.querySelectorAll(".card").forEach((card) => {
          (card as HTMLElement).style.setProperty("--glow-intensity", "0");
        });
        if (spotlightRef.current) {
          gsap.to(spotlightRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
        spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
      };
    }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

    return null;
  };

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-4 w-full max-w-[88rem] mx-auto select-none relative"
    style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)" }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const checkMobile = () => setIsMobile(mediaQuery.matches);

    checkMobile();
    mediaQuery.addEventListener("change", checkMobile);

    return () => mediaQuery.removeEventListener("change", checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = false,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = false,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const copyFeedbackTimeoutRef = useRef<number | null>(null);
  const chatTypingTimeoutsRef = useRef<number[]>([]);
  const chatClientTextRef = useRef<HTMLParagraphElement>(null);
  const chatJesperTextRef = useRef<HTMLParagraphElement>(null);
  const firstImpressionRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const [isContactCopied, setIsContactCopied] = useState(false);
  const [endToEndSvg, setEndToEndSvg] = useState<string>("");
  const [fastDeliverySvg, setFastDeliverySvg] = useState<string>("");
  const [firstImpressionSvg, setFirstImpressionSvg] = useState<string>("");

  const setFirstImpressionLineAnimations = useCallback((active: boolean) => {
    firstImpressionRef.current
      ?.querySelectorAll<SVGAnimationElement>(".main-line-hover-animation")
      .forEach((animation) => {
        if (active) {
          animation.beginElement();
          return;
        }

        animation.endElement();
      });
  }, []);

  const clearChatTypingTimeouts = useCallback(() => {
    chatTypingTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    chatTypingTimeoutsRef.current = [];
  }, []);

  const typeChatMessage = useCallback((element: HTMLParagraphElement | null, message: string, startDelay: number) => {
    if (!element) {
      return startDelay;
    }

    let elapsed = startDelay;
    Array.from(message).forEach((character, index) => {
      chatTypingTimeoutsRef.current.push(window.setTimeout(() => {
        element.textContent = message.slice(0, index + 1);
      }, elapsed));

      if (character === " ") {
        elapsed += 28;
      } else if ([".", "?", "!"].includes(character)) {
        elapsed += 145;
      } else if (character === ",") {
        elapsed += 95;
      } else {
        elapsed += 30 + (index % 4) * 8;
      }
    });

    return elapsed;
  }, []);

  const resetChatText = useCallback(() => {
    clearChatTypingTimeouts();
    if (chatClientTextRef.current) {
      chatClientTextRef.current.textContent = CHAT_CLIENT_MESSAGE;
    }
    if (chatJesperTextRef.current) {
      chatJesperTextRef.current.textContent = CHAT_JESPER_MESSAGE;
    }
  }, [clearChatTypingTimeouts]);

  const startChatTyping = useCallback(() => {
    clearChatTypingTimeouts();
    if (chatClientTextRef.current) {
      chatClientTextRef.current.textContent = "";
    }
    if (chatJesperTextRef.current) {
      chatJesperTextRef.current.textContent = "";
    }

    const clientEnd = typeChatMessage(chatClientTextRef.current, CHAT_CLIENT_MESSAGE, 260);
    typeChatMessage(chatJesperTextRef.current, CHAT_JESPER_MESSAGE, clientEnd + 420);
  }, [clearChatTypingTimeouts, typeChatMessage]);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
      clearChatTypingTimeouts();
    };
  }, [clearChatTypingTimeouts]);

  useEffect(() => {
    let isMounted = true;

    fetch("/assets/bento-cards/end-to-end-delivery/path.svg")
      .then((response) => response.text())
      .then((svg) => {
        if (isMounted) {
          setEndToEndSvg(svg);
        }
      })
      .catch((error) => {
        console.error("Failed to load end-to-end SVG", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch("/assets/bento-cards/visitor-flow/time.svg")
      .then((response) => response.text())
      .then((svg) => {
        if (isMounted) {
          setFastDeliverySvg(svg);
        }
      })
      .catch((error) => {
        console.error("Failed to load fast delivery SVG", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch("/assets/bento-cards/first-impression/Starrating.svg")
      .then((response) => response.text())
      .then((svg) => {
        if (isMounted) {
          setFirstImpressionSvg(svg);
        }
      })
      .catch((error) => {
        console.error("Failed to load first impression SVG", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getRemoteWorkCard = () => ({
    color: BENTO_ACCENTS.blue,
    title: "Remote collaboration without friction",
    description: "Async-friendly updates, flexible coordination, and clear progress keep the workflow smooth across locations and time zones.",
    label: "Availability",
    customContent: (
      <div className="remote-card relative flex h-full flex-col overflow-hidden">
        <div className="bento-dot-grid absolute inset-0" style={{ WebkitMaskImage: "radial-gradient(circle at 50% 100%, black 0 30%, transparent 65%)", maskImage: "radial-gradient(circle at 50% 100%, black 0 30%, transparent 65%)" }} />
        <div className="remote-card-copy relative z-20 flex flex-col p-6 pb-3">
          <p className="bento-card-kicker">Availability</p>
          <h2 className="bento-card-heading text-white">
            Remote-first,<br />
            <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.blue }}>wherever you are.</span>
          </h2>
          <p className="bento-card-caption">Async-friendly updates and flexible coordination keep progress clear across locations.</p>

        </div>

        <div className="remote-card-globe-shell relative z-10 mt-auto min-h-[220px] h-[52%] overflow-hidden pointer-events-none">
          <div className="remote-card-globe-position absolute inset-x-0 bottom-[-72%] h-[168%] flex items-center justify-center pointer-events-auto">
            <Globe
              className="remote-card-globe relative z-10 w-full max-w-[520px] scale-[0.95] overflow-hidden"
              dark={1}
              baseColor={[0.1, 0.1, 0.1]}
              glowColor={[1, 1, 1]}
              markerColor={[0.5, 0.64, 0.78]}
              arcColor={[0.42, 0.55, 0.68]}
              theta={0.1}
              mapSamples={isMobile ? 5000 : 12000}
              speed={isMobile ? 0.0008 : 0.0016}
              markers={REMOTE_GLOBE_MARKERS}
              arcs={REMOTE_GLOBE_ARCS}
            />
          </div>
        </div>
      </div>
    ),
  });

  // Create cardData array with the remote work card that has access to state
  const cardData = [
    {
      color: BENTO_ACCENTS.lavender,
      title: "One connected website workflow",
      description: "Structure, visuals, development, motion, responsiveness, polish, and launch readiness handled as one cohesive process.",
      label: "End-to-end delivery",
      customContent: (
        <div className="group/engine service-engine-card relative -m-8 flex h-[calc(100%+4rem)] flex-col overflow-hidden">
          {endToEndSvg ? (
            <div
              className="end-to-end-svg pointer-events-none absolute inset-0 z-10 h-full w-full"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: endToEndSvg }}
            />
          ) : null}

          <div className="bento-feature-copy bento-mobile-readable relative z-30 max-w-[16.5rem] p-6 sm:p-8">
            <p className="bento-card-kicker">End-to-end delivery</p>
            <h2 className="bento-card-heading text-white">
              One workflow,<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.lavender }}>handled together.</span>
            </h2>
            <p className="bento-card-caption">From structure and visuals to development, motion, responsiveness, and launch polish, every part is shaped to feel connected.</p>
          </div>

          <div className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] shadow-[inset_0_0_60px_rgba(218,197,167,0.03)]" />
        </div>
      ),
    },
    {
      color: BENTO_ACCENTS.olive,
      title: "Clear updates, smooth progress.",
      description: "Quick replies, simple check-ins, and clear next steps keep the project moving without needless back-and-forth.",
      label: "Clear Communication",
      customContent: (
        <div
          className="group/attention attention-chat-card relative -m-8 flex h-[calc(100%+4rem)] flex-col overflow-hidden"
          onMouseEnter={startChatTyping}
          onMouseLeave={resetChatText}
        >
          <div className="bento-dot-grid absolute inset-0" />

          <div className="bento-mobile-readable relative z-20 px-6 pb-0 pt-5">
            <p className="bento-card-kicker">Clear communication</p>
            <h2 className="bento-card-heading text-[#f5efe4]">
              Clear updates,<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.olive }}>smooth progress.</span>
            </h2>
            <p className="bento-card-caption hidden sm:block mt-1">Quick replies and clear next steps keep the work moving.</p>
          </div>

          <div className="chat-showcase-messages relative z-30 mt-5 flex flex-1 flex-col gap-1.5 px-6 pb-0">
            <div className="chat-line chat-line-in">
              <div className="chat-avatar">
                <span>C</span>
              </div>
              <div className="chat-bubble chat-bubble-in">
                <div className="chat-meta">Client · now</div>
                <p ref={chatClientTextRef} className="chat-typed chat-typed-in">{CHAT_CLIENT_MESSAGE}</p>
              </div>
            </div>

            <div className="chat-line chat-line-out chat-line-outgoing">
              <div className="chat-bubble chat-bubble-out">
                <div className="chat-meta">Jesper · now</div>
                <p ref={chatJesperTextRef} className="chat-typed chat-typed-out">{CHAT_JESPER_MESSAGE}</p>
              </div>
              <div className="chat-avatar chat-avatar-self">
                <span>J</span>
              </div>
            </div>

          </div>

          <div className="chat-input-bar relative z-40 mx-6 mb-3 mt-1.5 flex items-center gap-3 rounded-[0.85rem] border border-[color:var(--site-border)]/40 bg-[color:var(--site-bg)]/60 px-3.5 py-2 shadow-inner backdrop-blur-md dark:border-white/10 dark:bg-white/[0.02]">
            <span className="text-[1.05rem] font-light leading-none text-[color:var(--site-muted)] dark:text-white/50">+</span>
            <span className="chat-input-text flex-1 text-[12px] text-[color:var(--site-muted)] dark:text-white/40">Type a message</span>
            <Send className="h-3 w-3 text-[color:var(--site-muted)] dark:text-white/40" />
          </div>
        </div>
      ),
    },
    {
      color: BENTO_ACCENTS.champagne,
      title: "Fast progress, clean execution",
      description: "Quick iteration, clear decisions, and focused execution keep the project moving without sacrificing polish.",
      label: "Fast Delivery",
      customContent: (
        <div className="group/conversion relative flex h-full flex-col overflow-hidden">
          <div className="conversion-card-bg absolute inset-0" />

          <div className="contact-card-content conversion-flow-copy bento-mobile-readable relative z-30 max-w-[17.5rem] p-6 sm:p-8">
            <p className="bento-card-kicker">Fast delivery</p>
            <h2 className="bento-card-heading text-[#f5efe4]">
              Move fast,<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.champagne }}>launch clean.</span>
            </h2>
            <p className="bento-card-caption">Quick iterations and clear decisions keep progress moving without the chaos.</p>
          </div>

          <div className="conversion-phone-wrap pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible">
            {fastDeliverySvg ? (
              <div
                className="conversion-phone-svg conversion-flow-svg"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: fastDeliverySvg }}
              />
            ) : null}
          </div>
        </div>
      ),
    },
    getRemoteWorkCard(),
    {
      color: BENTO_ACCENTS.champagne,
      title: "A polished first impression",
      description: "Clear structure, refined details, and an intuitive flow that makes the business feel credible from the first few seconds.",
      label: "Services",
      customContent: (
        <div
          ref={firstImpressionRef}
          className="group/selling relative -m-8 flex h-[calc(100%+4rem)] flex-col overflow-hidden"
          onMouseEnter={() => setFirstImpressionLineAnimations(true)}
          onMouseLeave={() => setFirstImpressionLineAnimations(false)}
        >
          <div className="selling-site-bg absolute inset-0" />
          <div className="selling-site-ambient absolute inset-0" />
          <div className="selling-site-grid absolute inset-0" />
          <div className="selling-site-panels absolute inset-0" />
          <div className="selling-soundwaves absolute inset-0" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="selling-mobile-frost absolute inset-0" />

          <div className="bento-feature-copy bento-mobile-readable relative z-20 max-w-[19rem] p-6 sm:p-8">
            <p className="bento-card-kicker">First impression</p>
            <h2 className="bento-card-heading text-white">
              A site that<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.champagne }}>feels effortless.</span>
            </h2>
            <p className="bento-card-caption">A calm, refined experience with clear structure, smooth details, and an intuitive path that makes the next step feel obvious.</p>
          </div>

          <div className="first-impression-svg-wrap absolute inset-0 z-10 flex items-center justify-center">
            {firstImpressionSvg ? (
              <div
                className="first-impression-svg"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: firstImpressionSvg }}
              />
            ) : null}
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <style>
        {`
          @keyframes selling-bars-pulse {
            0%,
            100% {
              transform: scaleX(0.72);
              opacity: 0.8;
            }
            50% {
              transform: scaleX(1);
              opacity: 1;
            }
          }

          .selling-site-bg {
            background:
              radial-gradient(circle at 18% 16%, rgba(245, 239, 228, 0.055), transparent 42%),
              radial-gradient(circle at 72% 50%, rgba(218, 197, 167, 0.12), transparent 34%),
              radial-gradient(circle at 86% 66%, rgba(127, 167, 200, 0.14), transparent 38%),
              linear-gradient(180deg, rgba(17, 17, 16, 0.74), rgba(8, 8, 8, 0.92));
          }

          .deliverables-card-bg {
            background:
              radial-gradient(circle at 18% 18%, rgba(218, 197, 167, 0.12), transparent 36%),
              radial-gradient(circle at 82% 72%, rgba(127, 167, 200, 0.16), transparent 40%),
              linear-gradient(180deg, rgba(17, 17, 16, 0.68), rgba(8, 8, 8, 0.9));
          }

          .deliverables-card-grid {
            background-image:
              linear-gradient(rgba(245, 239, 228, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 239, 228, 0.035) 1px, transparent 1px);
            background-size: 28px 28px;
            opacity: 0.22;
            -webkit-mask-image: radial-gradient(circle at 72% 52%, black, transparent 70%);
            mask-image: radial-gradient(circle at 72% 52%, black, transparent 70%);
          }

          .service-engine-card {
            --engine-ease: cubic-bezier(0.22, 1, 0.36, 1);
            --services-ease: cubic-bezier(0.22, 1, 0.36, 1);
          }

          .end-to-end-svg {
            display: block;
            opacity: 1;
            transform-origin: center center;
            transform: translate3d(-1%, 3%, 0) scale(0.96);
            transition: opacity 760ms var(--services-ease), transform 900ms var(--services-ease), filter 900ms var(--services-ease);
          }

          .end-to-end-svg svg {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
          }

          .end-to-end-svg .workflow-flow {
            animation: none;
            opacity: 0;
          }

          .end-to-end-svg .workflow-icon,
          .end-to-end-svg .workflow-icon-glyph {
            transform-box: fill-box;
            transform-origin: center;
            transition: transform 760ms var(--services-ease), filter 760ms var(--services-ease);
          }

          .end-to-end-svg .workflow-center-dot {
            transform-box: fill-box;
            transform-origin: center;
            transition: fill-opacity 240ms var(--services-ease), transform 240ms var(--services-ease), filter 240ms var(--services-ease);
          }

          .card:hover .service-engine-card .end-to-end-svg {
            opacity: 1;
          }

          .card:hover .service-engine-card .end-to-end-svg .workflow-icon,
          .card:hover .service-engine-card .end-to-end-svg .workflow-icon-glyph {
            transform: scale(1.16);
            filter: drop-shadow(0 0 10px rgba(248, 248, 248, 0.18));
          }

          .card:hover .service-engine-card .end-to-end-svg .workflow-flow {
            animation: workflow-flow-inward 1.25s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          }

          .card:hover .service-engine-card .end-to-end-svg .workflow-center-dot {
            animation: workflow-center-dot-scan 1.35s steps(1, end) infinite;
          }

          .card:hover .service-engine-card .end-to-end-svg .workflow-center-dot-2 {
            animation-delay: 150ms;
          }

          .card:hover .service-engine-card .end-to-end-svg .workflow-center-dot-3 {
            animation-delay: 300ms;
          }

          .card:hover .service-engine-card .end-to-end-svg .workflow-center-dot-4 {
            animation-delay: 450ms;
          }

          .card:hover .service-engine-card .end-to-end-svg .workflow-center-dot-5 {
            animation-delay: 600ms;
          }

          .card:hover .service-engine-card .end-to-end-svg .workflow-flow-middle {
            animation-delay: 90ms;
          }

          .card:hover .service-engine-card .end-to-end-svg .workflow-flow-bottom {
            animation-delay: 180ms;
          }

          @keyframes workflow-flow-inward {
            0% { opacity: 0; stroke-dashoffset: 150; }
            38% { opacity: 0.78; }
            100% { opacity: 0; stroke-dashoffset: -60; }
          }

          @keyframes workflow-center-dot-scan {
            0%, 100% { fill-opacity: 0.5; transform: scale(1); filter: none; }
            35% { fill-opacity: 1; transform: scale(1.38); filter: drop-shadow(0 0 7px rgba(248, 248, 248, 0.32)); }
            70% { fill-opacity: 0.5; transform: scale(1); filter: none; }
          }

          .execution-map {
            isolation: isolate;
            aspect-ratio: 2 / 1;
            width: 100%;
            height: auto;
            min-height: 0;
            max-height: 15rem;
            margin: 0;
          }

          .execution-map::before,
          .execution-map::after {
            display: none;
          }

          .execution-graphic {
            position: absolute;
            inset: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
            overflow: visible;
          }

          .execution-side-arc {
            fill: none;
            stroke: rgba(245, 239, 228, 0.045);
            stroke-width: 1;
          }

          .execution-wall-rail,
          .execution-rail,
          .execution-stub {
            fill: none;
            stroke: rgba(245, 239, 228, 0.16);
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 1.35;
            vector-effect: non-scaling-stroke;
            transition: stroke 760ms var(--services-ease), opacity 760ms var(--services-ease), filter 760ms var(--services-ease);
          }

          .execution-wall-rail {
            stroke: rgba(245, 239, 228, 0.055);
            stroke-width: 1;
          }

          .execution-rail-soft {
            opacity: 0.44;
          }

          .execution-stub {
            stroke: rgba(245, 239, 228, 0.58);
            stroke-width: 1.55;
          }

          .execution-flow-path {
            fill: none;
            stroke: rgba(218, 197, 167, 0.9);
            stroke-dasharray: 42 220;
            stroke-dashoffset: 180;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 1.8;
            opacity: 0;
            vector-effect: non-scaling-stroke;
            filter: drop-shadow(0 0 5px rgba(218, 197, 167, 0.18));
          }

          .execution-svg-nodes circle {
            fill: url(#executionNodeGradient);
            stroke: rgba(245, 239, 228, 0.14);
            stroke-width: 1.2;
            filter: url(#executionNodeShadow);
            transition: stroke 760ms var(--services-ease), filter 760ms var(--services-ease), transform 760ms var(--services-ease);
            transform-box: fill-box;
            transform-origin: center;
          }

          .execution-svg-hub {
            fill: url(#executionHubGradient);
            stroke: rgba(245, 239, 228, 0.18);
            stroke-width: 1.2;
            filter: url(#executionHubShadow);
            transition: stroke 760ms var(--services-ease), filter 760ms var(--services-ease), transform 760ms var(--services-ease);
            transform-box: fill-box;
            transform-origin: center;
          }

          .execution-svg-dots circle {
            fill: rgba(245, 239, 228, 0.48);
            transition: fill 760ms var(--services-ease), opacity 760ms var(--services-ease), transform 760ms var(--services-ease);
            transform-box: fill-box;
            transform-origin: center;
          }

          .execution-corner-dot-svg {
            fill: rgba(245, 239, 228, 0.16);
            filter: drop-shadow(0 0 8px rgba(245, 239, 228, 0.08));
          }

          .execution-hub {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 4;
            display: grid;
            width: 5.35rem;
            height: 5.35rem;
            grid-template-columns: repeat(3, 0.34rem);
            grid-template-rows: repeat(3, 0.34rem);
            place-content: center;
            gap: 0.34rem;
            border-radius: 1.15rem;
            border: 0;
            background: transparent;
            box-shadow: none;
            transform: translate(-50%, -50%);
            transition: border-color 760ms var(--services-ease), box-shadow 760ms var(--services-ease), transform 760ms var(--services-ease);
          }

          .execution-hub span {
            width: 0.34rem;
            height: 0.34rem;
            border-radius: 999px;
            background: rgba(245, 239, 228, 0.38);
            transition: background-color 760ms var(--services-ease), transform 760ms var(--services-ease), opacity 760ms var(--services-ease);
          }

          .execution-node {
            position: absolute;
            z-index: 3;
            display: flex;
            width: clamp(2.65rem, 10.8%, 3.42rem);
            height: clamp(2.65rem, 21.6%, 3.42rem);
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            border: 0;
            background: transparent;
            box-shadow: none;
            color: rgba(245, 239, 228, 0.74);
            transform: translate(-50%, -50%);
            transition: transform 760ms var(--services-ease), border-color 760ms var(--services-ease), box-shadow 760ms var(--services-ease), color 760ms var(--services-ease), background 760ms var(--services-ease);
          }

          .execution-node span {
            position: absolute;
            top: calc(100% + 0.42rem);
            left: 50%;
            padding: 0.18rem 0.42rem;
            border-radius: 999px;
            background: rgba(8, 8, 8, 0.46);
            color: rgba(245, 239, 228, 0.66);
            font-size: 0.55rem;
            font-weight: 800;
            letter-spacing: 0.12em;
            line-height: 1;
            text-transform: uppercase;
            opacity: 0;
            transform: translateX(-50%) translateY(-0.24rem);
            transition: opacity 560ms var(--services-ease), transform 560ms var(--services-ease);
            white-space: nowrap;
          }

          .execution-node-left-top { left: 11.15%; top: 27.7%; }
          .execution-node-left-middle { left: 17.3%; top: 50%; }
          .execution-node-left-bottom { left: 11.15%; top: 72.3%; }
          .execution-node-right-top { left: 88.85%; top: 27.7%; }
          .execution-node-right-middle { left: 82.7%; top: 50%; }
          .execution-node-right-bottom { left: 88.85%; top: 72.3%; }

          .card:hover .service-engine-card .execution-graphic {
            transform: scale(1.01);
          }

          .card:hover .service-engine-card .execution-svg-hub {
            stroke: rgba(218, 197, 167, 0.32);
            transform: scale(1.035);
          }

          .card:hover .service-engine-card .execution-wall-rail,
          .card:hover .service-engine-card .execution-rail,
          .card:hover .service-engine-card .execution-stub {
            stroke: rgba(218, 197, 167, 0.34);
            opacity: 0.9;
            filter: drop-shadow(0 0 6px rgba(218, 197, 167, 0.08));
          }

          .card:hover .service-engine-card .execution-stub {
            stroke: rgba(245, 239, 228, 0.72);
          }

          .card:hover .service-engine-card .execution-flow-path {
            animation: execution-flow-run 1.7s var(--services-ease) infinite;
          }

          .card:hover .service-engine-card .execution-flow-d,
          .card:hover .service-engine-card .execution-flow-e,
          .card:hover .service-engine-card .execution-flow-f {
            animation-name: execution-flow-run-reverse;
          }

          .card:hover .service-engine-card .execution-flow-b,
          .card:hover .service-engine-card .execution-flow-e {
            animation-delay: 120ms;
          }

          .card:hover .service-engine-card .execution-flow-c,
          .card:hover .service-engine-card .execution-flow-f {
            animation-delay: 240ms;
          }

          .card:hover .service-engine-card .execution-hub {
            transform: translate(-50%, -50%) scale(1.04);
          }

          .card:hover .service-engine-card .execution-hub span {
            background-color: rgba(218, 197, 167, 0.82);
          }

          .card:hover .service-engine-card .execution-hub span:nth-child(2),
          .card:hover .service-engine-card .execution-hub span:nth-child(4),
          .card:hover .service-engine-card .execution-hub span:nth-child(6),
          .card:hover .service-engine-card .execution-hub span:nth-child(8) {
            transform: scale(1.28);
          }

          .card:hover .service-engine-card .execution-node {
            color: color-mix(in srgb, var(--service-color) 72%, white 18%);
            transform: translate(-50%, -50%) translateY(-3px);
          }

          .card:hover .service-engine-card .execution-svg-nodes circle {
            stroke: rgba(218, 197, 167, 0.24);
            transform: translateY(-3px);
          }

          .card:hover .service-engine-card .execution-node span {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }

          .card:hover .service-engine-card .execution-node-left-middle,
          .card:hover .service-engine-card .execution-node-right-middle {
            transform: translate(-50%, -50%) translateY(-5px);
          }

          @keyframes execution-flow-run {
            0% { opacity: 0; stroke-dashoffset: 220; }
            34% { opacity: 0.82; }
            100% { opacity: 0; stroke-dashoffset: -80; }
          }

          @keyframes execution-flow-run-reverse {
            0% { opacity: 0; stroke-dashoffset: -80; }
            34% { opacity: 0.82; }
            100% { opacity: 0; stroke-dashoffset: 220; }
          }

          @media (max-width: 639px) {
            .execution-map {
              min-height: 16rem;
            }

            .execution-hub {
              width: 4rem;
              height: 4rem;
              border-radius: 1rem;
            }

            .execution-node {
              width: 2.65rem;
              height: 2.65rem;
            }

            .execution-node span {
              display: none;
            }

            .execution-node-left-top { left: 11.15%; top: 27.7%; }
            .execution-node-left-middle { left: 17.3%; top: 50%; }
            .execution-node-left-bottom { left: 11.15%; top: 72.3%; }
            .execution-node-right-top { left: 88.85%; top: 27.7%; }
            .execution-node-right-middle { left: 82.7%; top: 50%; }
            .execution-node-right-bottom { left: 88.85%; top: 72.3%; }
          }

          .services-system {
            isolation: isolate;
          }

          .services-system-grid {
            position: absolute;
            inset: 0;
            z-index: 0;
            border-radius: 1.35rem;
            background:
              linear-gradient(90deg, rgba(245, 239, 228, 0.03) 1px, transparent 1px),
              linear-gradient(180deg, rgba(245, 239, 228, 0.03) 1px, transparent 1px),
              linear-gradient(155deg, rgba(245, 239, 228, 0.03), rgba(245, 239, 228, 0.01));
            background-size: 4rem 3rem, 4rem 3rem, 100% 100%;
            opacity: 0.22;
            transition: opacity 760ms var(--services-ease);
            -webkit-mask-image: radial-gradient(circle at 58% 50%, black 0 56%, transparent 78%);
            mask-image: radial-gradient(circle at 58% 50%, black 0 56%, transparent 78%);
          }

          .services-system-grid::after {
            content: "";
            position: absolute;
            inset: 0.65rem;
            border-radius: 1.1rem;
            background-image:
              radial-gradient(closest-side, rgba(245, 239, 228, 0.055), transparent 72%),
              linear-gradient(155deg, rgba(245, 239, 228, 0.03), transparent 68%);
            background-size: 4rem 3rem, 100% 100%;
            opacity: 0.24;
          }

          .services-system-canvas {
            position: absolute;
            left: 54%;
            top: 50%;
            z-index: 2;
            display: flex;
            width: 8.8rem;
            min-height: 4.9rem;
            flex-direction: column;
            justify-content: center;
            gap: 0.42rem;
            border-radius: 1rem;
            border: 1px solid rgba(218, 197, 167, 0.16);
            background: linear-gradient(155deg, rgba(245, 239, 228, 0.035), rgba(8, 8, 8, 0.08));
            box-shadow: inset 0 1px 0 rgba(245, 239, 228, 0.08), inset 0 0 0 1px rgba(218, 197, 167, 0.06);
            padding: 0.72rem 0.78rem;
            transition: border-color 760ms var(--services-ease), box-shadow 760ms var(--services-ease), background-color 760ms var(--services-ease);
            transform: translate(-50%, -50%);
          }

          .services-system-canvas::before {
            content: "";
            position: absolute;
            inset: -1.6rem;
            z-index: -1;
            border-radius: 999px;
            background: radial-gradient(circle, rgba(218, 197, 167, 0.1), transparent 66%);
            opacity: 0.58;
            transition: opacity 760ms var(--services-ease);
          }

          .services-system-canvas-kicker {
            font-size: 0.52rem;
            font-weight: 800;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: rgba(218, 197, 167, 0.66);
          }

          .services-system-canvas-line {
            display: block;
            width: 4.2rem;
            height: 1px;
            border-radius: 999px;
            background: linear-gradient(90deg, rgba(218, 197, 167, 0.68), rgba(245, 239, 228, 0.08));
          }

          .services-system-canvas-line.short {
            width: 3rem;
            opacity: 0.68;
          }

          .services-system-ambient {
            position: absolute;
            inset: 18% 13% 10% 13%;
            z-index: 0;
            border-radius: 999px;
            background:
              radial-gradient(circle at 53% 48%, rgba(218, 197, 167, 0.16), transparent 33%),
              radial-gradient(circle at 22% 26%, rgba(127, 167, 200, 0.1), transparent 33%),
              radial-gradient(circle at 82% 72%, rgba(167, 154, 199, 0.1), transparent 34%);
            filter: blur(28px);
            opacity: 0.85;
          }

          .services-system-lines {
            position: absolute;
            inset: 0;
            z-index: 1;
          }

          .services-system-line,
          .services-system-line::after {
            position: absolute;
            display: block;
            border-radius: 999px;
            background: color-mix(in srgb, var(--line-color) 38%, transparent);
            opacity: 0.42;
            transition: opacity 760ms var(--services-ease), box-shadow 760ms var(--services-ease), background-color 760ms var(--services-ease);
          }

          .services-system-flow {
            position: absolute;
            z-index: 2;
            height: 2px;
            border-radius: 999px;
            background: linear-gradient(90deg, color-mix(in srgb, var(--flow-color) 88%, white 12%), transparent 82%);
            opacity: 0;
            transform: scaleX(0.1);
            transform-origin: left center;
          }

          .services-system-flow-seo {
            --flow-color: #7fa7c8;
            left: 31%;
            top: 33%;
            width: 22%;
          }

          .services-system-flow-development {
            --flow-color: #8fa58a;
            left: 31%;
            bottom: 32%;
            width: 22%;
          }

          .services-system-flow-hosting {
            --flow-color: #a79ac7;
            right: 25%;
            top: 33%;
            width: 18%;
            transform-origin: right center;
          }

          .services-system-flow-design {
            --flow-color: #dac5a7;
            right: 25%;
            bottom: 32%;
            width: 18%;
            transform-origin: right center;
          }

          .services-system-line::after {
            content: "";
          }

          .services-system-line-seo {
            --line-color: #7fa7c8;
            left: 30%;
            top: 33%;
            width: 23%;
            height: 1px;
          }

          .services-system-line-seo::after {
            right: 0;
            top: 0;
            width: 1px;
            height: 17%;
          }

          .services-system-line-hosting {
            --line-color: #a79ac7;
            right: 24%;
            top: 33%;
            width: 19%;
            height: 1px;
          }

          .services-system-line-hosting::after {
            left: 0;
            top: 0;
            width: 1px;
            height: 17%;
          }

          .services-system-line-development {
            --line-color: #8fa58a;
            left: 30%;
            bottom: 32%;
            width: 23%;
            height: 1px;
          }

          .services-system-line-development::after {
            right: 0;
            bottom: 0;
            width: 1px;
            height: 18%;
          }

          .services-system-line-design {
            --line-color: #dac5a7;
            right: 24%;
            bottom: 32%;
            width: 19%;
            height: 1px;
          }

          .services-system-line-design::after {
            left: 0;
            bottom: 0;
            width: 1px;
            height: 18%;
          }

          .services-system-node {
            position: absolute;
            z-index: 2;
            width: 0.34rem;
            height: 0.34rem;
            border-radius: 999px;
            background: var(--node-color);
            opacity: 0.62;
            box-shadow: 0 0 10px color-mix(in srgb, var(--node-color) 34%, transparent);
            transition: opacity 760ms var(--services-ease), box-shadow 760ms var(--services-ease), transform 760ms var(--services-ease);
          }

          .services-system-node-seo { --node-color: #7fa7c8; left: 52.8%; top: 32.4%; }
          .services-system-node-hosting { --node-color: #a79ac7; right: 42.5%; top: 32.4%; }
          .services-system-node-development { --node-color: #8fa58a; left: 52.8%; bottom: 31.4%; }
          .services-system-node-design { --node-color: #dac5a7; right: 42.5%; bottom: 31.4%; }

          .services-system-copy span {
            font-size: 0.56rem;
            font-weight: 800;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }

          .services-system-card {
            position: absolute;
            z-index: 3;
            display: flex;
            width: 11.8rem;
            min-height: 5.35rem;
            gap: 0.68rem;
            border-radius: 1.1rem;
            border: 1px solid color-mix(in srgb, var(--service-color) 38%, transparent);
            background: linear-gradient(165deg, color-mix(in srgb, var(--service-color) 23%, transparent), rgba(20, 20, 19, 0.34));
            box-shadow: inset 0 1px 0 color-mix(in srgb, var(--service-color) 20%, transparent), 0 8px 16px rgba(0, 0, 0, 0.2);
            padding: 0.78rem;
            transition: transform 760ms var(--services-ease), border-color 760ms var(--services-ease), box-shadow 760ms var(--services-ease), background 760ms var(--services-ease);
          }

          .services-system-card-seo { left: 4%; top: 6%; }
          .services-system-card-hosting { right: 2%; top: 10%; }
          .services-system-card-development { left: 2%; bottom: 8%; }
          .services-system-card-design { right: 4%; bottom: 6%; }

          .services-system-icon {
            display: flex;
            width: 2.1rem;
            height: 2.1rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            border: 1px solid color-mix(in srgb, var(--service-color) 46%, transparent);
            background: color-mix(in srgb, var(--service-color) 20%, transparent);
            color: var(--service-color);
            box-shadow: inset 0 1px 0 color-mix(in srgb, var(--service-color) 24%, transparent), 0 0 16px color-mix(in srgb, var(--service-color) 13%, transparent);
          }

          .services-system-copy {
            min-width: 0;
          }

          .services-system-copy span {
            color: color-mix(in srgb, var(--service-color) 78%, white 10%);
          }

          .services-system-copy strong {
            display: block;
            margin-top: 0.22rem;
            font-size: 0.9rem;
            font-weight: 800;
            line-height: 1.08;
            color: rgba(245, 239, 228, 0.92);
          }

          .services-system-copy p {
            margin-top: 0.36rem;
            font-size: 0.68rem;
            line-height: 1.35;
            color: rgba(176, 174, 165, 0.68);
          }

          .services-system-copy-micro {
            display: grid;
            grid-template-columns: 1fr 0.65fr;
            gap: 0.28rem;
            margin-top: 0.44rem;
          }

          .services-system-copy-micro span {
            height: 0.22rem;
            border-radius: 999px;
            background: color-mix(in srgb, var(--service-color) 34%, rgba(245, 239, 228, 0.18));
            opacity: 0.72;
          }

          .card:hover .service-engine-card .services-system-grid {
            opacity: 0.34;
          }

          .card:hover .service-engine-card .services-system-grid::after {
            opacity: 0.42;
          }

          .card:hover .service-engine-card .services-system-line,
          .card:hover .service-engine-card .services-system-line::after {
            opacity: 0.72;
            box-shadow: 0 0 12px color-mix(in srgb, var(--line-color) 18%, transparent);
          }

          .card:hover .service-engine-card .services-system-node {
            opacity: 0.9;
            transform: scale(1.24);
            animation: services-system-node-pulse 1.8s var(--services-ease) infinite;
          }

          .card:hover .service-engine-card .services-system-flow {
            opacity: 0.95;
            animation: services-system-flow-run 1.2s var(--services-ease) both;
          }

          .card:hover .service-engine-card .services-system-flow-development {
            animation-delay: 100ms;
          }

          .card:hover .service-engine-card .services-system-flow-hosting {
            animation-delay: 220ms;
          }

          .card:hover .service-engine-card .services-system-flow-design {
            animation-delay: 340ms;
          }

          .card:hover .service-engine-card .services-system-canvas {
            border-color: rgba(218, 197, 167, 0.3);
            box-shadow: inset 0 1px 0 rgba(245, 239, 228, 0.12), inset 0 0 0 1px rgba(218, 197, 167, 0.1), 0 0 24px rgba(218, 197, 167, 0.08);
            background: linear-gradient(155deg, rgba(245, 239, 228, 0.05), rgba(8, 8, 8, 0.12));
          }

          .card:hover .service-engine-card .services-system-canvas::before {
            opacity: 0.9;
          }

          .card:hover .service-engine-card .services-system-card {
            border-color: color-mix(in srgb, var(--service-color) 56%, transparent);
            background: linear-gradient(165deg, color-mix(in srgb, var(--service-color) 29%, transparent), rgba(20, 20, 19, 0.4));
            box-shadow: inset 0 1px 0 color-mix(in srgb, var(--service-color) 24%, transparent), 0 12px 20px rgba(0, 0, 0, 0.22), 0 0 22px color-mix(in srgb, var(--service-color) 12%, transparent);
            transform: translateY(-3px);
          }

          .card:hover .service-engine-card .services-system-card-seo {
            animation: services-system-card-focus 1.1s var(--services-ease) 0ms both;
          }

          .card:hover .service-engine-card .services-system-card-development {
            animation: services-system-card-focus 1.1s var(--services-ease) 120ms both;
          }

          .card:hover .service-engine-card .services-system-card-hosting {
            animation: services-system-card-focus 1.1s var(--services-ease) 240ms both;
          }

          .card:hover .service-engine-card .services-system-card-design {
            animation: services-system-card-focus 1.1s var(--services-ease) 360ms both;
          }

          @keyframes services-system-node-pulse {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.34); }
          }

          @keyframes services-system-flow-run {
            0% { opacity: 0; transform: scaleX(0.1); }
            36% { opacity: 0.9; transform: scaleX(1); }
            100% { opacity: 0.25; transform: scaleX(1); }
          }

          @keyframes services-system-card-focus {
            0% { transform: translateY(0); }
            42% { transform: translateY(-4px); }
            100% { transform: translateY(-3px); }
          }

          @media (max-width: 639px) {
            .service-engine-card .bento-mobile-readable h2 {
              font-size: 1.18rem;
              line-height: 1.12;
            }

            .service-engine-card .bento-mobile-readable p:last-child {
              max-width: 12rem;
              font-size: 0.72rem;
              line-height: 1.4;
            }

            .services-system {
              min-height: 16.2rem;
            }

            .services-system-canvas {
              left: 50%;
              width: 6.6rem;
              min-height: 4rem;
              padding: 0.55rem 0.58rem;
            }

            .services-system-canvas-kicker {
              font-size: 0.4rem;
              letter-spacing: 0.16em;
            }

            .services-system-canvas-line {
              width: 2.6rem;
            }

            .services-system-canvas-line.short {
              width: 1.8rem;
            }

            .services-system-copy span {
              font-size: 0.43rem;
              letter-spacing: 0.16em;
            }

            .services-system-card {
              width: 8.25rem;
              min-height: 4.65rem;
              gap: 0.45rem;
              border-radius: 0.85rem;
              padding: 0.52rem;
            }

            .services-system-card-seo,
            .services-system-card-development {
              left: 0;
            }

            .services-system-card-hosting,
            .services-system-card-design {
              right: 0;
            }

            .services-system-icon {
              width: 1.55rem;
              height: 1.55rem;
            }

            .services-system-icon svg {
              width: 0.82rem;
              height: 0.82rem;
            }

            .services-system-copy strong {
              font-size: 0.68rem;
            }

            .services-system-copy p {
              font-size: 0.52rem;
              line-height: 1.22;
            }

            .services-system-line-seo,
            .services-system-line-development {
              left: 30%;
              width: 21%;
            }

            .services-system-line-hosting,
            .services-system-line-design {
              right: 30%;
              width: 17%;
            }

            .services-system-flow-seo,
            .services-system-flow-development {
              left: 31%;
              width: 20%;
            }

            .services-system-flow-hosting,
            .services-system-flow-design {
              right: 31%;
              width: 16%;
            }
          }

          @media (min-width: 640px) and (max-width: 767px) {
            .services-system {
              min-height: 18rem;
            }

            .services-system-card {
              width: 10.3rem;
              min-height: 4.95rem;
            }

          }

          .chat-showcase-messages {
            overflow: visible;
            min-height: 0;
          }

          .chat-line {
            display: flex;
            align-items: flex-end;
            gap: 0.45rem;
            width: 100%;
          }

          .chat-line-in {
            opacity: 1;
            transform: translateY(0);
          }

          .chat-line-out {
            justify-content: flex-end;
          }

          .chat-line-outgoing {
            opacity: 1;
            transform: translateY(0);
            margin-bottom: 0;
          }

          .chat-avatar {
            display: flex;
            width: 1.45rem;
            height: 1.45rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            border: 1px solid rgba(245, 239, 228, 0.22);
            background: linear-gradient(160deg, rgba(245, 239, 228, 0.16), rgba(245, 239, 228, 0.04));
            box-shadow: inset 0 1px 0 rgba(245, 239, 228, 0.24), 0 6px 12px rgba(0, 0, 0, 0.22);
            font-size: 0.54rem;
            font-weight: 700;
            color: #f5efe4;
          }

          .chat-avatar-self {
            border-color: rgba(143, 165, 138, 0.42);
            background: linear-gradient(155deg, rgba(143, 165, 138, 0.34), rgba(94, 122, 89, 0.2));
            color: #8fa58a;
          }

          .chat-bubble {
            display: flex;
            width: min(calc(100% - 1.55rem), 13.6rem);
            flex-direction: column;
            gap: 0.34rem;
            border-radius: 0.72rem;
            border: 1px solid rgba(255, 255, 255, 0.14);
            padding: 0.62rem 0.72rem;
            min-height: 4.45rem;
            max-height: 4.45rem;
            box-shadow: inset 0 1px 0 rgba(245, 239, 228, 0.1);
            position: relative;
          }

          .chat-bubble-in {
            background: linear-gradient(165deg, rgba(127, 167, 200, 0.24), rgba(31, 46, 67, 0.36));
            border-color: rgba(127, 167, 200, 0.36);
            box-shadow: inset 0 1px 0 rgba(127, 167, 200, 0.22), 0 8px 16px rgba(0, 0, 0, 0.2);
          }

          .chat-bubble-out {
            border-color: rgba(143, 165, 138, 0.34);
            background: linear-gradient(165deg, rgba(143, 165, 138, 0.2), rgba(34, 49, 37, 0.34));
            box-shadow: inset 0 1px 0 rgba(143, 165, 138, 0.2), 0 8px 16px rgba(0, 0, 0, 0.18);
          }

          .chat-meta {
            font-size: 0.56rem;
            letter-spacing: 0.02em;
            color: #b0aea5;
          }

          .chat-line-in .chat-meta {
            color: #7fa7c8;
          }

          .chat-line-out .chat-meta {
            color: #8fa58a;
          }

          .chat-typed {
            display: block;
            font-size: 0.71rem;
            line-height: 1.3;
            min-height: 1.42em;
            color: #f5efe4;
            overflow: hidden;
            white-space: normal;
            width: 100%;
            max-width: 100%;
          }

          .chat-typed-out {
            display: block;
          }

          .chat-line-outgoing {
            opacity: 1;
            transform: translateY(0);
          }

          .card:hover .attention-chat-card .chat-line-in,
          .card:active .attention-chat-card .chat-line-in {
            opacity: 0;
            transform: translateY(6px);
            animation: chat-message-enter 4.2s linear forwards;
          }

          .card:hover .attention-chat-card .chat-line-outgoing,
          .card:active .attention-chat-card .chat-line-outgoing {
            opacity: 0;
            transform: translateY(6px);
            animation: chat-reply-enter 4.2s linear forwards;
          }

          @keyframes chat-message-enter {
            0%, 4% { opacity: 0; transform: translateY(6px); }
            8%, 100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes chat-reply-enter {
            0%, 62% { opacity: 0; transform: translateY(6px); }
            68%, 100% { opacity: 1; transform: translateY(0); }
          }

          .chat-input-bar {
            background: rgba(255, 255, 255, 0.03);
          }

          .chat-input-text {
            letter-spacing: 0.03em;
          }

          @keyframes board-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }

          .services-board {
            transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
            animation: board-float 6s ease-in-out infinite;
          }

          .group\/deliverables:hover .services-board {
            transform: translate3d(0, -6px, 0);
            animation-play-state: paused;
          }

          @keyframes service-pulse {
            0%, 100% {
              border-color: rgba(245, 239, 228, 0.1);
              background-color: rgba(255, 255, 255, 0.035);
            }
            10%, 20% {
              border-color: rgba(218, 197, 167, 0.4);
              background-color: rgba(218, 197, 167, 0.08);
              box-shadow: inset 0 0 12px rgba(218, 197, 167, 0.1);
            }
          }

          @keyframes service-pulse-featured {
            0%, 100% {
              border-color: rgba(218, 197, 167, 0.24);
              background: linear-gradient(145deg, rgba(218, 197, 167, 0.16), rgba(255, 255, 255, 0.035));
            }
            10%, 20% {
              border-color: rgba(218, 197, 167, 0.6);
              background: linear-gradient(145deg, rgba(218, 197, 167, 0.25), rgba(255, 255, 255, 0.08));
              box-shadow: inset 0 0 16px rgba(218, 197, 167, 0.15);
            }
          }

          .service-tile {
            position: relative;
            flex: 1 1 calc(50% - 0.25rem);
            min-height: 3rem;
            overflow: hidden;
            border-radius: 0.85rem;
            border: 1px solid rgba(245, 239, 228, 0.1);
            background: rgba(255, 255, 255, 0.035);
            padding: 0.56rem 0.65rem;
            transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, background-color 300ms ease;
            animation: service-pulse 10s infinite;
          }

          .service-tile.featured {
            flex-basis: 100%;
            min-height: 3rem;
            background: linear-gradient(145deg, rgba(218, 197, 167, 0.16), rgba(255, 255, 255, 0.035));
            border-color: rgba(218, 197, 167, 0.24);
            animation: service-pulse-featured 10s infinite;
          }

          .service-tile:nth-child(1) { animation-delay: 0s; }
          .service-tile:nth-child(2) { animation-delay: 2s; }
          .service-tile:nth-child(3) { animation-delay: 4s; }
          .service-tile:nth-child(4) { animation-delay: 6s; }
          .service-tile:nth-child(5) { animation-delay: 8s; }

          .service-index {
            display: block;
            margin-bottom: 0.28rem;
            font-size: 0.58rem;
            font-weight: 700;
            letter-spacing: 0.16em;
            color: rgba(218, 197, 167, 0.68);
          }

          .service-name {
            display: block;
            font-size: 0.88rem;
            font-weight: 700;
            line-height: 1.1;
            color: rgba(245, 239, 228, 0.92);
          }

          .group\/deliverables:hover .service-tile {
            animation-play-state: paused;
            border-color: rgba(218, 197, 167, 0.22);
            background-color: rgba(255, 255, 255, 0.055);
          }

          .group\/deliverables:hover .service-tile.featured {
            border-color: rgba(218, 197, 167, 0.35);
            background: linear-gradient(145deg, rgba(218, 197, 167, 0.2), rgba(255, 255, 255, 0.05));
          }

          .group\/deliverables:hover .service-tile:nth-child(2),
          .group\/deliverables:hover .service-tile:nth-child(4) {
            transform: translateX(0.35rem);
          }

          .group\/deliverables:hover .service-tile:nth-child(3),
          .group\/deliverables:hover .service-tile:nth-child(5) {
            transform: translateX(-0.35rem);
          }

          .selling-site-ambient {
            background: linear-gradient(125deg, transparent 18%, rgba(245, 239, 228, 0.048) 46%, transparent 78%);
          }

          .bento-dot-grid {
            z-index: 0;
            background-image: radial-gradient(circle, rgba(245, 239, 228, 0.14) 1px, transparent 1px);
            background-size: 18px 18px;
            opacity: 0.16;
            -webkit-mask-image: radial-gradient(circle at 50% 50%, black 0 50%, transparent 80%);
            mask-image: radial-gradient(circle at 50% 50%, black 0 50%, transparent 80%);
            pointer-events: none;
          }

          .selling-site-grid {
            z-index: 0;
            background-image: radial-gradient(circle, rgba(245, 239, 228, 0.14) 1px, transparent 1px);
            background-size: 18px 18px;
            opacity: 0.16;
            -webkit-mask-image: radial-gradient(circle at 70% 50%, black 0 44%, transparent 76%);
            mask-image: radial-gradient(circle at 70% 50%, black 0 44%, transparent 76%);
            transition: opacity 760ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-site-panels {
            z-index: 0;
            background:
              linear-gradient(90deg, rgba(245, 239, 228, 0.055) 1px, transparent 1px),
              linear-gradient(180deg, rgba(245, 239, 228, 0.04) 1px, transparent 1px);
            background-size: 7.2rem 4.7rem;
            opacity: 0.12;
            -webkit-mask-image: radial-gradient(circle at 72% 54%, black 0 52%, transparent 78%);
            mask-image: radial-gradient(circle at 72% 54%, black 0 52%, transparent 78%);
            transition: opacity 760ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-soundwaves {
            z-index: 1;
            pointer-events: none;
            opacity: 0.36;
            -webkit-mask-image: radial-gradient(circle at 73% 52%, black 0 52%, transparent 78%);
            mask-image: radial-gradient(circle at 73% 52%, black 0 52%, transparent 78%);
          }

          .selling-soundwaves span {
            position: absolute;
            left: 62%;
            top: 40%;
            width: 9rem;
            height: 9rem;
            border-radius: 999px;
            border: 1px solid rgba(245, 239, 228, 0.08);
            transform: translate(-50%, -50%) scale(0.72);
            opacity: 0;
          }

          .selling-soundwaves span:nth-child(2) {
            width: 13rem;
            height: 13rem;
          }

          .selling-soundwaves span:nth-child(3) {
            width: 17rem;
            height: 17rem;
          }

          .selling-mobile-frost {
            display: none;
            z-index: 15;
            pointer-events: none;
          }

          .bento-mobile-frost {
            display: none;
            z-index: 25;
            pointer-events: none;
          }

          .attention-mobile-frost {
            display: none;
            z-index: 10;
            pointer-events: none;
          }

          @media (max-width: 750px) {
            .selling-mobile-frost,
            .bento-mobile-frost,
            .attention-mobile-frost {
              display: block;
              opacity: 1 !important;
              background: rgba(8, 8, 8, 0.1);
              backdrop-filter: blur(2px);
              -webkit-backdrop-filter: blur(2px);
            }
          }

          .selling-browser {
            position: relative;
            border-radius: 18px;
            border: 1px solid rgba(218, 197, 167, 0.22);
            background: linear-gradient(180deg, rgba(22, 22, 20, 0.92), rgba(8, 8, 8, 0.9));
            box-shadow: 0 18px 42px rgba(0, 0, 0, 0.38), 0 0 28px rgba(218, 197, 167, 0.06), inset 0 1px 0 rgba(245, 239, 228, 0.12);
            overflow: hidden;
            min-height: 21.5rem;
            transition: transform 820ms cubic-bezier(0.22, 1, 0.36, 1), border-color 820ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 820ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-browser-shell {
            transform: translate3d(0, 0, 0);
            transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
            will-change: transform;
          }

          .card:hover .selling-browser-shell {
            transform: translate3d(0, -48px, 0);
          }

          .selling-browser-sheen {
            position: absolute;
            inset: 0;
            z-index: 3;
            pointer-events: none;
            opacity: 0;
            background: linear-gradient(112deg, transparent 18%, rgba(245, 239, 228, 0.12) 43%, transparent 68%);
            transform: translateX(-28%);
            transition: opacity 820ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-browser-top {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.55rem 0.7rem;
            border-bottom: 1px solid rgba(245, 239, 228, 0.12);
            background: rgba(245, 239, 228, 0.04);
          }

          .selling-dots {
            display: inline-flex;
            gap: 0.3rem;
          }

          .selling-dots span {
            width: 0.42rem;
            height: 0.42rem;
            border-radius: 9999px;
            background: rgba(245, 239, 228, 0.45);
          }

          .selling-url {
            height: 0.5rem;
            width: min(65%, 11rem);
            border-radius: 9999px;
            background: rgba(245, 239, 228, 0.16);
          }

          .selling-nav-pills {
            display: flex;
            gap: 0.42rem;
            margin-left: auto;
          }

          .selling-nav-pills span {
            width: 1.25rem;
            height: 0.34rem;
            border-radius: 9999px;
            background: rgba(245, 239, 228, 0.12);
          }

          .selling-browser-body {
            position: relative;
            display: grid;
            grid-template-columns: 1.08fr 0.78fr;
            column-gap: 1rem;
            padding: 1rem;
            background:
              radial-gradient(circle at 82% 18%, rgba(127, 167, 200, 0.12), transparent 34%),
              radial-gradient(circle at 18% 38%, rgba(218, 197, 167, 0.09), transparent 38%),
              linear-gradient(180deg, rgba(245, 239, 228, 0.02), transparent 40%);
            min-height: 19.8rem;
          }

          .selling-hero-copy {
            position: relative;
            z-index: 2;
            padding-top: 0.15rem;
          }

          .selling-page-kicker {
            width: 4.2rem;
            height: 0.42rem;
            margin-bottom: 0.72rem;
            border-radius: 9999px;
            background: rgba(218, 197, 167, 0.36);
          }

          .selling-hero-line {
            height: 0.6rem;
            border-radius: 9999px;
            background: rgba(245, 239, 228, 0.75);
            margin-bottom: 0.45rem;
            transform-origin: left center;
            transition: transform 820ms cubic-bezier(0.22, 1, 0.36, 1), opacity 820ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-line-lg {
            width: 84%;
          }

          .selling-line-md {
            width: 66%;
            opacity: 0.74;
          }

          .selling-copy-lines {
            display: grid;
            gap: 0.34rem;
            margin: 0.85rem 0 1rem;
          }

          .selling-copy-lines span {
            display: block;
            height: 0.34rem;
            border-radius: 9999px;
            background: rgba(176, 174, 165, 0.24);
            transform-origin: left center;
            transition: transform 820ms cubic-bezier(0.22, 1, 0.36, 1), background-color 820ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-copy-lines span:nth-child(1) {
            width: 82%;
          }

          .selling-copy-lines span:nth-child(2) {
            width: 72%;
          }

          .selling-copy-lines span:nth-child(3) {
            width: 58%;
          }

          .selling-cta {
            width: 46%;
            height: 0.72rem;
            border-radius: 9999px;
            margin-bottom: 0.9rem;
            background: linear-gradient(90deg, rgba(194, 167, 123, 0.95), rgba(218, 197, 167, 0.95));
            box-shadow: 0 0 16px rgba(218, 197, 167, 0.12);
            transition: transform 760ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 760ms cubic-bezier(0.22, 1, 0.36, 1), filter 760ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-hero-visual {
            position: relative;
            z-index: 1;
            min-height: 7.25rem;
            border-radius: 14px;
            border: 1px solid rgba(218, 197, 167, 0.18);
            background:
              radial-gradient(circle at 76% 18%, rgba(218, 197, 167, 0.13), transparent 34%),
              linear-gradient(145deg, rgba(245, 239, 228, 0.075), rgba(8, 8, 8, 0.12));
            box-shadow: inset 0 1px 0 rgba(245, 239, 228, 0.08);
            overflow: hidden;
            transition: border-color 820ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 820ms cubic-bezier(0.22, 1, 0.36, 1), transform 820ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-preview-window {
            position: absolute;
            inset: 0.8rem 0.8rem 2.55rem;
            border-radius: 12px;
            border: 1px solid rgba(245, 239, 228, 0.12);
            background:
              radial-gradient(circle at 72% 18%, rgba(218, 197, 167, 0.18), transparent 32%),
              linear-gradient(155deg, rgba(245, 239, 228, 0.075), rgba(245, 239, 228, 0.025));
            box-shadow: inset 0 1px 0 rgba(245, 239, 228, 0.09);
            transition: transform 820ms cubic-bezier(0.22, 1, 0.36, 1), border-color 820ms cubic-bezier(0.22, 1, 0.36, 1), background-color 820ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-preview-badge,
          .selling-preview-heading,
          .selling-preview-copy {
            position: absolute;
            border-radius: 999px;
            display: block;
          }

          .selling-preview-badge {
            left: 0.8rem;
            top: 0.78rem;
            width: 2.6rem;
            height: 0.42rem;
            background: rgba(218, 197, 167, 0.36);
          }

          .selling-preview-heading {
            left: 0.8rem;
            right: 2.2rem;
            top: 1.68rem;
            height: 0.58rem;
            background: rgba(245, 239, 228, 0.58);
          }

          .selling-preview-copy {
            left: 0.8rem;
            top: 2.56rem;
            width: 58%;
            height: 0.34rem;
            background: rgba(176, 174, 165, 0.3);
          }

          .selling-preview-strip {
            position: absolute;
            left: 0.8rem;
            right: 0.8rem;
            bottom: 0.75rem;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.38rem;
          }

          .selling-preview-strip span {
            height: 1.15rem;
            border-radius: 8px;
            border: 1px solid rgba(245, 239, 228, 0.1);
            background: rgba(245, 239, 228, 0.045);
            box-shadow: inset 0 1px 0 rgba(245, 239, 228, 0.06);
            transition: transform 820ms cubic-bezier(0.22, 1, 0.36, 1), border-color 820ms cubic-bezier(0.22, 1, 0.36, 1), background-color 820ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-cards-row {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.5rem;
            margin-top: 0.95rem;
          }

          .selling-card {
            border: 1px solid rgba(245, 239, 228, 0.14);
            border-radius: 10px;
            background: rgba(245, 239, 228, 0.04);
            padding: 0.45rem;
            min-height: 2.85rem;
            transition: border-color 760ms cubic-bezier(0.22, 1, 0.36, 1), background-color 760ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 760ms cubic-bezier(0.22, 1, 0.36, 1), transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .selling-stat-bar {
            display: block;
            height: 0.34rem;
            width: 100%;
            border-radius: 9999px;
            background: rgba(127, 167, 200, 0.7);
            transform-origin: left;
            animation: selling-bars-pulse 2.3s ease-in-out infinite;
          }

          .selling-stat-bar.short {
            width: 64%;
            margin-top: 0.35rem;
            animation-delay: 0.25s;
            background: rgba(245, 239, 228, 0.52);
          }

          .selling-card:nth-child(2) .selling-stat-bar {
            animation-delay: 0.15s;
          }

          .selling-card:nth-child(3) .selling-stat-bar {
            animation-delay: 0.3s;
          }

          .card:hover .group\/selling .bento-mobile-readable {
            transform: none;
          }

          .card:hover .group\/selling .selling-site-grid,
          .card:hover .group\/selling .selling-site-panels {
            opacity: 0.26;
          }

          .card:hover .group\/selling .selling-soundwaves span {
            animation: selling-wave-pulse 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          }

          .card:hover .group\/selling .selling-soundwaves span:nth-child(2) {
            animation-delay: 160ms;
          }

          .card:hover .group\/selling .selling-soundwaves span:nth-child(3) {
            animation-delay: 320ms;
          }

          .card:hover .group\/selling .selling-browser {
            border-color: rgba(218, 197, 167, 0.34);
            box-shadow: 0 22px 48px rgba(0, 0, 0, 0.4), 0 0 34px rgba(218, 197, 167, 0.1), inset 0 1px 0 rgba(245, 239, 228, 0.14);
          }

          .card:hover .group\/selling .selling-line-lg,
          .group\/selling:hover .selling-line-lg {
            transform: scaleX(1.06);
          }

          .card:hover .group\/selling .selling-line-md,
          .group\/selling:hover .selling-line-md {
            transform: scaleX(1.1);
          }

          .card:hover .group\/selling .selling-copy-lines span,
          .group\/selling:hover .selling-copy-lines span {
            background-color: rgba(176, 174, 165, 0.32);
            transform: scaleX(1.05);
          }

          .card:hover .group\/selling .selling-hero-visual,
          .group\/selling:hover .selling-hero-visual {
            transform: translateY(-2px);
            border-color: rgba(218, 197, 167, 0.28);
            box-shadow: inset 0 1px 0 rgba(245, 239, 228, 0.1), 0 0 22px rgba(218, 197, 167, 0.06);
          }

          .card:hover .group\/selling .selling-preview-window,
          .group\/selling:hover .selling-preview-window {
            transform: translateY(-3px);
            border-color: rgba(218, 197, 167, 0.22);
          }

          .card:hover .group\/selling .selling-preview-strip span,
          .group\/selling:hover .selling-preview-strip span {
            transform: translateY(-2px);
            border-color: rgba(218, 197, 167, 0.16);
            background-color: rgba(245, 239, 228, 0.065);
          }

          .card:hover .group\/selling .selling-preview-strip span:nth-child(2),
          .group\/selling:hover .selling-preview-strip span:nth-child(2) {
            transition-delay: 80ms;
          }

          .card:hover .group\/selling .selling-preview-strip span:nth-child(3),
          .group\/selling:hover .selling-preview-strip span:nth-child(3) {
            transition-delay: 160ms;
          }

          .card:hover .group\/selling .selling-browser-sheen {
            opacity: 0.68;
            transform: translateX(24%);
          }

          .card:hover .group\/selling .selling-cta {
            transform: translateY(-1px) scale(1.04);
            filter: brightness(1.08);
            box-shadow: 0 0 20px rgba(218, 197, 167, 0.2);
          }

          .card:hover .group\/selling .selling-card:nth-child(2) {
            transform: translateY(-2px);
            border-color: rgba(127, 167, 200, 0.3);
            background-color: rgba(127, 167, 200, 0.07);
            box-shadow: 0 0 18px rgba(127, 167, 200, 0.08);
          }

          @keyframes selling-wave-pulse {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.72); }
            38% { opacity: 0.72; }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1.08); }
          }

          @keyframes contact-radial-pulse {
            0% {
              transform: translate(-50%, -50%) scale(0.96);
              opacity: 0.18;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.07);
              opacity: 0.48;
            }
            100% {
              transform: translate(-50%, -50%) scale(0.96);
              opacity: 0.18;
            }
          }

          .conversion-card-bg {
            background:
              linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent 48%);
          }

          .conversion-card-dots {
            display: none;
          }

          .conversion-card-lines {
            display: none;
          }

          .conversion-card-glow {
            display: none;
          }

          .conversion-phone-wrap {
            transform: translate3d(0, 0, 0);
          }

          .conversion-flow-copy {
            max-width: 13.25rem;
          }

          .conversion-flow-copy .bento-card-caption {
            max-width: 12.5rem;
          }

          .conversion-phone-svg {
            width: min(100%, 20rem);
            height: auto;
            overflow: visible;
            filter: none;
          }

          .conversion-phone-svg svg {
            display: block;
            width: 100%;
            height: auto;
            overflow: visible;
          }

          .first-impression-svg {
            width: min(94%, 30rem);
            transform: translateY(1.1rem);
            pointer-events: auto;
          }

          .first-impression-svg svg {
            display: block;
            width: 100%;
            height: auto;
            overflow: visible;
            pointer-events: auto;
          }

          .conversion-flow-svg {
            width: min(88%, 18rem);
            transform: translateY(2.6rem);
            transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1), filter 800ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .card:hover .group\/conversion .conversion-flow-svg {
            transform: translateY(2.2rem) scale(1.025);
            filter: none;
          }

          .conversion-wire,
          .conversion-floor {
            fill: none;
            stroke: rgba(245, 239, 228, 0.08);
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 1.1;
            vector-effect: non-scaling-stroke;
            transition: stroke 760ms cubic-bezier(0.22, 1, 0.36, 1), opacity 760ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .conversion-floor {
            stroke: rgba(245, 239, 228, 0.22);
          }

          .conversion-phone {
            transform-box: fill-box;
            transform-origin: center;
            transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .conversion-panel,
          .conversion-hero,
          .conversion-cta {
            transform-box: fill-box;
            transform-origin: center;
            transition: filter 760ms cubic-bezier(0.22, 1, 0.36, 1), opacity 760ms cubic-bezier(0.22, 1, 0.36, 1), transform 760ms cubic-bezier(0.22, 1, 0.36, 1), stroke 760ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .conversion-cta {
            filter: drop-shadow(0 0 8px rgba(245, 239, 228, 0.1));
          }

          .conversion-click-ring {
            fill: none;
            stroke: rgba(218, 197, 167, 0.78);
            stroke-linecap: round;
            stroke-width: 1.8;
            stroke-dasharray: 22 90;
            opacity: 0;
            filter: drop-shadow(0 0 6px rgba(218, 197, 167, 0.18));
          }

          .conversion-cursor {
            transform-box: fill-box;
            transform-origin: center;
            filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.36));
            transition: transform 760ms cubic-bezier(0.22, 1, 0.36, 1), filter 760ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .conversion-card-button {
            border-color: rgba(167, 154, 199, 0.42) !important;
            box-shadow: 0 0 22px rgba(167, 154, 199, 0.12), inset 0 1px 0 rgba(245, 239, 228, 0.08);
          }

          .card:hover .group\/conversion .conversion-card-dots {
            opacity: 0;
          }

          .card:hover .group\/conversion .conversion-card-glow {
            opacity: 0;
            transform: none;
          }

          .card:hover .group\/conversion .conversion-wire,
          .card:hover .group\/conversion .conversion-floor {
            stroke: rgba(218, 197, 167, 0.22);
          }

          .card:hover .group\/conversion .conversion-phone {
            transform: translateY(-4px);
          }

          .card:hover .group\/conversion .conversion-panel-a {
            transform: translateY(-2px);
          }

          .card:hover .group\/conversion .conversion-panel-b {
            transform: translateY(-3px);
            transition-delay: 70ms;
          }

          .card:hover .group\/conversion .conversion-hero {
            stroke: rgba(245, 239, 228, 0.32);
            filter: drop-shadow(0 0 10px rgba(245, 239, 228, 0.08));
            transform: translateY(-3px);
            transition-delay: 120ms;
          }

          .card:hover .group\/conversion .conversion-panel-c,
          .card:hover .group\/conversion .conversion-panel-d {
            transform: translateY(-2px);
            transition-delay: 180ms;
          }

          .card:hover .group\/conversion .conversion-cta {
            stroke: rgba(218, 197, 167, 0.68);
            filter: drop-shadow(0 0 12px rgba(218, 197, 167, 0.18));
            transform: translateY(-2px);
            transition-delay: 240ms;
          }

          .card:hover .group\/conversion .conversion-cursor {
            animation: conversion-cursor-click 1.7s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          }

          .card:hover .group\/conversion .conversion-click-ring {
            animation: conversion-click-ring 1.7s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          }

          @keyframes conversion-cursor-click {
            0%, 100% { transform: translate(0, 0) scale(1); }
            42% { transform: translate(-7px, -8px) scale(1); }
            52% { transform: translate(-7px, -8px) scale(0.92); }
            66% { transform: translate(-7px, -8px) scale(1); }
          }

          @keyframes conversion-click-ring {
            0% { opacity: 0; stroke-dashoffset: 68; }
            42% { opacity: 0; stroke-dashoffset: 68; }
            56% { opacity: 0.9; }
            100% { opacity: 0; stroke-dashoffset: -18; }
          }

          .contact-card-bg {
            background:
              radial-gradient(circle at 24% 20%, rgba(245, 239, 228, 0.07), transparent 42%),
              radial-gradient(circle at 78% 72%, rgba(127, 167, 200, 0.07), transparent 46%),
              linear-gradient(145deg, rgba(12, 12, 11, 0.6), rgba(6, 6, 6, 0.82));
            filter: saturate(1.08);
          }

          .contact-card-overlay {
            z-index: 10;
            background: rgba(8, 8, 8, 0.08);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            pointer-events: none;
          }


          .contact-card-icon-wrap {
            isolation: isolate;
          }

          .contact-card-pulse {
            position: absolute;
            left: 50%;
            top: 50%;
            border-radius: 9999px;
            border: 1px solid color-mix(in srgb, var(--bento-accent, #a79ac7) 30%, transparent);
            background: radial-gradient(circle, color-mix(in srgb, var(--bento-accent, #a79ac7) 12%, transparent) 0%, transparent 64%);
            box-shadow:
              inset 0 0 18px color-mix(in srgb, var(--bento-accent, #a79ac7) 12%, transparent),
              0 0 18px color-mix(in srgb, var(--bento-accent, #a79ac7) 10%, transparent);
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: contact-radial-pulse 3.2s ease-in-out infinite;
            z-index: 0;
          }

          .contact-card-pulse-a {
            width: 5.4rem;
            height: 5.4rem;
            opacity: 0.44;
          }

          .contact-card-pulse-b {
            width: 7.1rem;
            height: 7.1rem;
            animation-delay: 0.5s;
            opacity: 0.2;
          }

          .contact-card-icon {
            position: relative;
            z-index: 2;
            box-shadow:
              0 0 0 1px color-mix(in srgb, var(--bento-accent, #a79ac7) 40%, transparent),
              0 0 20px color-mix(in srgb, var(--bento-accent, #a79ac7) 42%, transparent),
              0 0 42px color-mix(in srgb, var(--bento-accent, #a79ac7) 22%, transparent);
          }

          .contact-card-button {
            border-color: color-mix(in srgb, var(--bento-accent, #a79ac7) 48%, transparent) !important;
            box-shadow: 0 0 22px color-mix(in srgb, var(--bento-accent, #a79ac7) 12%, transparent);
          }

          .card-responsive {
            grid-template-columns: 1fr;
            width: 100%;
            margin: 0 auto;
            padding: 0.5rem;
            position: relative;
          }

          .card-responsive .card {
            z-index: 1;
          }

          .bento-card-surface {
            background: rgba(5, 5, 5, 0.045) !important;
            border: 1px solid rgba(255, 255, 255, 0.06);
            box-shadow: none;
            backdrop-filter: blur(4px) saturate(130%);
            -webkit-backdrop-filter: blur(4px) saturate(130%);
          }

          .bento-card-surface::after {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            opacity: 0;
            background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--bento-accent, #dac5a7) 18%, transparent), transparent 54%);
            transition: opacity 300ms ease;
          }

          .bento-card-kicker {
            margin-bottom: 0.38rem;
            font-size: 0.68rem;
            font-weight: 600;
            letter-spacing: 0.22em;
            line-height: 1.25;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.45);
          }

          .bento-card-heading {
            margin-bottom: 0.42rem;
            font-size: clamp(1.14rem, 0.92rem + 0.5vw, 1.32rem);
            font-weight: 700;
            line-height: 1.12;
            letter-spacing: -0.02em;
          }

          .bento-feature-copy .bento-card-heading {
            margin-bottom: 0.62rem;
            font-size: clamp(1.28rem, 1rem + 0.7vw, 1.52rem);
          }

          .bento-card-caption {
            max-width: 14.75rem;
            font-size: 0.75rem;
            font-weight: 450;
            line-height: 1.38;
            color: rgba(255, 255, 255, 0.54);
          }

          .bento-feature-copy .bento-card-caption {
            max-width: 16.75rem;
          }

          .remote-card-copy,
          .bento-mobile-readable,
          .contact-card-content {
            max-width: 16rem;
          }

          .conversion-phone-wrap,
          .remote-card-globe-shell,
          .selling-browser-shell,
          .chat-showcase-messages {
            --bento-visual-scale: 0.92;
          }

          .remote-card-globe,
          .remote-card-globe canvas {
            cursor: pointer !important;
          }

          .remote-card-globe canvas:active {
            cursor: grabbing !important;
          }

          .card .bento-mobile-readable,
          .card .remote-card-copy,
          .card .contact-card-content,
          .card .card__header,
          .card .card__content {
            transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .card:hover .bento-mobile-readable,
          .card:hover .remote-card-copy,
          .card:hover .contact-card-content,
          .card:hover .card__header,
          .card:hover .card__content {
            transform: translateY(-0.35rem);
          }

          .card:hover .bento-card-surface::after {
            opacity: 1;
          }

          .card-responsive .card:nth-child(1):hover .bento-card-surface::after {
            opacity: 0.45;
          }

          .bento-card-surface .contact-card-bg,
          .bento-card-surface .deliverables-card-bg,
          .bento-card-surface .selling-site-bg,
          .bento-card-surface .attention-card-bg {
            opacity: 0 !important;
          }

          .bento-card-surface .contact-card-grid,
          .bento-card-surface .deliverables-card-grid,
          .bento-card-surface .selling-site-ambient {
            opacity: 0.12 !important;
          }

          .bento-card-surface [class*="bg-[radial-gradient"],
          .bento-card-surface [class*="bg-[linear-gradient"] {
            opacity: 0.16 !important;
          }

          @media (min-width: 600px) and (max-width: 1023px) {
            .card-responsive {
              grid-template-columns: repeat(6, 1fr);
              grid-template-rows: repeat(4, minmax(0, 1fr));
              gap: 0.65rem;
              height: 1040px;
              min-height: 1040px;
            }

            .card-responsive .card {
              min-height: 0;
              height: 100%;
            }

            .card-responsive .card:nth-child(5) {
              grid-column: 1 / 7;
              grid-row: 1 / 2;
            }

            .card-responsive .card:nth-child(1) {
              grid-column: 1 / 7;
              grid-row: 2 / 3;
            }

            .card-responsive .card:nth-child(2) {
              grid-column: 1 / 4;
              grid-row: 3 / 4;
            }

            .card-responsive .card:nth-child(4) {
              grid-column: 4 / 7;
              grid-row: 3 / 4;
            }

            .card-responsive .card:nth-child(3) {
              grid-column: 1 / 7;
              grid-row: 4 / 5;
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(12, 1fr);
              grid-template-rows: repeat(2, minmax(0, 1fr));
              gap: 0.65rem;
              height: 740px;
              min-height: 740px;
              max-width: 1400px;
              margin: 0 auto;
            }

            .card-responsive .card {
              min-height: 0;
              height: 100%;
            }

            .card-responsive .card:nth-child(5) {
              grid-column: 1 / 8;
              grid-row: 1 / 2;
            }

            .card-responsive .card:nth-child(1) {
              grid-column: 8 / 13;
              grid-row: 1 / 2;
            }

            .card-responsive .card:nth-child(2) {
              grid-column: 1 / 5;
              grid-row: 2 / 3;
            }

            .card-responsive .card:nth-child(4) {
              grid-column: 5 / 9;
              grid-row: 2 / 3;
            }

            .card-responsive .card:nth-child(3) {
              grid-column: 9 / 13;
              grid-row: 2 / 3;
            }

            .card-responsive .card:nth-child(1) .end-to-end-svg {
              transform: translate3d(-1%, 3%, 0) scale(0.96);
            }

            .card-responsive .card:nth-child(2) .chat-showcase-messages {
              margin-top: 1.35rem;
              padding-bottom: 0;
            }

            .card-responsive .card:nth-child(3) .conversion-phone-wrap {
              bottom: 0;
            }

            .card-responsive .card:nth-child(3) .conversion-phone-svg {
              width: min(88%, 18rem);
            }

            .card-responsive .card:nth-child(4) .remote-card-globe-shell {
              min-height: 12.5rem;
              height: 50%;
            }

            .card-responsive .card:nth-child(4) .remote-card-globe-position {
              bottom: -62%;
              height: 148%;
            }

            .card-responsive .card:nth-child(4) .remote-card-globe {
              opacity: 0.82;
              transform: translateY(1%) scale(0.94);
            }

            .card-responsive .card:nth-child(5) .selling-browser-shell {
              bottom: -28%;
              right: 2%;
              width: 58%;
              max-width: 30rem;
            }
          }

          @media (max-width: 767px) {
            .bento-card-surface .bento-mobile-frost,
            .bento-card-surface .selling-mobile-frost,
            .bento-card-surface .attention-mobile-frost {
              display: block;
              opacity: 1 !important;
              background: rgba(8, 8, 8, 0.1);
              backdrop-filter: blur(2px);
              -webkit-backdrop-filter: blur(2px);
            }

          }
          
          .card::before {
            content: '';
            position: absolute;
            inset: 2px;
            border-radius: 18px;
            background: transparent;
            border: 1px solid rgba(245, 239, 228, 0.09);
            pointer-events: none;
            z-index: 1;
          }

          .card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            pointer-events: none;
            z-index: 2;
          }

          @keyframes confettiFall {
            0% {
              transform: translateY(0px) rotate(0deg) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateY(400px) rotate(720deg) scale(0);
              opacity: 0;
            }
          }

          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
          
          .particle-container:hover {
            box-shadow: none;
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          @media (max-width: 599px) {
            .bento-section {
              padding-left: 0;
              padding-right: 0;
            }

            .card-responsive {
              grid-template-columns: 1fr;
              gap: 0.75rem;
              width: 100%;
              margin: 0 auto;
              padding: 0;
            }

            .card-responsive .card {
              width: 100%;
              min-height: 210px;
            }

            .card-responsive .card:nth-child(5) {
              order: 1;
              min-height: 220px;
            }

            .card-responsive .card:nth-child(1) {
              order: 2;
              min-height: 225px;
            }

            .card-responsive .card:nth-child(2) {
              order: 3;
              min-height: 225px;
            }

            .card-responsive .card:nth-child(4) {
              order: 4;
              min-height: 215px;
            }

            .card-responsive .card:nth-child(3) {
              order: 5;
              min-height: 205px;
            }

            .card-responsive .card:nth-child(3) .contact-card-content {
              width: 100%;
              padding: 1rem;
            }

            .card-responsive .card:nth-child(3) .contact-card-icon-wrap,
            .card-responsive .card:nth-child(3) .contact-card-title-wrap {
              margin-bottom: 0.9rem;
            }

            .card-responsive .card:nth-child(3) .contact-card-icon {
              width: 3rem;
              height: 3rem;
            }

            .card-responsive .card:nth-child(3) .contact-card-icon svg {
              width: 1.5rem;
              height: 1.5rem;
            }

            .card-responsive .card:nth-child(3) .contact-card-title {
              max-width: 12rem;
              font-size: 1.2rem;
              line-height: 1.2;
            }

            .card-responsive .card:nth-child(3) .contact-card-button {
              max-width: 100%;
              gap: 0.5rem;
              padding: 0.5rem 0.8rem;
              font-size: 0.78rem;
            }

            .card-responsive .card:nth-child(3) .contact-card-email {
              display: block;
              max-width: 10.25rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .card-responsive .card:nth-child(4) .remote-card-copy {
              padding: 1.1rem 1.1rem 0;
            }

            .card-responsive .card:nth-child(4) .remote-card-copy h2 {
              margin-bottom: 0.45rem;
              font-size: 1.2rem;
              line-height: 1.2;
            }

            .card-responsive .card:nth-child(4) .remote-card-copy p {
              margin-bottom: 0;
              font-size: 0.8rem;
              line-height: 1.3;
            }

            .card-responsive .card:nth-child(4) .remote-card-globe-shell {
              min-height: 9.5rem;
              height: 52%;
            }

            .card-responsive .card:nth-child(4) .remote-card-globe-position {
              bottom: -64%;
              height: 132%;
            }

            .card-responsive .card:nth-child(4) .remote-card-globe {
              opacity: 0.82;
              transform: translateY(6%) scale(0.8);
            }

            .card-responsive .card:nth-child(2) .bento-mobile-readable {
              padding-top: 1rem;
            }

            .card-responsive .card:nth-child(2) .chat-showcase-messages {
              margin-top: 0.85rem;
              padding-bottom: 0;
            }
          }

          @media (min-width: 1024px) {
            .remote-card-globe-position {
              bottom: -62%;
            }
          }
        `}
      </style>

      {enableSpotlight && !enableBorderGlow && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => {
            const baseClassName = `card group/bento relative ${index === 2 ? 'min-h-[170px]' : 'min-h-[180px]'} w-full max-w-full rounded-[20px]`;
            const cardInnerClassName = `bento-card-surface relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] font-light transition-all duration-300 ease-in-out ${index === 2 || index === 3 ? 'p-0' : 'p-8'}`;

            const cardStyle = {
              '--bento-accent': card.color,
              backdropFilter: "blur(4px) saturate(130%)",
              WebkitBackdropFilter: "blur(4px) saturate(130%)",
              background: 'transparent',
            } as React.CSSProperties;

            const content = card.customContent || (
              <>
                <div className="card__header flex justify-between gap-3 relative text-white">
                  <span className="card__label text-base">{card.label}</span>
                </div>
                <div className="card__content flex flex-col relative text-white">
                  <h3
                    className={`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? "text-clamp-1" : ""}`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`card__description text-xs leading-5 opacity-90 ${textAutoHide ? "text-clamp-2" : ""}`}
                  >
                    {card.description}
                  </p>
                </div>
              </>
            );

            const cardBody = enableStars ? (
              <ParticleCard
                className={cardInnerClassName}
                style={cardStyle}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                {content}
              </ParticleCard>
            ) : (
              <div
                className={`${cardInnerClassName} bg-transparent`}
                style={cardStyle}
                onMouseMove={(event) => {
                  if (shouldDisableAnimations || (!enableTilt && !enableMagnetism)) return;

                  const el = event.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = event.clientX - rect.left;
                  const y = event.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  if (enableTilt) {
                    gsap.to(el, {
                      rotateX: ((y - centerY) / centerY) * -10,
                      rotateY: ((x - centerX) / centerX) * 10,
                      duration: 0.04,
                      ease: "power2.out",
                      overwrite: "auto",
                      transformPerspective: 1000,
                    });
                  }

                  if (enableMagnetism) {
                    gsap.to(el, {
                      x: (x - centerX) * 0.05,
                      y: (y - centerY) * 0.05,
                      duration: 0.08,
                      ease: "power2.out",
                      overwrite: "auto",
                    });
                  }
                }}
                onMouseLeave={(event) => {
                  if (shouldDisableAnimations || (!enableTilt && !enableMagnetism)) return;

                  const el = event.currentTarget;

                  gsap.to(el, {
                    rotateX: 0,
                    rotateY: 0,
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }}
                onClick={(event) => {
                  if (!clickEffect || shouldDisableAnimations) return;

                  const el = event.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = event.clientX - rect.left;
                  const y = event.clientY - rect.top;

                  createRipple(el, x, y, glowColor);
                }}
              >
                {content}
              </div>
            );

            if (enableBorderGlow) {
              return (
                <div key={index} className={baseClassName}>
                  {cardBody}
                </div>
              );
            }

            return (
              <React.Fragment key={index}>
                {enableStars ? (
                  <ParticleCard
                    className={`${baseClassName} ${cardInnerClassName} bg-transparent`}
                    style={cardStyle}
                    disableAnimations={shouldDisableAnimations}
                    particleCount={particleCount}
                    glowColor={glowColor}
                    enableTilt={enableTilt}
                    clickEffect={clickEffect}
                    enableMagnetism={enableMagnetism}
                  >
                    {content}
                  </ParticleCard>
                ) : (
                  cardBody
                )}
              </React.Fragment>
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;

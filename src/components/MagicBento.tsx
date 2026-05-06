'use client'

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Copy, Check, User, Layers, Search, Code, Cloud, FileText, Smile, Send, Globe as GlobeIcon } from "lucide-react";
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

type ChatPhase = "idle" | "shrinking" | "typing";

const SERVICE_ITEMS = [
  { name: "Web Design", title: "Design", icon: Layers, color: "#dac5a7", connector: "design", label: "Shape", description: "Clean interfaces that convert." },
  { name: "Web Development", title: "Development", icon: Code, color: "#8fa58a", connector: "development", label: "Build", description: "Scalable code built to last." },
  { name: "SEO", title: "SEO", icon: Search, color: "#7fa7c8", connector: "seo", label: "Rank", description: "Improve visibility and rank higher." },
  { name: "Hosting", title: "Hosting", icon: Cloud, color: "#a79ac7", connector: "hosting", label: "Launch", description: "Fast, secure, reliable hosting." },
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
const ServicesSystemMap = () => {
  const services = {
    seo: SERVICE_ITEMS[2],
    hosting: SERVICE_ITEMS[3],
    development: SERVICE_ITEMS[1],
    design: SERVICE_ITEMS[0],
  };

  return (
    <div className="services-system pointer-events-none relative h-full min-h-[19rem] w-full" aria-hidden="true">
      <div className="services-system-grid" />
      <div className="services-system-ambient" />
      <div className="services-system-canvas">
        <span className="services-system-canvas-kicker">System Ready</span>
        <span className="services-system-canvas-line" />
        <span className="services-system-canvas-line short" />
      </div>
      <div className="services-system-lines">
        <span className="services-system-line services-system-line-seo" />
        <span className="services-system-line services-system-line-hosting" />
        <span className="services-system-line services-system-line-development" />
        <span className="services-system-line services-system-line-design" />
        <span className="services-system-node services-system-node-seo" />
        <span className="services-system-node services-system-node-hosting" />
        <span className="services-system-node services-system-node-development" />
        <span className="services-system-node services-system-node-design" />
        <span className="services-system-flow services-system-flow-seo" />
        <span className="services-system-flow services-system-flow-development" />
        <span className="services-system-flow services-system-flow-hosting" />
        <span className="services-system-flow services-system-flow-design" />
      </div>

      {Object.entries(services).map(([position, item]) => {
        const Icon = item.icon;
        return (
          <div
            key={item.name}
            className={`services-system-card services-system-card-${position}`}
            style={{ '--service-color': item.color } as React.CSSProperties}
          >
            <div className="services-system-icon">
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <div className="services-system-copy">
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <div className="services-system-copy-micro">
                <span />
                <span />
              </div>
            </div>
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
  const chatFadeTimeoutRef = useRef<number | null>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const [isContactCopied, setIsContactCopied] = useState(false);
  const [chatTypingRun, setChatTypingRun] = useState(0);
  const [chatPhase, setChatPhase] = useState<ChatPhase>("idle");

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
      if (chatFadeTimeoutRef.current !== null) {
        window.clearTimeout(chatFadeTimeoutRef.current);
      }
    };
  }, []);

  const getRemoteWorkCard = () => ({
    color: BENTO_ACCENTS.blue,
    title: "🌍 Remote friendly",
    description: "Based in Finland, working with people wherever the project makes sense.",
    label: "Availability",
    customContent: (
        <div className="remote-card relative flex h-full flex-col overflow-hidden">
        <div className="remote-card-copy relative z-20 flex flex-col p-6 pb-3">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-white/45">Availability</p>
            <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
              Based in Finland,<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.blue }}>open globally</span>
            </h2>
          <p className="text-sm leading-6 text-white/70">
            Remote-friendly for website projects and frontend work
          </p>

        </div>

        <div className="remote-card-globe-shell relative z-10 mt-auto min-h-[220px] h-[52%] overflow-visible pointer-events-none">
          <div className="remote-card-globe-position absolute inset-x-0 bottom-[-65%] h-[180%] flex items-center justify-center pointer-events-auto">
            <Globe 
              className="remote-card-globe relative z-10 w-full max-w-[600px] scale-[1.15] overflow-hidden"
              dark={1}
              baseColor={[0.1, 0.1, 0.1]}
              glowColor={[1, 1, 1]}
              markerColor={[0.2, 0.5, 1.0]}
              arcColor={[0.2, 0.5, 1.0]}
              theta={0.1}
              mapSamples={isMobile ? 5000 : 12000}
              speed={isMobile ? 0.0015 : 0.003}
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
      color: BENTO_ACCENTS.champagne,
      title: "What services I offer",
      description: "UI/UX, SEO, branding, frontend, and launch support.",
      label: "Services",
      customContent: (
        <div className="group/engine service-engine-card relative -m-8 flex h-[calc(100%+4rem)] flex-col overflow-hidden">
          <div className="deliverables-card-bg absolute inset-0" />
          <div className="deliverables-card-grid absolute inset-0 opacity-40" />
          <div className="bento-mobile-frost absolute inset-0 z-[25]" />

          <div className="relative z-30 flex h-full flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-start md:gap-0">
            <div className="relative z-40 flex w-full flex-col md:w-[38%]">
              <div className="bento-mobile-readable">
                <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/45">Services</p>
                <h2 className="mb-2 text-2xl font-bold leading-tight text-white">
                  What services<br />
                  <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.champagne }}>I offer</span>
                </h2>
                <p className="max-w-[14rem] text-[13px] leading-[1.55] text-white/55">
                  Each service tailored to your project —<br className="hidden sm:block" /> pick what you need.
                </p>
              </div>
            </div>

            <div className="relative z-30 flex min-h-[17.5rem] w-full flex-1 items-center md:min-h-full md:w-[62%]">
              <ServicesSystemMap />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] shadow-[inset_0_0_60px_rgba(218,197,167,0.03)]" />
        </div>
      ),
    },
    {
      color: BENTO_ACCENTS.olive,
      title: "No chasing, no confusion.",
      description: "Short updates, quick replies, and clear next steps while the site comes together.",
      label: "Clear Communication",
      customContent: (
        <div
          className="group/attention relative -m-8 flex h-[calc(100%+4rem)] flex-col overflow-hidden p-8 pb-0"
          onMouseEnter={() => {
            if (chatFadeTimeoutRef.current !== null) {
              window.clearTimeout(chatFadeTimeoutRef.current);
            }
            setChatPhase("shrinking");
            chatFadeTimeoutRef.current = window.setTimeout(() => {
              setChatTypingRun((value) => value + 1);
              setChatPhase("typing");
              chatFadeTimeoutRef.current = null;
            }, 520);
          }}
          onMouseLeave={() => {
            if (chatFadeTimeoutRef.current !== null) {
              window.clearTimeout(chatFadeTimeoutRef.current);
              chatFadeTimeoutRef.current = null;
            }
            setChatPhase("idle");
          }}
        >
          <div className="attention-mobile-frost absolute inset-0 z-10" />

          {/* Card header — restored */}
          <div className="bento-mobile-readable relative z-20 mb-8 max-w-[17rem] sm:mb-10">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[color:var(--site-muted)] dark:text-white/50">Clear Communication</p>
            <h2 className="mb-3 text-2xl font-bold leading-tight text-[color:var(--site-text)] dark:text-white">
              Clear replies,<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.olive }}>less guessing.</span>
            </h2>
            <p className="max-w-xs text-sm leading-6 text-[color:var(--site-muted)] dark:text-white/70">
              You should not have to wonder what is done, what is next, or what I need from you.
            </p>
          </div>

          <div className="relative z-20 -mx-8 mt-auto flex flex-1 flex-col overflow-hidden border-t border-[color:var(--site-border)]/40 bg-[color:var(--site-bg)]/35 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
              <div className="flex shrink-0 items-start justify-between border-b border-white/10 px-5 py-3.5">
                <div>
                  <p className="text-[0.92rem] font-semibold leading-none text-[#f5efe4]">Communicate.</p>
                  <p className="mt-1 text-[0.66rem] leading-4 text-[#b0aea5]">Fast updates and clear next steps.</p>
                </div>
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-[#8fa58a]/35 bg-[#8fa58a]/20 text-[9px] font-bold text-[#8fa58a]">JS</div>
              </div>

              <div className="chat-showcase-messages flex flex-1 flex-col gap-6 px-5 py-4">
                <div className="chat-line chat-line-in">
                  <div className="chat-avatar">C</div>
                  <div className="chat-bubble chat-bubble-in">
                    <span className="chat-meta">Client • 7:26 PM</span>
                    {chatPhase === "typing" ? (
                      <TextType
                        key={`chat-1-${chatTypingRun}`}
                        as="span"
                        className="chat-typed"
                        text="Have there been login issues this morning?"
                        typingSpeed={34}
                        initialDelay={80}
                        loop={false}
                        pauseDuration={0}
                        showCursor={false}
                        variableSpeed={{ min: 28, max: 46 }}
                      />
                    ) : (
                      <span className={`chat-typed transition-opacity duration-500 ${chatPhase === "shrinking" ? "opacity-0" : "opacity-100"}`}>Have there been login issues this morning?</span>
                    )}
                  </div>
                </div>

                <div className="chat-line chat-line-out">
                  <div className="chat-bubble chat-bubble-out">
                    <span className="chat-meta">Jesper • 7:30 PM</span>
                    {chatPhase === "typing" ? (
                      <TextType
                        key={`chat-2-${chatTypingRun}`}
                        as="span"
                        className="chat-typed"
                        text="Fixed now, cache was stale after deploy."
                        typingSpeed={33}
                        initialDelay={1480}
                        loop={false}
                        pauseDuration={0}
                        showCursor={false}
                        variableSpeed={{ min: 28, max: 44 }}
                      />
                    ) : (
                      <span className={`chat-typed transition-opacity duration-500 ${chatPhase === "shrinking" ? "opacity-0" : "opacity-100"}`}>Fixed now, cache was stale after deploy.</span>
                    )}
                  </div>
                  <div className="chat-avatar chat-avatar-self">JS</div>
                </div>

                <div className="chat-line chat-line-in">
                  <div className="chat-avatar">C</div>
                  <div className="chat-bubble chat-bubble-in">
                    <span className="chat-meta">Client • 7:33 PM</span>
                    {chatPhase === "typing" ? (
                      <TextType
                        key={`chat-3-${chatTypingRun}`}
                        as="span"
                        className="chat-typed"
                        text="Great, thanks. Looks smooth now."
                        typingSpeed={32}
                        initialDelay={2980}
                        loop={false}
                        pauseDuration={0}
                        showCursor={false}
                        variableSpeed={{ min: 27, max: 42 }}
                      />
                    ) : (
                      <span className={`chat-typed transition-opacity duration-500 ${chatPhase === "shrinking" ? "opacity-0" : "opacity-100"}`}>Great, thanks. Looks smooth now.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="chat-input-bar mt-auto flex items-center gap-2.5 border-t border-white/10 px-5 py-3">
                <FileText className="h-3.5 w-3.5 text-[#87867f]" />
                <GlobeIcon className="h-3.5 w-3.5 text-[#87867f]" />
                <Smile className="h-3.5 w-3.5 text-[#87867f]" />
                <span className="chat-input-text text-[0.7rem] text-[#87867f]">Type a message</span>
                <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#8fa58a]/40 bg-[#8fa58a]/18 text-[#8fa58a]">
                  <Send className="ml-0.5 h-3.5 w-3.5" />
                </div>
              </div>
          </div>

        </div>
      ),
    },
    {
      color: BENTO_ACCENTS.lavender,
      title: "📩 Have a website in mind?",
      description: "Send the idea, goal, or messy first version and I can help shape it.",
      label: "Contact",
      customBackground: {
        background: `
          linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #000000 100%),
          radial-gradient(circle at 20% 30%, rgba(40, 40, 40, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(60, 60, 60, 0.2) 0%, transparent 50%),
          linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%)
        `,
        backgroundBlendMode: 'multiply, overlay, normal, normal, overlay'
      },
      customContent: (
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden">
          <div className="contact-card-bg absolute inset-0" />
          <div className="contact-card-overlay absolute inset-0" />

          <div className="contact-card-content bento-mobile-readable relative z-20 px-5 py-6 text-center">
            <div className="contact-card-icon-wrap relative mb-6 flex justify-center">
              <span className="contact-card-pulse contact-card-pulse-a" />
              <span className="contact-card-pulse contact-card-pulse-b" />
              <div className="contact-card-icon flex h-16 w-16 items-center justify-center rounded-full" style={{ background: BENTO_ACCENTS.lavender }}>
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="contact-card-title-wrap mb-5">
              <h2 className="contact-card-title mx-auto max-w-[15rem] text-2xl font-bold leading-tight text-[#f5efe4]">
                Have a site idea? <span className="block font-accent-strong" style={{ color: BENTO_ACCENTS.lavender }}>Send it over</span>
              </h2>
            </div>

            <p className="contact-card-description mx-auto mb-6 max-w-[15.5rem] text-sm leading-6 text-white/50">
              I&apos;d love to hear about your project and help turn it into something great.
            </p>
            
            <div className="flex justify-center">
              <button 
                className="contact-card-button btn-neutral-dark relative flex items-center gap-2 overflow-hidden rounded-lg !bg-transparent px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:!bg-white/10"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText('contact@jespersjostrom.se');

                    setIsContactCopied(true);
                    if (copyFeedbackTimeoutRef.current !== null) {
                      window.clearTimeout(copyFeedbackTimeoutRef.current);
                    }
                    copyFeedbackTimeoutRef.current = window.setTimeout(() => {
                      setIsContactCopied(false);
                      copyFeedbackTimeoutRef.current = null;
                    }, 1600);
                  } catch (err) {
                    console.error('Failed to copy: ', err);
                  }
                }}
                title="Click to copy: contact@jespersjostrom.se"
              >
                <span className="relative h-4 w-4">
                  <Copy className={`absolute left-0 top-0 h-4 w-4 transition-all duration-200 ${isContactCopied ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`} />
                  <Check className={`absolute left-0 top-0 h-4 w-4 text-emerald-300 transition-all duration-200 ${isContactCopied ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`} />
                </span>
                <span className="contact-card-email relative z-10">
                  {isContactCopied ? 'Copied to clipboard' : 'contact@jespersjostrom.se'}
                </span>
              </button>
            </div>
          </div>
        </div>
      ),
    },
    getRemoteWorkCard(),
    {
      color: BENTO_ACCENTS.champagne,
      title: "✨ Websites with a job to do",
      description: "Landing pages, portfolios, and business sites built to explain, impress, and convert.",
      label: "Services",
      customContent: (
        <div className="group/selling relative -m-8 flex h-[calc(100%+4rem)] flex-col overflow-hidden p-8">
          <div className="selling-site-bg absolute inset-0" />
          <div className="selling-site-ambient absolute inset-0" />
          <div className="selling-radial absolute bottom-[-16%] right-[-10%] z-0 h-[86%] w-[78%]" />
          <div className="selling-mobile-frost absolute inset-0" />

          <div className="bento-mobile-readable relative z-20 max-w-[18rem]">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-white/45">Website types</p>
            <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
              Websites that<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.champagne }}>look sharp</span> and<br />
              explain fast
            </h2>
            <p className="text-sm leading-6 text-white/72">
              Landing pages, portfolios, and business sites that make the next step obvious.
            </p>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-[-8%] z-10 w-[82%] sm:right-[-6%] sm:w-[74%]">
            <div className={`selling-browser ml-auto w-full max-w-[26rem] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMobile ? 'translate-y-[30%]' : 'translate-y-[52%] group-hover/selling:translate-y-[28%]'}`}>
              <div className="selling-browser-top">
                <div className="selling-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="selling-url" />
              </div>

              <div className="selling-browser-body">
                <div className="selling-hero-line selling-line-lg" />
                <div className="selling-hero-line selling-line-md" />
                <div className="selling-cta" />

                <div className="selling-cards-row">
                  <div className="selling-card">
                    <span className="selling-stat-bar" />
                    <span className="selling-stat-bar short" />
                  </div>
                  <div className="selling-card">
                    <span className="selling-stat-bar" />
                    <span className="selling-stat-bar short" />
                  </div>
                  <div className="selling-card">
                    <span className="selling-stat-bar" />
                    <span className="selling-stat-bar short" />
                  </div>
                </div>

                <div className="selling-cursor" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <style>
        {`
          @keyframes selling-cursor-move {
            0% {
              transform: translate(14px, 18px) rotate(-10deg);
              opacity: 0.75;
            }
            35% {
              transform: translate(148px, 44px) rotate(-10deg);
              opacity: 1;
            }
            40% {
              transform: translate(148px, 44px) rotate(-10deg) scale(0.94);
              opacity: 1;
            }
            45% {
              transform: translate(148px, 44px) rotate(-10deg);
              opacity: 1;
            }
            74% {
              transform: translate(92px, 114px) rotate(-10deg);
              opacity: 0.92;
            }
            100% {
              transform: translate(14px, 18px) rotate(-10deg);
              opacity: 0.75;
            }
          }

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
              radial-gradient(circle at 14% 16%, rgba(245, 239, 228, 0.055), transparent 42%),
              radial-gradient(circle at 84% 78%, rgba(127, 167, 200, 0.2), transparent 38%),
              linear-gradient(180deg, rgba(17, 17, 16, 0.72), rgba(8, 8, 8, 0.9));
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
            background:
              radial-gradient(circle at 86% 8%, rgba(127, 167, 200, 0.1), transparent 42%),
              linear-gradient(180deg, rgba(245, 239, 228, 0.028), transparent 46%);
          }

          .chat-line {
            display: flex;
            align-items: flex-end;
            gap: 0.5rem;
          }

          .chat-line-out {
            justify-content: flex-end;
          }

          .chat-avatar {
            display: flex;
            width: 1.6rem;
            height: 1.6rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            border: 1px solid rgba(245, 239, 228, 0.22);
            background: linear-gradient(160deg, rgba(245, 239, 228, 0.16), rgba(245, 239, 228, 0.04));
            box-shadow: inset 0 1px 0 rgba(245, 239, 228, 0.24), 0 6px 12px rgba(0, 0, 0, 0.22);
            font-size: 0.58rem;
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
            max-width: 86%;
            flex-direction: column;
            gap: 0.26rem;
            border-radius: 0.92rem;
            border: 1px solid rgba(255, 255, 255, 0.14);
            padding: 0.62rem 0.72rem;
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
            font-size: 0.62rem;
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
            font-size: 0.82rem;
            line-height: 1.42;
            min-height: 1.42em;
            color: #f5efe4;
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
            background: linear-gradient(125deg, transparent 18%, rgba(245, 239, 228, 0.06) 46%, transparent 78%);
          }

          .selling-radial {
            background:
              repeating-radial-gradient(
                ellipse at 56% 92%,
                rgba(245, 239, 228, 0.22) 0 2px,
                rgba(245, 239, 228, 0) 2px 48px
              );
            opacity: 0.68;
            -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.98) 10%, rgba(0, 0, 0, 0.72) 62%, rgba(0, 0, 0, 0.12));
            mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.98) 10%, rgba(0, 0, 0, 0.72) 62%, rgba(0, 0, 0, 0.12));
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
            border-radius: 16px;
            border: 1px solid rgba(245, 239, 228, 0.2);
            background: linear-gradient(180deg, rgba(20, 20, 19, 0.94), rgba(8, 8, 8, 0.94));
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(245, 239, 228, 0.12);
            overflow: hidden;
            min-height: 20.5rem;
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

          .selling-browser-body {
            position: relative;
            padding: 1rem;
            background:
              radial-gradient(circle at 80% 18%, rgba(127, 167, 200, 0.12), transparent 34%),
              linear-gradient(180deg, rgba(245, 239, 228, 0.02), transparent 40%);
            min-height: 18.4rem;
          }

          .selling-hero-line {
            height: 0.6rem;
            border-radius: 9999px;
            background: rgba(245, 239, 228, 0.75);
            margin-bottom: 0.45rem;
          }

          .selling-line-lg {
            width: 72%;
          }

          .selling-line-md {
            width: 48%;
            opacity: 0.8;
          }

          .selling-cta {
            width: 38%;
            height: 0.52rem;
            border-radius: 9999px;
            margin-bottom: 0.9rem;
            background: linear-gradient(90deg, rgba(194, 167, 123, 0.95), rgba(218, 197, 167, 0.95));
          }

          .selling-cards-row {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.45rem;
          }

          .selling-card {
            border: 1px solid rgba(245, 239, 228, 0.14);
            border-radius: 10px;
            background: rgba(245, 239, 228, 0.04);
            padding: 0.45rem;
            min-height: 3rem;
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

          .selling-cursor {
            position: absolute;
            left: 0;
            top: 0;
            width: 0.95rem;
            height: 1.3rem;
            background: #f5efe4;
            clip-path: polygon(0 0, 0 100%, 30% 74%, 45% 100%, 56% 95%, 42% 66%, 84% 66%);
            filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.7)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.32));
            animation: selling-cursor-move 6s ease-in-out infinite;
          }

          .selling-cursor::after {
            content: '';
            position: absolute;
            left: 2px;
            top: 2px;
            width: 0.52rem;
            height: 0.74rem;
            background: rgba(14, 14, 14, 0.48);
            clip-path: polygon(0 0, 0 100%, 30% 72%, 45% 100%, 56% 95%, 42% 64%, 84% 64%);
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

          :root:not(.dark) .bento-card-surface {
            background: rgba(250, 249, 245, 0.22) !important;
            border: 1px solid rgba(0, 0, 0, 0.06);
            color: var(--site-text) !important;
            box-shadow: none !important;
            backdrop-filter: blur(16px) saturate(115%);
            -webkit-backdrop-filter: blur(16px) saturate(115%);
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

          :root:not(.dark) .bento-card-surface > [style] {
            background: transparent !important;
            background-image: none !important;
          }

          :root:not(.dark) .bento-card-surface .text-white,
          :root:not(.dark) .bento-card-surface .text-\[\#f5efe4\],
          :root:not(.dark) .bento-card-surface [class*="text-white/"] {
            color: var(--site-text) !important;
          }

          :root:not(.dark) .bento-card-surface h2,
          :root:not(.dark) .bento-card-surface h3,
          :root:not(.dark) .bento-card-surface p,
          :root:not(.dark) .bento-card-surface button,
          :root:not(.dark) .bento-card-surface .card__header,
          :root:not(.dark) .bento-card-surface .card__content,
          :root:not(.dark) .bento-card-surface .card__description {
            color: var(--site-text) !important;
          }

          :root:not(.dark) .bento-card-surface h2 span[style],
          :root:not(.dark) .bento-card-surface h3 span[style] {
            color: inherit;
          }

          :root:not(.dark) .bento-card-surface .contact-card-overlay {
            background: rgba(250, 249, 245, 0.14);
          }

          :root:not(.dark) .bento-card-surface .btn-neutral-dark {
            border-color: rgba(36, 31, 24, 0.2) !important;
            color: var(--site-text) !important;
          }

          :root:not(.dark) .bento-card-surface .contact-card-bg,
          :root:not(.dark) .bento-card-surface .deliverables-card-bg,
          :root:not(.dark) .bento-card-surface .selling-site-bg,
          :root:not(.dark) .bento-card-surface .contact-card-grid,
          :root:not(.dark) .bento-card-surface .deliverables-card-grid,
          :root:not(.dark) .bento-card-surface .selling-site-ambient,
          :root:not(.dark) .bento-card-surface .attention-mobile-frost {
            opacity: 0 !important;
          }

          :root:not(.dark) .bento-card-surface [class*="bg-gradient"],
          :root:not(.dark) .bento-card-surface [class*="bg-\[radial-gradient"],
          :root:not(.dark) .bento-card-surface [class*="bg-\[linear-gradient"] {
            opacity: 0 !important;
          }

          :root:not(.dark) .card::before {
            border-color: var(--site-border);
          }
          
          @media (min-width: 600px) and (max-width: 1023px) {
            .card-responsive {
              grid-template-columns: repeat(6, 1fr);
              grid-template-rows: repeat(4, minmax(0, 1fr));
              gap: 0.65rem;
              height: 960px;
              min-height: 960px;
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
              height: 680px;
              min-height: 680px;
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

            :root:not(.dark) .bento-card-surface .bento-mobile-frost,
            :root:not(.dark) .bento-card-surface .selling-mobile-frost,
            :root:not(.dark) .bento-card-surface .attention-mobile-frost {
              opacity: 1 !important;
              background: rgba(250, 249, 245, 0.18);
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

          :root:not(.dark) .card::after {
            border-top: 1px solid rgba(0, 0, 0, 0.05);
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
              bottom: -56%;
              height: 138%;
            }

            .card-responsive .card:nth-child(4) .remote-card-globe {
              transform: translateY(12%) scale(0.78);
            }
          }

          /* Desktop: pull globe higher so it sits closer to the text */
          @media (min-width: 1024px) {
            .remote-card-globe-position {
              bottom: -30%;
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
            const baseClassName = `card relative ${index === 2 ? 'min-h-[170px]' : 'min-h-[180px]'} w-full max-w-full rounded-[20px]`;
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

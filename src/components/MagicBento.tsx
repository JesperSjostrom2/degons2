'use client'

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Player } from "@remotion/player";
import { User, Copy, Check } from "lucide-react";
import Magnet from "@/blocks/Animations/Magnet/Magnet";
import BorderGlow from "@/components/BorderGlow";
import { InfiniteBentoPan } from "@/components/ui/infinite-bento-pan";
import { Globe } from "@/components/ui/cobe-globe";

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
const BORDER_GLOW_COLORS = ["#8b7355", "#dac5a7", "#f5efe4"];
const BORDER_GLOW_HSL = "38 37 76";
const BORDER_GLOW_BACKGROUND = "#050505";
const BENTO_ACCENTS = {
  brass: "#a88c62",
  champagne: "#c2a77b",
  gold: "#dac5a7",
  bronze: "#8b7355",
  olive: "#8fa58a",
  blue: "#7fa7c8",
};

const COLLABORATION_AVATARS = [
  { seed: "Maya", className: "left-[6%] top-[31%]", delayClass: "group-hover/collab:delay-0", mobileDelay: "0ms" },
  { seed: "Noah", className: "right-[6%] top-[43%]", delayClass: "group-hover/collab:delay-200", mobileDelay: "200ms" },
  { seed: "Ava", className: "left-[13%] bottom-[13%]", delayClass: "group-hover/collab:delay-[400ms]", mobileDelay: "400ms" },
  { seed: "Elias", className: "right-[24%] top-[21%]", delayClass: "group-hover/collab:delay-[600ms]", mobileDelay: "600ms" },
  { seed: "Lina", className: "right-[13%] bottom-[9%]", delayClass: "group-hover/collab:delay-[800ms]", mobileDelay: "800ms" },
];


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
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

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
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
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

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
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
    className="bento-section grid gap-4 p-6 w-full max-w-7xl mx-auto select-none relative"
    style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)" }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
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
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const [isMounted, setIsMounted] = useState(false);
  const [isContactCopied, setIsContactCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const getRemoteWorkCard = () => ({
    color: BENTO_ACCENTS.blue,
    title: "🌍 Global Availability",
    description: "Flexible with timezones. Based in Finland, available globally.",
    label: "Remote Work",
    customContent: (
      <div className="relative flex h-full flex-col overflow-hidden">
        <div className="relative z-20 flex flex-col p-6 pb-3">
            <h2 className="mb-2 text-2xl font-bold leading-tight text-white">
              Flexible with<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.blue }}>timezones</span>
            </h2>
          <p className="text-white/70 text-sm mb-4">
            Based in Finland, available globally
          </p>

        </div>

        <div className="relative z-10 mt-auto min-h-[220px] h-[52%] overflow-visible">
          <div className="absolute inset-x-0 bottom-[-65%] h-[180%] flex justify-center items-center pointer-events-auto">
            <Globe 
              className="w-full max-w-[600px] relative z-10 scale-[1.15]"
              dark={1}
              baseColor={[0.1, 0.1, 0.1]}
              glowColor={[1, 1, 1]}
              markerColor={[0.2, 0.5, 1.0]}
              arcColor={[0.2, 0.5, 1.0]}
              theta={0.1}
              mapSamples={isMobile ? 5000 : 16000}
              speed={isMobile ? 0.0015 : 0.003}
              markers={[
                { id: "helsinki", location: [60.1699, 24.9384] as [number, number], label: "Helsinki" },
                { id: "tokyo", location: [35.6762, 139.6503] as [number, number], label: "Tokyo" },
                { id: "sydney", location: [-33.8688, 151.2093] as [number, number], label: "Sydney" },
                { id: "newyork", location: [40.7128, -74.006] as [number, number], label: "New York" },
                { id: "capetown", location: [-33.9249, 18.4241] as [number, number], label: "Cape Town" },
              ]}
              arcs={[
                { id: "ny-hel", from: [40.7128, -74.006] as [number, number], to: [60.1699, 24.9384] as [number, number] },
                { id: "hel-ct", from: [60.1699, 24.9384] as [number, number], to: [-33.9249, 18.4241] as [number, number] },
                { id: "ct-tokyo", from: [-33.9249, 18.4241] as [number, number], to: [35.6762, 139.6503] as [number, number] },
                { id: "tokyo-syd", from: [35.6762, 139.6503] as [number, number], to: [-33.8688, 151.2093] as [number, number] },
              ]}
            />
          </div>
        </div>
      </div>
    ),
  });

  // Create cardData array with the remote work card that has access to state
  const cardData = [
    {
      color: BENTO_ACCENTS.brass,
      title: "🤝 Easy Collaboration",
      description: "Clear updates, quick changes, and room for feedback until it feels right",
      label: "Client Process",
      customContent: (
        <div className="group/collab relative -m-8 h-[calc(100%+4rem)] overflow-hidden p-6 sm:p-8">
          <div className="collab-card-bg absolute inset-0" />
          <div className="collab-card-ambient absolute inset-0" />
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(168,140,98,0.16),transparent_34%)] transition-opacity duration-700 ${isMobile ? 'opacity-100' : 'opacity-70 group-hover/collab:opacity-100'}`} />
          <div className={`absolute inset-0 bg-black/5 backdrop-blur-sm transition-opacity duration-700 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover/collab:opacity-100'}`} />
          <div className="bento-mobile-frost absolute inset-0" />

          <div className="relative z-30 max-w-[15rem]">
            <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
              Easy feedback,<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.champagne }}>better results.</span>
            </h2>
            <p className="text-sm leading-6 text-white/70">
              We can go back and forth with changes until you are satisfied.
            </p>
          </div>

          {COLLABORATION_AVATARS.map((avatar) => (
            <div
              key={avatar.seed}
              className={`absolute z-20 h-12 w-12 rounded-full border border-white/20 bg-accent bg-cover bg-center shadow-[0_12px_35px_rgba(0,0,0,0.35)] sm:h-14 sm:w-14 ${avatar.className} ${isMobile ? 'collab-avatar-mobile' : `scale-50 opacity-0 blur-sm transition-all duration-700 ease-out group-hover/collab:scale-100 group-hover/collab:opacity-100 group-hover/collab:blur-0 ${avatar.delayClass}`}`}
              style={{
                backgroundImage: `url(https://api.dicebear.com/9.x/adventurer/svg?seed=${avatar.seed})`,
                animationDelay: isMobile ? avatar.mobileDelay : undefined,
              }}
            />
          ))}

          <div className={`absolute left-1/2 top-[56%] z-30 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40 bg-black/40 bg-contain bg-center bg-no-repeat shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(218,197,167,0.18)] transition-transform duration-700 ease-out sm:h-32 sm:w-32 ${isMobile ? 'scale-105' : 'group-hover/collab:scale-105'}`} style={{ backgroundImage: "url('/assets/memoji.png')" }} />
        </div>
      ),
    },
    {
      color: BENTO_ACCENTS.gold,
      title: "⚡ Product Systems",
      description: "Interfaces, dashboards, automation, and deployment flows",
      label: "Technologies",
      customContent: (
        <div className="relative -m-8 h-[calc(100%+4rem)] overflow-hidden bg-transparent">
          <div className="relative z-10 h-[56%] p-8 pb-5">
            <div className="flex h-full flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold leading-tight text-white">
                  Interfaces that<br />
                  feel <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.olive }}>alive</span><br />
                  under the hood
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-white/72">
                I build dashboards, workflows, and deployment-ready frontend systems with motion,
                data clarity, and performance in mind.
              </p>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[44%] overflow-hidden">
            {isMounted && !isMobile && (
              <Player
                component={InfiniteBentoPan}
                inputProps={{ speed: 0.82, panSpeed: 0.92, accentColor: BENTO_ACCENTS.gold }}
                durationInFrames={360}
                fps={30}
                compositionWidth={1280}
                compositionHeight={720}
                autoPlay
                loop
                controls={false}
                clickToPlay={false}
                style={{
                  position: 'absolute',
                  left: '-1.5rem',
                  right: '-1.5rem',
                  top: 0,
                  bottom: '-2rem',
                  width: 'calc(100% + 3rem)',
                  height: 'calc(100% + 2rem)',
                  background: 'transparent',
                }}
              />
            )}
            {isMobile && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(218,197,167,0.22),transparent_32%),linear-gradient(135deg,rgba(218,197,167,0.12),transparent_62%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/55" />
            <div className="absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
          </div>
        </div>
      ),
    },
    {
      color: BENTO_ACCENTS.gold,
      title: "📩 Let's Work Together",
      description: "Ready for your next project collaboration",
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
          <div className="contact-card-grid absolute inset-0 opacity-45" />
          <div className="contact-card-orbit contact-card-orbit-a" />
          <div className="contact-card-orbit contact-card-orbit-b" />
          <div className="contact-card-frost absolute inset-0" />

          <div className="relative z-10 text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: BENTO_ACCENTS.champagne }}>
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="mx-auto max-w-[15rem] text-2xl font-bold leading-tight text-[#f5efe4]">
                Let&apos;s work together on your next <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.champagne }}>project</span>
              </h2>
            </div>
            
            <Magnet
              padding={30}
              magnetStrength={2}
              wrapperClassName="flex justify-center"
            >
              <button 
                className="btn-neutral-dark relative flex items-center gap-2 overflow-hidden rounded-lg !bg-transparent px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:!bg-white/10"
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
                    
                    // Use hero notification system
                    const notification = document.createElement('div');
                    notification.className = 'fixed bottom-24 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transform translate-y-full transition-transform duration-300';
                    notification.style.background = '#2a2a2a';
                    notification.style.border = '1px solid #4a4a4a';
                    notification.style.color = '#ffffff';
                    notification.innerHTML = `
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <div>
                          <div class="font-medium">Copied to clipboard!</div>
                          <div class="text-sm opacity-70">Email address copied successfully</div>
                        </div>
                      </div>
                    `;
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                      notification.style.transform = 'translateY(0)';
                    }, 10);
                    
                    setTimeout(() => {
                      notification.style.transform = 'translateY(100%)';
                      setTimeout(() => {
                        document.body.removeChild(notification);
                      }, 300);
                    }, 3000);
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
                <span className="relative z-10">contact@jespersjostrom.se</span>
              </button>
            </Magnet>
          </div>
        </div>
      ),
    },
    getRemoteWorkCard(),
    {
      color: BENTO_ACCENTS.bronze,
      title: "✨ Websites That Make a Difference",
      description: "Websites that stand out and turn attention into results",
      label: "Services",
      customContent: (
        <div className="group/selling relative -m-8 flex h-[calc(100%+4rem)] flex-col overflow-hidden p-8">
          <div className="selling-site-bg absolute inset-0" />
          <div className="selling-site-ambient absolute inset-0" />
          <div className="selling-radial absolute bottom-[-16%] right-[-10%] z-0 h-[86%] w-[78%]" />
          <div className="selling-mobile-frost absolute inset-0" />

          <div className="relative z-20 max-w-[18rem]">
            <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
              Websites that<br />
              <span className="font-accent-strong" style={{ color: BENTO_ACCENTS.champagne }}>stand out</span> and<br />
              make a difference
            </h2>
            <p className="text-sm leading-6 text-white/72">
              Tailored experiences that look premium, perform fast, and help people trust your brand.
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
          @keyframes collab-avatar-mobile-in {
            from {
              opacity: 0;
              transform: scale(0.5);
              filter: blur(6px);
            }
            to {
              opacity: 1;
              transform: scale(1);
              filter: blur(0);
            }
          }

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

          .collab-card-bg {
            background:
              radial-gradient(circle at 18% 18%, rgba(218, 197, 167, 0.12), transparent 36%),
              radial-gradient(circle at 84% 78%, rgba(127, 167, 200, 0.12), transparent 40%),
              linear-gradient(180deg, rgba(17, 17, 16, 0.68), rgba(8, 8, 8, 0.9));
          }

          .collab-card-ambient {
            background: linear-gradient(125deg, transparent 20%, rgba(245, 239, 228, 0.045) 48%, transparent 76%);
            opacity: 0.8;
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

          @media (max-width: 750px) {
            .selling-mobile-frost,
            .bento-mobile-frost {
              display: block;
              background: rgba(8, 8, 8, 0.12);
              backdrop-filter: blur(3.5px);
              -webkit-backdrop-filter: blur(3.5px);
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

          @keyframes contact-mesh-drift {
            0% {
              transform: translate3d(-4%, -3%, 0) scale(1);
              opacity: 0.72;
            }
            50% {
              transform: translate3d(3%, 2%, 0) scale(1.06);
              opacity: 0.92;
            }
            100% {
              transform: translate3d(-4%, -3%, 0) scale(1);
              opacity: 0.72;
            }
          }

          @keyframes contact-orbit-spin {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }

          .contact-card-bg {
            background:
              radial-gradient(circle at 24% 20%, rgba(245, 239, 228, 0.14), transparent 42%),
              radial-gradient(circle at 78% 72%, rgba(127, 167, 200, 0.18), transparent 46%),
              linear-gradient(145deg, rgba(12, 12, 11, 0.6), rgba(6, 6, 6, 0.82));
            filter: saturate(1.08);
            animation: contact-mesh-drift 11s ease-in-out infinite;
          }

          .contact-card-frost {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.012));
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            z-index: 1;
            pointer-events: none;
          }

          .contact-card-grid {
            background-image:
              linear-gradient(rgba(245, 239, 228, 0.045) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 239, 228, 0.045) 1px, transparent 1px);
            background-size: 34px 34px;
            -webkit-mask-image: radial-gradient(circle at 50% 50%, black, transparent 75%);
            mask-image: radial-gradient(circle at 50% 50%, black, transparent 75%);
          }

          .contact-card-orbit {
            position: absolute;
            left: 50%;
            top: 50%;
            border-radius: 9999px;
            border: 1px solid rgba(245, 239, 228, 0.15);
            pointer-events: none;
            animation: contact-orbit-spin linear infinite;
            z-index: 0;
          }

          .contact-card-orbit::after {
            content: '';
            position: absolute;
            top: -4px;
            left: 50%;
            width: 8px;
            height: 8px;
            border-radius: 9999px;
            background: rgba(194, 167, 123, 0.9);
            box-shadow: 0 0 0 6px rgba(194, 167, 123, 0.12);
            transform: translateX(-50%);
          }

          .contact-card-orbit-a {
            width: 220px;
            height: 220px;
            animation-duration: 18s;
          }

          .contact-card-orbit-b {
            width: 300px;
            height: 300px;
            border-color: rgba(127, 167, 200, 0.24);
            animation-duration: 26s;
            animation-direction: reverse;
          }

          .contact-card-orbit-b::after {
            background: rgba(127, 167, 200, 0.92);
            box-shadow: 0 0 0 7px rgba(127, 167, 200, 0.14);
          }

          .collab-avatar-mobile {
            opacity: 0;
            transform: scale(0.5);
            filter: blur(6px);
            animation: collab-avatar-mobile-in 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          .card-responsive {
            grid-template-columns: 1fr;
            width: 100%;
            margin: 0 auto;
            padding: 0.5rem;
            position: relative;
            isolation: isolate;
          }

          .card-responsive .card {
            z-index: 1;
          }

          .bento-card-surface {
            background:
              linear-gradient(180deg, rgba(20, 20, 19, 0.66), rgba(8, 8, 8, 0.82)),
              radial-gradient(circle at 20% 16%, color-mix(in srgb, var(--bento-accent, #dac5a7) 24%, transparent), transparent 42%),
              radial-gradient(circle at 82% 88%, rgba(245, 239, 228, 0.08), transparent 46%),
              linear-gradient(145deg, color-mix(in srgb, var(--bento-accent, #dac5a7) 10%, transparent), transparent 42%, rgba(255, 255, 255, 0.04)),
              linear-gradient(135deg, #080808 0%, #141413 25%, #20201d 50%, #141413 75%, #080808 100%),
              radial-gradient(circle at 20% 30%, rgba(40, 40, 40, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(60, 60, 60, 0.2) 0%, transparent 50%),
              linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%) !important;
            background-attachment: scroll, scroll, scroll, scroll, fixed, fixed, fixed, fixed !important;
            background-blend-mode: normal, screen, soft-light, soft-light, multiply, overlay, normal, overlay !important;
          }
          
          @media (min-width: 600px) and (max-width: 1023px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
              grid-template-rows: repeat(4, 1fr);
              gap: 0.8rem;
              min-height: 800px;
            }
            
            /* Tablet layout - simplified bento */
            .card-responsive .card:nth-child(1) {
              grid-column: 1 / 5;
              grid-row: 1 / 2;
            }
            
            .card-responsive .card:nth-child(4) {
              grid-column: 1 / 3;
              grid-row: 2 / 4;
            }
            
            .card-responsive .card:nth-child(3) {
              grid-column: 3 / 5;
              grid-row: 2 / 3;
            }
            
            .card-responsive .card:nth-child(2) {
              grid-column: 3 / 5;
              grid-row: 3 / 4;
            }
            
            .card-responsive .card:nth-child(5) {
              grid-column: 1 / 5;
              grid-row: 4 / 5;
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(8, 1fr);
              grid-template-rows: repeat(3, 1fr);
              gap: 1rem;
              min-height: 700px;
              max-width: 1400px;
              margin: 0 auto;
            }
            
            /* Card 1: Collaboration - wide top card (not full width) */
            .card-responsive .card:nth-child(1) {
              grid-column: 1 / 6;
              grid-row: 1 / 2;
            }
            
            /* Card 2: Tech Stack - tall right column extending to top */
            .card-responsive .card:nth-child(2) {
              grid-column: 6 / 9;
              grid-row: 1 / 3;
            }
            
            /* Card 4: Remote Work - left area extending to bottom */
            .card-responsive .card:nth-child(4) {
              grid-column: 1 / 4;
              grid-row: 2 / 4;
            }
            
            /* Card 3: Contact - wider but shorter center card */
            .card-responsive .card:nth-child(3) {
              grid-column: 4 / 6;
              grid-row: 2 / 3;
            }
            
            /* Card 5: Currently Building - bottom right under Tech Stack */
            .card-responsive .card:nth-child(5) {
              grid-column: 4 / 9;
              grid-row: 3 / 4;
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
            border-top: 2px solid color-mix(in srgb, var(--bento-accent, #dac5a7) 54%, transparent);
            opacity: 0.85;
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
            box-shadow: 0 4px 20px rgba(61, 47, 40, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
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
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }

            .card-responsive {
              grid-template-columns: 1fr;
              width: 100%;
              margin: 0 auto;
              padding: 0;
            }

            .card-responsive .card {
              width: 100%;
              min-height: 280px;
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
            const baseClassName = `card relative ${index === 2 ? 'min-h-[240px]' : 'min-h-[280px]'} w-full max-w-full rounded-[20px]`;
            const cardInnerClassName = `bento-card-surface relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] font-light transition-all duration-300 ease-in-out ${index === 2 || index === 3 ? 'p-0' : 'p-8'}`;

            const defaultGradient = {
              background: `
                linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #000000 100%),
                radial-gradient(circle at 20% 30%, rgba(40, 40, 40, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(60, 60, 60, 0.2) 0%, transparent 50%),
                linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%)
              `,
              backgroundBlendMode: 'multiply, overlay, normal, overlay'
            };

            const cardStyle = {
              '--bento-accent': card.color,
              backdropFilter: "blur(12px)",
              ...(card.customBackground || defaultGradient)
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
                ref={(el) => {
                  if (!el) return;

                  const handleMouseMove = (e: MouseEvent) => {
                    if (shouldDisableAnimations) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    if (enableTilt) {
                      const rotateX = ((y - centerY) / centerY) * -10;
                      const rotateY = ((x - centerX) / centerX) * 10;

                      gsap.to(el, {
                        rotateX,
                        rotateY,
                        duration: 0.1,
                        ease: "power2.out",
                        transformPerspective: 1000,
                      });
                    }

                    if (enableMagnetism) {
                      const magnetX = (x - centerX) * 0.05;
                      const magnetY = (y - centerY) * 0.05;

                      gsap.to(el, {
                        x: magnetX,
                        y: magnetY,
                        duration: 0.3,
                        ease: "power2.out",
                      });
                    }
                  };

                  const handleMouseLeave = () => {
                    if (shouldDisableAnimations) return;

                    if (enableTilt) {
                      gsap.to(el, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.3,
                        ease: "power2.out",
                      });
                    }

                    if (enableMagnetism) {
                      gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                      });
                    }
                  };

                  const handleClick = (e: MouseEvent) => {
                    if (!clickEffect || shouldDisableAnimations) return;

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

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

                    el.appendChild(ripple);

                    gsap.fromTo(
                      ripple,
                      {
                        scale: 0,
                        opacity: 1,
                      },
                      {
                        scale: 1,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => ripple.remove(),
                      },
                    );
                  };

                  el.addEventListener("mousemove", handleMouseMove);
                  el.addEventListener("mouseleave", handleMouseLeave);
                  el.addEventListener("click", handleClick);
                }}
              >
                {content}
              </div>
            );

            if (enableBorderGlow) {
              return (
                <BorderGlow
                  key={index}
                  className={baseClassName}
                  edgeSensitivity={26}
                  glowColor={BORDER_GLOW_HSL}
                  backgroundColor={BORDER_GLOW_BACKGROUND}
                  borderRadius={20}
                  glowRadius={34}
                  glowIntensity={1.35}
                  coneSpread={24}
                  colors={BORDER_GLOW_COLORS}
                  fillOpacity={0.4}
                >
                  {cardBody}
                </BorderGlow>
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

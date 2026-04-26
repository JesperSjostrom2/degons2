'use client'

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Player } from "@remotion/player";
import { ShoppingCart, BarChart3, Rocket, User } from "lucide-react";
import Magnet from "@/blocks/Animations/Magnet/Magnet";
import ShinyText from "@/blocks/TextAnimations/ShinyText/ShinyText";
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
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getRemoteWorkCard = () => ({
    color: "#8b7a6b",
    title: "🌍 Global Availability",
    description: "Flexible with timezones. Based in Finland, available globally.",
    label: "Remote Work",
    customContent: (
      <div className="relative flex h-full flex-col overflow-hidden">
        <div className="relative z-20 flex flex-col p-6 pb-3">
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            Flexible with<br />
            <span className="text-accent">timezones</span>
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
              mapSamples={isMobile ? 8000 : 16000}
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
      color: "#8b7a6b",
      title: "🤝 Collaboration",
      description: "I prioritize client collaboration, fostering open communication",
      label: "Teamwork",
      customContent: (
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
              Clear communication<br />
              and <span className="text-accent">seamless</span><br />
              collaboration
            </h2>
            <p className="text-white/70 text-sm">
              Working closely with teams and clients for optimal results
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-white/60">
            <div className="flex items-center gap-1 text-xs">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              <span>Daily standups</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              <span>Transparent feedback</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      color: "#8b7a6b",
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
                  feel <span className="text-accent">alive</span><br />
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
                inputProps={{ speed: 0.82, panSpeed: 0.92, accentColor: '#dac5a7' }}
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
      color: "#8b7a6b",
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
        <div className="flex flex-col justify-center items-center h-full relative">        
          <div className="relative z-10 text-center">
            {/* Temporary Logo */}
            <div className="mb-8 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-accent/80 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Shiny "Let's connect" text */}
            <div className="mb-8">
              <ShinyText 
                text="Let's connect" 
                className="text-2xl font-bold leading-tight"
                speed={2.4}
              />
            </div>
            
            {/* Magnet Button */}
            <Magnet
              padding={30}
              magnetStrength={2}
              wrapperClassName="flex justify-center"
            >
              <button 
                className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden flex items-center gap-2"
                style={{
                  background: 'rgba(139, 115, 85, 0.2)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(139, 115, 85, 0.4)',
                  boxShadow: '0 4px 20px rgba(139, 115, 85, 0.3), 0 0 30px rgba(218, 197, 167, 0.2)'
                }}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText('contact@jespersjostrom.se');
                    
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="relative z-10">contact@jespersjostrom.se</span>
              </button>
            </Magnet>
          </div>
        </div>
      ),
    },
    getRemoteWorkCard(),
    {
      color: "#8b7a6b",
      title: "🛠️ Currently Building",
      description: "SaaS application with authentication & dashboards",
      label: "Projects",
      customContent: (
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
              Building innovative<br />
              <span className="text-accent">web experiences</span>
            </h2>
            <p className="text-white/70 text-sm">
              From e-commerce platforms to data visualization tools
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="text-sm font-medium">E-commerce Solutions</div>
                <div className="text-xs text-white/60">Full-stack shopping platforms</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="text-sm font-medium">Data Dashboards</div>
                <div className="text-xs text-white/60">Interactive analytics tools</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="text-sm font-medium">SaaS Applications</div>
                <div className="text-xs text-white/60">Scalable business solutions</div>
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
          .card-responsive {
            grid-template-columns: 1fr;
            width: 90%;
            margin: 0 auto;
            padding: 0.5rem;
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
            border: 1px solid rgba(255, 255, 255, 0.08);
            pointer-events: none;
            z-index: 1;
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
            .card-responsive {
              grid-template-columns: 1fr;
              width: 90%;
              margin: 0 auto;
              padding: 0.5rem;
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
            const cardInnerClassName = `relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] font-light transition-all duration-300 ease-in-out ${index === 3 ? 'p-0' : 'p-8'}`;

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

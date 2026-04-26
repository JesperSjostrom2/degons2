"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Transition, type Variants } from "framer-motion";
import { Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecialCardProps {
  imageSrc: string;
  name: string;
  role: string;
  socials?: {
    github: string;
  };
  className?: string;
  expandedWidth?: number;
}

// --- Animation Physics & Variants ---

// 1. The "Fluid" Spring: softer and more elastic feeling
const fluidTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 1,
};

// 2. Container for staggering text elements smoothly
const contentContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // The delay between name and role appearing
      delayChildren: 0.02,   // Start almost immediately upon expansion
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 }, // Exit FAST so the box can collapse cleanly
  },
};

// 3. The "Elegant Reveal": slides up while un-blurring
const elegantItemVariants: Variants = {
  hidden: { y: 12, opacity: 0, filter: "blur(6px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: fluidTransition, // Use the same fluid physics for elements
  },
};

export default function ProfileCard({
  imageSrc,
  name,
  role,
  socials,
  className = "",
  expandedWidth = 228,
}: SpecialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn(
          "relative z-0 flex items-center overflow-hidden p-1",
          "glass-nav text-white"
        )}
        style={{ cursor: "default" }}
        initial={{ borderRadius: 40, width: 48, height: 48 }}
        animate={{
          width: isHovered ? expandedWidth : 48,
          borderRadius: 40,
        }}
        transition={fluidTransition}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)} // Added click for mobile support
      >
        {/* Decorative layers */}
        <div className="absolute inset-0 z-0 rounded-[40px] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.2)] pointer-events-none" />

        {/* Gradient background reacts to theme */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500 z-0 rounded-[40px]",
            "bg-gradient-to-br from-white/10 via-white/5 to-transparent",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* --- Avatar Wrapper --- */}
        <motion.div
          layout="position" // Keeps avatar anchored smoothly during expansion
          className="relative z-30 h-10 w-10 shrink-0"
        >
          {/* Living Ambient Glow: Rotates slowly to feel alive */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            animate={{
              scale: isHovered ? 1.6 : 0.8,
              opacity: isHovered ? 1 : 0,
              rotate: isHovered ? [0, 360] : 0, // Slow rotation
            }}
            transition={{
              scale: { duration: 0.4, ease: "easeOut" },
              opacity: { duration: 0.4 },
              rotate: { duration: 15, repeat: Infinity, ease: "linear" }
            }}
          />

          {/* Avatar Image */}
          <motion.img
            src={imageSrc}
            alt={name}
            className="relative h-full w-full rounded-full object-cover border-[1.5px] border-white/20 shadow-sm"
            animate={{ scale: isHovered ? 1 : 0.96 }}
            transition={fluidTransition}
          />

          {/* Status Dot Pop-in */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-[1.5px] border-black z-40 shadow-[0_0_8px_rgba(74,222,128,0.5)]"
          />
        </motion.div>

        {/* --- Text Content --- */}
        <div className="relative z-20 overflow-hidden">
          {/* Use mode="wait" for cleaner exit/enter transitions */}
          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.div
                // Connect to our staggered container variants
                variants={contentContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col justify-center pl-2 pr-3"
                style={{ width: expandedWidth - 48 }}
              >
                {/* Header Row: Name & Social */}
                <div className="flex items-center justify-between gap-4 mb-0.5">
                  <motion.h3
                    variants={elegantItemVariants}
                    className="text-sm font-medium text-white tracking-tight whitespace-nowrap"
                  >
                    {name}
                  </motion.h3>

                  {socials?.github && (
                    <motion.a
                      href={socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={elegantItemVariants}
                      className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                    >
                      <Github size={14} />
                    </motion.a>
                  )}
                </div>

                {/* Bottom Row: Role & Action */}
                <motion.div
                  variants={elegantItemVariants}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">
                    {role}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

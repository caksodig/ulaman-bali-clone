"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// ============================================================================
// TYPES
// ============================================================================

interface TiraiSectionProps {
  leftImageUrl?: string;
  rightImageUrl?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ANIMATION_CONFIG = {
  // Smooth easing
  transitionDuration: "0.6s",
  transitionTiming: "cubic-bezier(0.4, 0.0, 0.2, 1)",
};

const DEFAULT_PROPS = {
  leftImageUrl: "/image/left-image.avif",
  rightImageUrl: "/image/right-image.avif",
  title: "Discover your path to wellness and growth.",
  description:
    "At Ulaman we redefine luxury as an experience that not only pampers the senses but also nurtures the soul. Nestled in pristine nature, our eco-luxury retreat offers a sanctuary for healing and transformation. With personalized programs year-round, enjoy dedicated attention and care, immersing yourself in relaxation, rejuvenation, or profound inner change through meticulously curated activities and treatments. Your transformative journey begins here.",
  ctaText: "LEARN MORE",
  ctaLink: "/retreats",
  backgroundColor: "#EFEBE2",
  accentColor: "#C69C4D",
  textColor: "#343E35",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TiraiSection({
  leftImageUrl = DEFAULT_PROPS.leftImageUrl,
  rightImageUrl = DEFAULT_PROPS.rightImageUrl,
  title = DEFAULT_PROPS.title,
  description = DEFAULT_PROPS.description,
  ctaText = DEFAULT_PROPS.ctaText,
  ctaLink = DEFAULT_PROPS.ctaLink,
  backgroundColor = DEFAULT_PROPS.backgroundColor,
  accentColor = DEFAULT_PROPS.accentColor,
  textColor = DEFAULT_PROPS.textColor,
}: TiraiSectionProps) {
  // ============================================================================
  // STATE & REFS
  // ============================================================================
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // ============================================================================
  // SCROLL HANDLER (Optimized with RAF)
  // ============================================================================
  const calculateProgress = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate when section is centered in viewport
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);

    // Normalize progress (0 = far, 1 = centered)
    const maxDistance = windowHeight / 1.2;
    const normalizedProgress = 1 - Math.min(distance / maxDistance, 1);
    const easedProgress = easeOutCubic(normalizedProgress);

    setProgress(easedProgress);
    setIsInView(rect.top < windowHeight && rect.bottom > 0);
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      calculateProgress();
      rafRef.current = 0;
    });
  }, [calculateProgress]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    calculateProgress(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, calculateProgress]);

  // ============================================================================
  // ANIMATION CALCULATIONS
  // ============================================================================

  // LEFT IMAGE ANIMATION
  // Closed (0): Center-left, large, covering text, slight right rotation
  // Open (1): Top-left corner, smaller, rotated left
  const leftImageStyle = {
    // Position: from center-left → top-left
    top: progress === 0 ? "50%" : "0%",
    left: progress === 0 ? "50%" : "-7%",

    // Size: from 45% → 25% (35% on mobile)
    width: progress === 0 ? "45%" : "min(35%, 400px)",

    // Transform origin
    transformOrigin: "top left",

    // Transform
    transform: `
      translate(
        ${progress === 0 ? "-50%" : "0%"},
        ${progress === 0 ? "-50%" : "0%"}
      )
      rotate(${8 - progress * 13}deg)
      scale(${1 - progress * 0.05})
    `,

    // Opacity & blur for dramatic effect
    opacity: 0.95,
    filter: progress === 0 ? "brightness(0.85)" : "brightness(1)",

    // Z-index: high when closed, lower when open
    zIndex: progress < 0.5 ? 20 : 10,

    transition: `all ${ANIMATION_CONFIG.transitionDuration} ${ANIMATION_CONFIG.transitionTiming}`,
  };

  // RIGHT IMAGE ANIMATION
  // Closed (0): Center-right, large, covering text, slight left rotation
  // Open (1): Bottom-right corner, smaller, rotated right
  const rightImageStyle = {
    // Position: from center-right → bottom-right
    bottom: progress === 0 ? "50%" : "0%",
    right: progress === 0 ? "50%" : "0%",

    // Size: from 45% → 25% (35% on mobile)
    width: progress === 0 ? "45%" : "min(35%, 400px)",

    // Transform origin
    transformOrigin: "bottom right",

    // Transform
    transform: `
      translate(
        ${progress === 0 ? "50%" : "0%"},
        ${progress === 0 ? "50%" : "0%"}
      )
      rotate(${-8 + progress * 23}deg)
      scale(${1 - progress * 0.05})
    `,

    // Opacity & blur for dramatic effect
    opacity: 0.95,
    filter: progress === 0 ? "brightness(0.85)" : "brightness(1)",

    // Z-index: high when closed, lower when open
    zIndex: progress < 0.5 ? 20 : 10,

    transition: `all ${ANIMATION_CONFIG.transitionDuration} ${ANIMATION_CONFIG.transitionTiming}`,
  };

  // CENTER CONTENT ANIMATION
  // Hidden (0): behind images, blurred, small
  // Visible (1): fully visible, clear, normal size
  const contentStyle = {
    opacity: progress * progress,
    transform: `scale(${0.9 + progress * 0.1}) translateY(${
      (1 - progress) * 30
    }px)`,
    filter: `blur(${(1 - progress) * 8}px)`,
    pointerEvents: progress > 0.5 ? ("auto" as const) : ("none" as const),
    transition: `all ${ANIMATION_CONFIG.transitionDuration} ${ANIMATION_CONFIG.transitionTiming}`,
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden min-h-screen px-6 py-20 md:py-32"
      style={{ backgroundColor }}
    >
      {/* ============================================================ */}
      {/* CENTER CONTENT - Revealed on Scroll */}
      {/* ============================================================ */}
      <div
        className="relative z-30 max-w-2xl text-center will-change-transform px-4"
        style={contentStyle}
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight"
          style={{ color: accentColor }}
        >
          {title}
        </h2>

        <p
          className="text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto"
          style={{ color: textColor, opacity: 0.9 }}
        >
          {description}
        </p>

        {ctaText && (
          <a
            href={ctaLink}
            className="inline-flex items-center gap-2 text-sm font-medium border-b-2 pb-1 transition-all duration-300 hover:gap-3 group tracking-wide"
            style={{
              color: accentColor,
              borderColor: accentColor,
            }}
          >
            {ctaText}
          </a>
        )}
      </div>

      {/* ============================================================ */}
      {/* LEFT IMAGE - Curtain Effect */}
      {/* ============================================================ */}
      <div
        className="absolute aspect-[3/4] md:aspect-[3/4] will-change-transform pointer-events-none"
        style={leftImageStyle}
      >
        <div className="relative w-full h-full overflow-hidden shadow-2xl rounded-lg md:rounded-xl">
          <Image
            src={leftImageUrl}
            alt="Wellness Experience"
            fill
            sizes="(max-width: 768px) 45vw, 35vw"
            quality={90}
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT IMAGE - Curtain Effect */}
      {/* ============================================================ */}
      <div
        className="absolute aspect-[3/4] md:aspect-[3/4] will-change-transform pointer-events-none"
        style={rightImageStyle}
      >
        <div className="relative w-full h-full overflow-hidden shadow-2xl rounded-lg md:rounded-xl">
          <Image
            src={rightImageUrl}
            alt="Wellness Journey"
            fill
            sizes="(max-width: 768px) 45vw, 35vw"
            quality={90}
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* DECORATIVE BACKGROUND */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${accentColor} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </section>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Ease out cubic function for smooth animations
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

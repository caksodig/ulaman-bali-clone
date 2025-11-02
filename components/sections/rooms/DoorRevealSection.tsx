"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";

// ============================================================================
// TYPES
// ============================================================================

interface DoorRevealSectionProps {
  title?: string;
  image: string;
  imageAlt?: string;
  backgroundColor?: string;
  textColor?: string;
  scrollHeight?: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DoorRevealSection({
  title,
  image,
  imageAlt = "Villa interior",
  backgroundColor = "#EFEBE2",
  textColor = "#C69C4D",
  scrollHeight,
}: DoorRevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const rafRef = useRef<number>(0);

  const [titleRef, hasTitleEntered] = useViewportEnter<HTMLHeadingElement>({
    threshold: 0.3,
  });

  // ============================================================================
  // SCROLL HANDLER (OPTIMIZED)
  // ============================================================================

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const sectionTop = rect.top;
    const sectionHeight = rect.height;

    // Calculate progress from when section enters to when it leaves
    const startPoint = windowHeight;
    const endPoint = -sectionHeight;

    let progress = 0;
    if (sectionTop < startPoint && sectionTop > endPoint) {
      progress = (startPoint - sectionTop) / (startPoint - endPoint);
      progress = Math.max(0, Math.min(1, progress));
    } else if (sectionTop <= endPoint) {
      progress = 1;
    }

    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        handleScroll();
        rafRef.current = 0;
      });
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", scrollListener);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  // ============================================================================
  // ANIMATION CALCULATIONS
  // ============================================================================

  // Title opacity: visible at start, fades out
  const titleOpacity =
    scrollProgress < 0.15 ? 1 : Math.max(0, 1 - (scrollProgress - 0.15) / 0.1);

  // Door shape animation (grows from bottom)
  const doorProgress = Math.max(0, Math.min(1, (scrollProgress - 0.1) / 0.6));

  // Width: 40% → 100%
  const doorWidth = 40 + doorProgress * 60;

  // Height: 30% → 100% (grows upward from bottom)
  const doorHeight = 30 + doorProgress * 70;

  // Border radius: arch top → rectangle
  // Format: top-left top-right bottom-right bottom-left
  const borderRadiusPercent = 50 - doorProgress * 50;
  const borderRadius = `${borderRadiusPercent}% ${borderRadiusPercent}% 0 0`;

  // Image opacity
  const imageOpacity = scrollProgress > 0.05 ? 1 : scrollProgress / 0.05;

  // Image scale (subtle zoom)
  const imageScale = 1 + scrollProgress * 0.08; // 1.0 → 1.08

  // Position: starts from bottom, grows upward
  // When doorProgress = 0: bottom = 10vh
  // When doorProgress = 1: bottom = 0vh (full screen)
  const bottomPosition = Math.max(0, 10 - doorProgress * 10);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div ref={containerRef} className="relative">
      {/* ============================================================== */}
      {/* STICKY CONTAINER */}
      {/* ============================================================== */}
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-start overflow-hidden"
        style={{ backgroundColor }}
      >
        {/* Title Layer */}
        {title && (
          <div
            ref={titleRef}
            className="absolute top-16 md:top-24 left-0 right-0 text-center px-4 z-30 pointer-events-none"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${(1 - titleOpacity) * 20}px)`,
            }}
          >
            <h2
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-none max-w-4xl mx-auto px-4 lg:px-32"
              style={{ color: textColor }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Door/Arch Shape Container (positioned from bottom) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-end justify-center z-20"
          style={{
            bottom: `${bottomPosition}vh`,
            width: "100%",
            height: "100%",
            transition: "bottom 0.05s ease-out",
          }}
        >
          {/* Morphing Door Shape */}
          <div
            className="relative overflow-hidden shadow-2xl will-change-transform"
            style={{
              width: `${doorWidth}vw`,
              height: `${doorHeight}vh`,
              borderRadius,
              maxWidth: "100vw",
              maxHeight: "100vh",
              transition: "all 0.05s ease-out",
            }}
          >
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-300 animate-pulse z-10" />
            )}

            {/* Image with parallax zoom */}
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${imageScale})`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                quality={90}
                className="object-cover"
                sizes="100vw"
                style={{
                  opacity: imageLoaded ? imageOpacity : 0,
                  transition: "opacity 0.7s ease-out",
                }}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Subtle gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none"
              style={{
                opacity: doorProgress > 0.3 ? (doorProgress - 0.3) / 0.7 : 0,
              }}
            />
          </div>
        </div>

        {/* Scroll Indicator (only visible at start) */}
        {scrollProgress < 0.1 && (
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce opacity-70">
            <div className="flex flex-col items-center gap-2">
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: textColor }}
              >
                Scroll to explore
              </span>
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{ color: textColor }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Progress Indicator (optional) */}
        {scrollProgress > 0.1 && scrollProgress < 0.9 && (
          <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-30">
            <div className="flex flex-col items-center gap-2">
              <div className="w-1 h-24 md:h-32 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="w-full bg-white/60 rounded-full transition-all duration-100"
                  style={{
                    height: `${scrollProgress * 100}%`,
                  }}
                />
              </div>
              <span
                className="text-xs font-light opacity-60"
                style={{ color: textColor }}
              >
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* SCROLL SPACER */}
      {/* ============================================================== */}
      <div style={{ height: `${scrollHeight}vh` }} />
    </div>
  );
}

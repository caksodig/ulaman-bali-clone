"use client";

import { useEffect, useRef, useState, ReactNode, useCallback } from "react";
import Image from "next/image";
import rawAvailabilityData from "@/data/availability-data.json";
import type { AvailabilityData } from "../ui/bookingModal";
const availabilityData = rawAvailabilityData as AvailabilityData;
import BookingModal from "../ui/bookingModal";

// ============================================================================
// TYPES
// ============================================================================

interface CircularRevealProps {
  // Content before reveal
  title?: string;
  subtitle?: string;
  cta?: {
    text: string;
    link: string;
  };

  image: string;
  imageAlt?: string;

  // Next section content (NOW OPTIONAL!)
  children?: ReactNode;

  // Customization
  backgroundColor?: string;
  textColor?: string;
  scrollHeight?: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CircularReveal({
  title,
  subtitle,
  cta,
  image,
  imageAlt = "Reveal image",
  children,
  backgroundColor = "#EFEBE2",
  textColor = "#C69C4D",
  scrollHeight = 200,
}: CircularRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rafRef = useRef<number>(0);

  // ============================================================================
  // SCROLL HANDLER (OPTIMIZED)
  // ============================================================================

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const sectionTop = rect.top;
    const sectionHeight = rect.height;

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
    handleScroll(); // Initial calculation

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

  // Animation stages:
  // 0.0 - 0.2: Title & CTA visible
  // 0.2 - 0.6: Portal expands (narrow → full width)
  // 0.6 - 0.75: Full image hold
  // 0.75 - 1.0: Next section slides up

  const titleOpacity =
    scrollProgress < 0.2 ? 1 : Math.max(0, 1 - (scrollProgress - 0.2) / 0.1);

  const portalWidth =
    scrollProgress < 0.2
      ? 0
      : scrollProgress < 0.6
      ? ((scrollProgress - 0.2) / 0.4) * 100 // 0% → 100%
      : 100;

  const portalHeight = 80; // 80vh
  const portalOpacity = scrollProgress > 0.2 ? 1 : 0;

  const imageOpacity =
    scrollProgress < 0.3
      ? 0
      : scrollProgress < 0.5
      ? (scrollProgress - 0.3) / 0.2
      : 1;

  // Next section slides up smoothly (only if children exist)
  const nextSectionTranslate = children
    ? scrollProgress < 0.75
      ? 100
      : Math.max(0, 100 - ((scrollProgress - 0.75) / 0.25) * 100)
    : 100; // Stay hidden if no children

  const showNextSection = children && scrollProgress > 0.75;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div ref={containerRef} className="relative">
      {/* ================================================================ */}
      {/* STICKY CONTAINER */}
      {/* ================================================================ */}
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor }}
      >
        {/* ============================================================== */}
        {/* TITLE & CTA LAYER */}
        {/* ============================================================== */}
        {(title || subtitle || cta) && (
          <div
            className="relative z-30 text-center px-4 lg:px-32 space-y-6 max-w-5xl mx-auto transition-all duration-300"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${(1 - titleOpacity) * 20}px)`,
              pointerEvents: titleOpacity > 0.5 ? "auto" : "none",
            }}
          >
            {subtitle && (
              <p
                className="text-sm md:text-base tracking-[0.3em] uppercase font-light"
                style={{ color: textColor }}
              >
                {subtitle}
              </p>
            )}

            {title && (
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl leading-relaxed px-4"
                style={{ color: textColor }}
              >
                {title}
              </h2>
            )}

            {cta && (
              <div className="pt-4">
                <a
                  onClick={() => setIsModalOpen(true)}
                  className="inline-block px-8 py-3 border-2 transition-all duration-300 text-sm tracking-wider uppercase font-medium hover:scale-105 rounded"
                  style={{
                    borderColor: textColor,
                    color: textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = textColor;
                    e.currentTarget.style.color = backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = textColor;
                  }}
                >
                  {cta.text}
                </a>
                <BookingModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  availabilityData={availabilityData}
                  config={{
                    // logoUrl: "/images/ulaman-logo.png",
                    defaultAdults: 2,
                    minNights: 2,
                    maxNights: 14,
                    bookingEngineUrl:
                      "https://www.book-secure.com/?HotelName=ASIAIDHTLUlamanEcoLu&hname=ASIAIDHTLUlamanEcoLu&arrival=2025-11-15&adults1=1&campaignId=41350&accessCode=CAMP-Specialopening&redir=BIZ-so5523q0o4&rt=1761933766&property=idbal31691&code=CAMP-Specialopening&s=results",
                    accentColor: "#C69C4D",
                    backgroundColor: "#EFEBE2",
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* ARCH/PORTAL SHAPE - Expands from center */}
        {/* ============================================================== */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          style={{
            opacity: portalOpacity,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <div
            className="relative overflow-hidden will-change-transform"
            style={{
              width: `${portalWidth}vw`,
              height: `${portalHeight}vh`,
              transition: "width 0.2s ease-out",
            }}
          >
            {/* Loading Skeleton */}
            {!imageLoaded && portalOpacity > 0 && (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-300 animate-pulse" />
            )}

            {/* Arch/Portal Clip Path */}
            <div
              className="absolute inset-0"
              style={{
                clipPath:
                  portalWidth < 100
                    ? `ellipse(${portalWidth * 0.5}vw ${
                        portalHeight * 0.5
                      }vh at 50% 50%)`
                    : "none", // Full screen = no clip
              }}
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover transition-opacity duration-700"
                style={{
                  opacity: imageLoaded ? imageOpacity : 0,
                }}
                sizes="100vw"
                quality={90}
                priority
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* FULL IMAGE BACKGROUND (when portal is 100% width) */}
        {/* ============================================================== */}
        {portalWidth >= 100 && (
          <div className="absolute inset-0 z-10">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
              quality={90}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* SCROLL SPACER */}
      {/* ================================================================ */}
      <div style={{ height: `${scrollHeight}vh` }} />

      {/* ================================================================ */}
      {/* NEXT SECTION - Slides Up Smoothly */}
      {/* ================================================================ */}
      {children && (
        <div
          className="relative z-40 bg-transparent"
          style={{
            transform: `translateY(${nextSectionTranslate}%)`,
            opacity: showNextSection ? 1 : 0,
            transition: "opacity 0.3s ease-out",
            willChange: "transform",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";
import AnimatedLink from "@/components/ui/animated-link";

// ============================================================================
// TYPES
// ============================================================================

interface Experience {
  id: string;
  title: string;
  duration: string;
  image: string; // Main thumbnail
  images?: string[]; // Gallery images (optional)
  ctaText?: string;
  ctaLink?: string;
}

interface ExperienceGridProps {
  experiences: Experience[];
  title?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SCROLL_AMOUNT = 400;
const PRELOAD_COUNT = 2; // Preload first 2 thumbnails only
const SCROLL_DEBOUNCE_MS = 100;
const HOVER_PRELOAD_DELAY = 300; // Preload gallery after 300ms hover

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExperienceGrid({
  experiences,
  title = "Book one of our special packages for a getaway you'll never forget.",
}: ExperienceGridProps) {
  const [headerRef, hasHeaderEntered] = useViewportEnter<HTMLDivElement>({
    threshold: 0.3,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ============================================================================
  // PRELOAD ONLY FIRST 2 THUMBNAILS
  // ============================================================================

  useEffect(() => {
    experiences.slice(0, PRELOAD_COUNT).forEach((exp) => {
      const img = new window.Image();
      img.src = exp.image;
    });
  }, [experiences]);

  // ============================================================================
  // SCROLL DETECTION (DEBOUNCED)
  // ============================================================================

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(checkScroll, SCROLL_DEBOUNCE_MS);
  }, [checkScroll]);

  useEffect(() => {
    checkScroll();

    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [checkScroll]);

  // ============================================================================
  // SCROLL FUNCTIONS
  // ============================================================================

  const scrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }, []);

  const scrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <section className="relative py-20 md:py-32 bg-[#EFEBE2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* TITLE */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-light text-[#C69C4D] leading-relaxed max-w-3xl mx-auto transition-all duration-700 ${
              hasHeaderEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {title}
          </h2>
        </div>

        {/* NAVIGATION + CARDS */}
        <div className="flex relative justify-center items-center md:pl-32">
          {/* Navigation Buttons */}
          <NavigationButtons
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
            hasHeaderEntered={hasHeaderEntered}
          />

          {/* Scrollable Cards */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex pl-4 gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                index={index}
                isPriority={index < PRELOAD_COUNT}
              />
            ))}
          </div>

          {/* Fade gradient */}
          <div className="md:block hidden absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#EFEBE2] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// NAVIGATION BUTTONS
// ============================================================================

interface NavigationButtonsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  hasHeaderEntered: boolean;
}

function NavigationButtons({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  hasHeaderEntered,
}: NavigationButtonsProps) {
  return (
    <div
      className={`md:block hidden items-center gap-4 mb-8 transition-all duration-700 ${
        hasHeaderEntered
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: "100ms" }}
    >
      <button
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 mb-4 ${
          canScrollLeft
            ? "border-[#C69C4D] text-[#C69C4D] hover:bg-[#C69C4D] hover:text-white hover:scale-110"
            : "border-stone-400 text-stone-400 cursor-not-allowed opacity-50"
        }`}
        aria-label="Scroll left"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={onScrollRight}
        disabled={!canScrollRight}
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          canScrollRight
            ? "border-[#C69C4D] text-[#C69C4D] hover:bg-[#C69C4D] hover:text-white hover:scale-110"
            : "border-stone-400 text-stone-400 cursor-not-allowed opacity-50"
        }`}
        aria-label="Scroll right"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ============================================================================
// EXPERIENCE CARD WITH GALLERY
// ============================================================================

interface ExperienceCardProps {
  experience: Experience;
  index: number;
  isPriority: boolean;
}

function ExperienceCard({
  experience,
  index,
  isPriority,
}: ExperienceCardProps) {
  const [ref, hasEntered] = useViewportEnter<HTMLElement>({
    threshold: 0.1,
    rootMargin: "150px",
  });

  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [galleryPreloaded, setGalleryPreloaded] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const preloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // All images: thumbnail + gallery
  const allImages = experience.images
    ? [experience.image, ...experience.images]
    : [experience.image];

  const hasGallery = allImages.length > 1;

  // ============================================================================
  // SMART PRELOADING ON HOVER
  // ============================================================================

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);

    // Preload gallery images after delay
    if (hasGallery && !galleryPreloaded) {
      preloadTimeoutRef.current = setTimeout(() => {
        allImages.slice(1, 3).forEach((src) => {
          const img = new window.Image();
          img.src = src;
        });
        setGalleryPreloaded(true);
      }, HOVER_PRELOAD_DELAY);
    }
  }, [hasGallery, galleryPreloaded, allImages]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setCurrentImageIndex(0); // Reset to thumbnail

    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (preloadTimeoutRef.current) clearTimeout(preloadTimeoutRef.current);
    };
  }, []);

  // ============================================================================
  // GALLERY NAVIGATION
  // ============================================================================

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    },
    [allImages.length]
  );

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    },
    [allImages.length]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  const currentImage = allImages[currentImageIndex];
  const showGalleryControls = hasGallery && isHovered;

  return (
    <article
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`shrink-0 w-[300px] sm:w-[340px] group transition-all duration-700 ${
        hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100 + 200}ms` }}
    >
      <Link
        href={experience.ctaLink || "#"}
        className="block"
        prefetch={isPriority}
      >
        <div className="rounded-lg overflow-hidden transition-all duration-300 relative">
          {/* ============================================================ */}
          {/* IMAGE CONTAINER */}
          {/* ============================================================ */}
          <div className="relative h-[380px] sm:h-[420px] overflow-hidden bg-neutral-200">
            {/* Skeleton Loader */}
            {!thumbnailLoaded && (
              <div className="absolute inset-0 z-10">
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-200 animate-pulse" />
              </div>
            )}

            {/* Main Image */}
            {(hasEntered || isPriority) && (
              <Image
                key={currentImageIndex}
                src={currentImage}
                alt={`${experience.title} - Image ${currentImageIndex + 1}`}
                fill
                priority={isPriority && currentImageIndex === 0}
                loading={
                  isPriority && currentImageIndex === 0 ? "eager" : "lazy"
                }
                quality={isPriority && currentImageIndex === 0 ? 85 : 75}
                className={`object-cover transition-all duration-700 ${
                  thumbnailLoaded
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                } ${isHovered ? "group-hover:scale-110" : ""}`}
                sizes="(max-width: 640px) 300px, 340px"
                onLoad={() => setThumbnailLoaded(true)}
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20" />

            {/* ============================================================ */}
            {/* GALLERY CONTROLS (Show on hover if has multiple images) */}
            {/* ============================================================ */}
            {showGalleryControls && (
              <>
                {/* Navigation Buttons */}
                <div className="absolute inset-0 flex items-center justify-between p-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handlePrevImage}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Dot Indicators */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "bg-white w-4"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {currentImageIndex + 1}/{allImages.length}
                </div>
              </>
            )}

            {/* ============================================================ */}
            {/* CONTENT OVERLAY */}
            {/* ============================================================ */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
              {/* Duration */}
              <p className="text-xs tracking-wider uppercase mb-2 opacity-90">
                {experience.duration}
              </p>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-light leading-tight mb-4">
                {experience.title}
              </h3>

              {/* CTA Link */}
              <div className="inline-block">
                <AnimatedLink
                  href={experience.ctaLink || "#"}
                  className="font-normal text-white after:bg-white"
                >
                  <span>{experience.ctaText || "DISCOVER"}</span>
                </AnimatedLink>
              </div>

              {/* Gallery Indicator (if has multiple images) */}
              {hasGallery && !isHovered && (
                <div className="absolute top-0 right-0 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-bl-lg text-xs flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{allImages.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

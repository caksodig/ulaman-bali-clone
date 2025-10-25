"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";

interface Villa {
  id: string;
  name: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

interface VillaShowcaseProps {
  villas: Villa[];
  title?: string;
  subtitle?: string;
}

export default function VillaShowcase({
  villas,
  title = "Discover cozy elegance, where tranquility meets Bali's serene beauty.",
  subtitle = "Private Eco Villas",
}: VillaShowcaseProps) {
  const [headerRef, hasHeaderEntered] = useViewportEnter({ threshold: 0.3 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-20 md:py-32 bg-[#E8E4DC]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title - Top Center */}
        <div ref={headerRef as any} className="text-center mb-12 md:mb-16">
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

        {/* Navigation + Cards Container */}
        <div className="relative">
          {/* Navigation Buttons - Bottom Left */}
          <div
            className={`flex items-center gap-4 mb-8 transition-all duration-700 ${
              hasHeaderEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                canScrollLeft
                  ? "border-[#C69C4D] text-[#C69C4D] hover:bg-[#C69C4D] hover:text-white"
                  : "border-stone-400 text-stone-400 cursor-not-allowed opacity-50"
              }`}
              aria-label="Scroll left"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                canScrollRight
                  ? "border-[#C69C4D] text-[#C69C4D] hover:bg-[#C69C4D] hover:text-white"
                  : "border-stone-400 text-stone-400 cursor-not-allowed opacity-50"
              }`}
              aria-label="Scroll right"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable Cards Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {villas.map((villa, index) => (
              <VillaCard
                key={villa.id}
                villa={villa}
                index={index}
                hasHeaderEntered={hasHeaderEntered}
              />
            ))}
          </div>

          {/* Fade gradient on right edge */}
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#E8E4DC] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

function VillaCard({
  villa,
  index,
  hasHeaderEntered,
}: {
  villa: Villa;
  index: number;
  hasHeaderEntered: boolean;
}) {
  const [ref, hasEntered] = useViewportEnter({ threshold: 0.1 });

  return (
    <article
      ref={ref as any}
      className={`shrink-0 w-[320px] sm:w-[380px] group transition-all duration-700 ${
        hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100 + 200}ms` }}
    >
      <div className="overflow-hidden">
        {/* Image */}
        <div className="relative h-[280px] sm:h-80 overflow-hidden">
          <Image
            src={villa.image}
            alt={villa.name}
            fill
            className="object-cover"
            sizes="380px"
            quality={85}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Villa Name */}
          <h3 className="text-xl md:text-2xl font-light text-[#C69C4D] leading-tight">
            {villa.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-stone-700 leading-relaxed line-clamp-3">
            {villa.description}
          </p>

          {/* CTA Link */}
          {villa.ctaLink && (
            <Link
              href={villa.ctaLink}
              className="inline-flex items-center gap-2 text-[#C69C4D] hover:text-[#B08A3D] transition-colors group text-sm tracking-wider uppercase font-normal pt-2"
            >
              <span>{villa.ctaText || "DISCOVER"}</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

// Hide scrollbar CSS
const style = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

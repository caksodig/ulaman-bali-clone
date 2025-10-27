"use client";

import { useRef, useState } from "react";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";
import VillaCard from "@/components/ui/villa-card";
import type { RefObject } from "react";
import type { VillaShowcase } from "@/types/content";

interface VillaShowcaseProps {
  villas: VillaShowcase[];
  title?: string;
}

export default function VillaShowcase({ villas, title }: VillaShowcaseProps) {
  const [headerRef, hasHeaderEntered] = useViewportEnter({ threshold: 0.3 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  console.log("VillaShowcase title:", title);

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
    <section className="relative py-20 md:py-32 bg-[#EFEBE2]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title - Top Center */}
        <div
          ref={headerRef as RefObject<HTMLHeadingElement>}
          className="text-center mb-12 md:mb-16"
        >
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-light text-[#C69C4D] leading-relaxed max-w-3xl mx-auto transition-all duration-700 ${
              hasHeaderEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {title}
          </h1>
        </div>

        {/* Navigation + Cards Container */}
        <div className="relative flex max-w-6xl mx-auto justify-center items-center">
          {/* Navigation Buttons - Bottom Left */}
          <div
            className={`gap-4 mb-8 transition-all duration-700  top-1/2 -translate-y-1/2 ${
              hasHeaderEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 mb-4 ${
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
            {villas.map((villa) => {
              const allImages =
                Array.isArray(villa.image) && villa.image.length > 0
                  ? villa.image
                  : ["/fallback.jpg"];

              return (
                <div key={villa.id} className="shrink-0 w-[320px] sm:w-[380px]">
                  <VillaCard
                    title={villa.name || villa.nameImage || "Villa"}
                    images={allImages}
                    description={
                      villa.description ||
                      villa.descriptionImage ||
                      "Luxury villa in Bali"
                    }
                    cta={{
                      text: villa.cta?.text || villa.ctaText || "Discover",
                      link: villa.cta?.link || villa.ctaLink || "#",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Fade gradient on right edge */}
          <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-[#E8E4DC] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";

interface Experience {
  id: string;
  title: string;
  duration: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

interface ExperienceGridProps {
  experiences: Experience[];
  title?: string;
}

export default function ExperienceGrid({
  experiences,
  title = "Book one of our special packages for a getaway you'll never forget.",
}: ExperienceGridProps) {
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
        <div className="flex relative justify-center items-center">
          {/* Navigation Buttons - Bottom Left */}
          <div
            className={` items-center gap-4 mb-8 transition-all duration-700 ${
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
                hasHeaderEntered={hasHeaderEntered}
              />
            ))}
          </div>

          {/* Fade gradient on right edge */}
          <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-[#E8E4DC] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

// Experience Card Component
function ExperienceCard({
  experience,
  index,
  hasHeaderEntered,
}: {
  experience: Experience;
  index: number;
  hasHeaderEntered: boolean;
}) {
  const [ref, hasEntered] = useViewportEnter({ threshold: 0.1 });

  return (
    <article
      ref={ref as any}
      className={`shrink-0 w-[300px] sm:w-[340px] group transition-all duration-700 ${
        hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100 + 200}ms` }}
    >
      <Link href={experience.ctaLink || "#"} className="block">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative h-[380px] sm:h-[420px] overflow-hidden">
            <Image
              src={experience.image}
              alt={experience.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="340px"
              quality={85}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Content Overlay - Bottom of Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {/* Duration */}
            <p className="text-xs tracking-wider uppercase mb-2 opacity-90">
              {experience.duration}
            </p>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-light leading-tight mb-4">
              {experience.title}
            </h3>

            {/* CTA Link */}
            <div className="inline-flex items-center gap-2 text-[#C69C4D] hover:text-white transition-colors text-sm tracking-wider uppercase font-normal">
              <span>{experience.ctaText || "DISCOVER"}</span>
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
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

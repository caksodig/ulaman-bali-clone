"use client";

import Image from "next/image";
import Link from "next/link";
import { LazySectionGroup } from "@/components/ui/LazySection";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";
import type { RefObject } from "react";

interface Experience {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  schedule: string;
  maxGuests: number;
  difficulty: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  const [headerRef, hasHeaderEntered] = useViewportEnter({
    threshold: 0.3,
  });

  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div ref={headerRef as RefObject<HTMLDivElement>} className="text-center mb-16 md:mb-20">
          <p
            className={`text-sm md:text-base tracking-[0.3em] uppercase text-stone-600 font-light mb-4 transition-all duration-700 ${
              hasHeaderEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Curated Experiences
          </p>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 transition-all duration-700 ${
              hasHeaderEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Discover Bali
          </h2>
          <p
            className={`mt-6 text-base md:text-lg text-stone-700 max-w-2xl mx-auto transition-all duration-700 ${
              hasHeaderEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Immerse yourself in authentic Balinese culture through our carefully
            crafted experiences
          </p>
        </div>

        {/* EXPERIENCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              index={index}
            />
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-16 transition-all duration-700 ${
            hasHeaderEntered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <Link
            href="/experience"
            className="inline-block px-10 py-4 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 text-sm tracking-wider uppercase font-medium"
          >
            View All Experiences
          </Link>
        </div>
      </div>
    </section>
  );
}

// EXPERIENCE CARD COMPONENT
function ExperienceCard({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const [ref, hasEntered] = useViewportEnter({
    threshold: 0.2,
  });

  return (
    <article
      ref={ref as RefObject<HTMLDivElement>}
      className={`group transition-all duration-700 ease-out ${
        hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Link href={`/experience/${experience.id}`} className="block">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* IMAGE */}
          <div className="lg:col-span-2 relative h-[280px] lg:h-[320px] overflow-hidden rounded-lg">
            <Image
              src={experience.image}
              alt={experience.title}
              fill
              loading="lazy"
              priority={true}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 40vw"
              quality={85}
            />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-stone-900 text-xs tracking-wider uppercase font-medium rounded">
              {experience.category}
            </div>

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-serif text-stone-900 group-hover:text-stone-600 transition-colors">
              {experience.title}
            </h3>

            {/* Description */}
            <p className="text-sm md:text-base text-stone-700 leading-relaxed line-clamp-3">
              {experience.description}
            </p>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{experience.duration}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-stone-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Max {experience.maxGuests} guests</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-stone-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{experience.difficulty}</span>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-stone-900">
                <span>From {experience.price}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-sm text-stone-900 group-hover:text-ulaman-gold transition-colors">
                Learn More
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

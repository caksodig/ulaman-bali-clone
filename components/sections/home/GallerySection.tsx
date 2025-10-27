"use client";

import Image from "next/image";
import { useState } from "react";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";
import AnimatedLink from "@/components/ui/animated-link";
import type { RefObject } from "react";

interface GallerySectionProps {
  data: {
    title: string;
    description: string;
    images: string[];
    cta?: {
      text: string;
      link: string;
    };
    seo?: {
      alt: string;
      title: string;
    };
  };
}

export default function GallerySection({ data }: GallerySectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [titleRef, hasTitleEntered] = useViewportEnter({ threshold: 0.3 });
  const [subtitleRef, hasSubtitleEntered] = useViewportEnter({
    threshold: 0.3,
  });
  const [descRef, hasDescEntered] = useViewportEnter({ threshold: 0.3 });
  const [ctaRef, hasCtaEntered] = useViewportEnter({ threshold: 0.3 });

  const handlePrevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? data.images.length - 1 : prev - 1
    );

  const handleNextImage = () =>
    setCurrentImageIndex((prev) =>
      prev === data.images.length - 1 ? 0 : prev + 1
    );

  return (
    <section className="relative py-0 lg:py-32 overflow-hidden bg-[#EFEBE2]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 sm:gap-11 gap-10 lg:gap-20 items-center px-4 sm:px-6 lg:px-8 ">
        {/* Left Side - Image Gallery */}
        <div className="relative w-full aspect-80/110 rounded-lg overflow-hidden shadow-md">
          {data.images[currentImageIndex] && (
            <Image
              src={data.images[currentImageIndex]}
              alt={`${data.seo?.alt || "Gallery image"} ${
                currentImageIndex + 1
              }`}
              fill
              priority={currentImageIndex === 0}
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 1280px) 100vw, 640px"
            />
          )}

          {/* Navigation Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
            >
              <svg
                className="w-6 h-6"
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
              onClick={handleNextImage}
              aria-label="Next image"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
            >
              <svg
                className="w-6 h-6"
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

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {data.images.length}
          </div>
        </div>

        {/* Right Side - Text Content */}
        <div className="flex flex-col space-y-6">
          <h2
            ref={titleRef as RefObject<HTMLHeadingElement>}
            className={`text-lg md:text-xl lg:text-2xl text-[#C69C4D] transition-all duration-700 delay-100 ${
              hasTitleEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {data.title}
          </h2>

          <p
            ref={descRef as RefObject<HTMLParagraphElement>}
            className={`text-[#343E35] text-sm leading-relaxed transition-all duration-700 delay-200 ${
              hasDescEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {data.description}
          </p>
          {data.cta && (
            <div
              ref={ctaRef as RefObject<HTMLDivElement>}
              className={`transition-all duration-700 delay-300 ${
                hasCtaEntered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <AnimatedLink href={data.cta.link} className="uppercase">
                {data.cta.text}
              </AnimatedLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface CircularRevealSectionProps {
  title: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export default function CircularRevealSection({
  title,
  ctaText,
  ctaLink,
  image,
}: CircularRevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress
      // 0 = section just entered viewport (bottom)
      // 1 = section fully passed (top out of view)
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Start animation when section is in view
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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate animation states based on scroll progress
  // Stage 1: 0 - 0.2 = Title & CTA visible
  // Stage 2: 0.2 - 0.5 = Circle expands from small to full
  // Stage 3: 0.5 - 0.8 = Full image visible
  // Stage 4: 0.8 - 1 = Next section slides up

  const titleOpacity =
    scrollProgress < 0.2 ? 1 : Math.max(0, 1 - (scrollProgress - 0.2) / 0.1);

  // Circle scale: 0% → 200% (to cover full screen)
  const circleScale =
    scrollProgress < 0.2
      ? 0
      : scrollProgress < 0.5
      ? ((scrollProgress - 0.2) / 0.3) * 2
      : 2;

  // Image opacity
  const imageOpacity =
    scrollProgress < 0.3 ? 0 : Math.min(1, (scrollProgress - 0.3) / 0.2);

  // Next section slide up
  const nextSectionTranslate =
    scrollProgress < 0.8 ? 100 : 100 - ((scrollProgress - 0.8) / 0.2) * 100;

  return (
    <div ref={containerRef} className="relative">
      {/* SECTION 1: Title & CTA (Fixed) */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-[#EFEBE2] overflow-hidden">
        {/* Title & CTA - Fades out */}
        <div
          className="relative z-20 text-center px-4 transition-opacity duration-300"
          style={{
            opacity: titleOpacity,
            pointerEvents: titleOpacity > 0 ? "auto" : "none",
          }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#C69C4D] leading-relaxed max-w-4xl mx-auto mb-8">
            {title}
          </h2>

          <Link
            href={ctaLink}
            className="inline-block px-8 py-3 border-2 border-[#C69C4D] text-[#C69C4D] hover:bg-[#C69C4D] hover:text-white transition-all duration-300 text-sm tracking-wider uppercase font-medium"
          >
            {ctaText}
          </Link>
        </div>

        {/* Circular Reveal - Expands from center */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{
            opacity: scrollProgress > 0.2 ? 1 : 0,
          }}
        >
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: "40vmin",
              height: "40vmin",
              transform: `scale(${circleScale})`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Image inside circle */}
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              style={{
                opacity: imageOpacity,
              }}
              sizes="100vw"
              quality={90}
              priority
            />
          </div>
        </div>

        {/* Full Image Background - Revealed */}
        <div
          className="absolute inset-0 z-5"
          style={{
            opacity: scrollProgress > 0.5 ? 1 : 0,
            transition: "opacity 0.3s ease-out",
          }}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          {/* Dark overlay for better readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
    </div>
  );
}

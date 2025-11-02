"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import aboutImages from "@/data/about/aboutImages.json";

export default function AboutGallery() {
  const imageRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      imageRefs.current.forEach((ref) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress =
          (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = Math.min(Math.max(progress * 100 - 50, -50), 50);
        ref.style.transform = `translateY(${translateY}px) scale(1.25)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full overflow-hidden mt-20">
      <div className="flex gap-1.5 px-6 lg:px-9 lg:gap-3.5 xl:gap-5 xl:px-5">
        {aboutImages.images.map((src: string, i: number) => (
          <div
            key={i}
            className="aspect-[10/16] w-1/2 overflow-hidden rounded-md group sm:w-1/3 sm:aspect-[10/14]"
          >
            <figure
              ref={(el) => {
                if (el instanceof HTMLDivElement) {
                  imageRefs.current[i] = el;
                }
              }}
              className="relative w-full h-full transition-transform duration-700 ease-out will-change-transform"
            >
              <Image
                src={src}
                alt={`About image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover w-full h-full"
                priority={i === 0}
              />
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}

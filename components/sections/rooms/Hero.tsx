"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroRoomsProps {
  images: string[];
  interval?: number;
  aspectRatio?: string;
}

export default function HeroRooms({
  images,
  interval = 4000,
  aspectRatio = "16/9",
}: HeroRoomsProps) {
  const [current, setCurrent] = useState(0);

  // Auto slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <section
      className={`
       relative w-full overflow-hidden
       h-screen sm:h-auto
     `}
      style={{ aspectRatio }}
    >
      {/* Images Layer */}
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`Room Image ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover object-center"
            sizes="100vw"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              index === current
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

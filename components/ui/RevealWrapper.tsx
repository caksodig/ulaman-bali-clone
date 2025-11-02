"use client";

import { useEffect, useState } from "react";
import DoorRevealSection from "@/components/sections/rooms/DoorRevealSection";
import AccommodationSection from "@/components/sections/rooms/AccommodationSection";

export default function RevealWrapper() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("reveal-wrapper");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const totalScroll = rect.height;
      const scrolled = Math.min(Math.max(-rect.top, 0), totalScroll);
      const ratio = scrolled / totalScroll;
      setProgress(ratio);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="reveal-wrapper"
      className="relative min-h-[200vh] overflow-hidden"
      style={{ backgroundColor: "#EFEBE2" }}
    >
      {/* Section pertama */}
      <div
        className="sticky top-0 h-screen flex items-center justify-center transition-all duration-700"
        style={{
          opacity: 1 - progress * 1.5,
          clipPath: `inset(${progress * 80}% 0 0 0 round 0px)`,
          zIndex: 2,
        }}
      >
        <DoorRevealSection
          title="Discover our eco Luxury State-of-the-Art Villas."
          image="/image/rooms/reveral.avif"
          backgroundColor="#EFEBE2"
          textColor="#C69C4D"
          scrollHeight={150}
        />
      </div>

      {/* Section kedua muncul smooth dari bawah */}
      <div
        className="absolute top-0 w-full transition-all duration-700"
        style={{
          transform: `translateY(${(1 - progress) * 40}vh)`,
          opacity: progress * 1.5,
          zIndex: 1,
        }}
      >
        <AccommodationSection />
      </div>
    </div>
  );
}

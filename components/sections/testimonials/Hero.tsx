"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  title: string;
  image: string;
}

export const Hero = ({ title, image }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Efek fade-in sederhana saat komponen muncul
    const timeout = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover brightness-[0.6] transition-transform duration-3000 scale-105 hover:scale-100"
          priority
        />
      </div>
    </section>
  );
};

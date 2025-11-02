"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface VillaCardProps {
  title: string;
  description: string;
  images: string[];
  cta: { text: string; link: string };
}

export default function VillaCard({
  title,
  description,
  images,
  cta,
}: VillaCardProps) {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group md:pl-4 overflow-hidden">
      {/* Image Slider */}
      <div className="relative w-full h-72 overflow-hidden">
        <Image
          src={images[current]}
          alt={title}
          fill
          className="object-cover transition-all duration-700"
        />

        {/* Navigation Buttons */}
        <div className="absolute inset-x-0 bottom-3 flex justify-between px-4">
          <button
            onClick={handlePrev}
            className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
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
            onClick={handleNext}
            className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
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
              //{" "}
            </svg>
          </button>
        </div>
      </div>

      {/* Text & CTA */}
      <div className="py-2">
        <h3 className="text-xl text-[#C69C4D] font-semibold mb-2">{title}</h3>
        <p className="text-sm mb-4">{description}</p>
        <Link
          href={cta.link}
          className="relative inline-block text-[#C69C4D] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C69C4D] after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
        >
          {cta.text}
        </Link>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

interface Program {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  durations: string[];
  suitableFor: string[];
  images: string[];
}

interface RetreatProgramsProps {
  programs: Program[];
}

export const RetreatPrograms = ({ programs }: RetreatProgramsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProgram = programs[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % programs.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + programs.length) % programs.length);
  };

  return (
    <section className="py-20 px-6 md:px-12">
      {/* Tabs */}
      <div className="flex justify-center gap-10 text-[#B68745] font-serif text-lg mb-10 border-b border-[#D6C6A3]">
        {programs.map((program, index) => (
          <button
            key={program.id}
            onClick={() => setActiveIndex(index)}
            className={`pb-2 transition-all ${
              index === activeIndex
                ? "border-b-2 border-[#B68745] text-[#B68745]"
                : "text-gray-500 hover:text-[#B68745]"
            }`}
          >
            {program.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div className="aspect-[4/5] relative overflow-hidden rounded-xl">
          <Image
            src={activeProgram.images[0]}
            alt={activeProgram.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <h3 className="text-2xl font-serif text-[#B68745]">
            {activeProgram.title}
          </h3>
          <p className="italic text-[#B68745]">{activeProgram.subtitle}</p>

          {/* Durations */}
          <div className="flex gap-3 mt-3">
            {activeProgram.durations.map((night, i) => (
              <span
                key={i}
                className="border border-[#D6C6A3] text-sm px-3 py-1 rounded-md text-[#6B5D4D] bg-[#FAF8F3]"
              >
                {night}
              </span>
            ))}
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            {activeProgram.description}
          </p>

          {/* List */}
          <div>
            <h4 className="text-[#B68745] font-medium mt-4">
              Suitable for those looking to:
            </h4>
            <ul className="list-decimal list-inside text-gray-700 text-sm mt-2 space-y-1">
              {activeProgram.suitableFor.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* CTA & Controls */}
          <div className="flex items-center justify-between pt-6">
            <a
              href="#"
              className="text-[#B68745] text-sm underline underline-offset-4 hover:opacity-80 transition"
            >
              LEARN & BOOK
            </a>
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="p-2 border border-[#D6C6A3] rounded-md hover:bg-[#EDE7D9] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="p-2 border border-[#D6C6A3] rounded-md hover:bg-[#EDE7D9] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

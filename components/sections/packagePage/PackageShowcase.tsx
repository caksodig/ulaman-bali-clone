"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import packagesData from "@/data/package-ulaman/packagesCard.json";

export default function PackageShowcase() {
  const [current, setCurrent] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const packages = packagesData.packages;

  // Update status tombol (untuk desktop)
  useEffect(() => {
    setIsAtStart(current === 0);
    setIsAtEnd(current === packages.length - 1);
  }, [current, packages.length]);

  // Scroll handler (mobile)
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setIsAtStart(scrollLeft <= 0);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
  };

  const nextSlide = () =>
    setCurrent((prev) => Math.min(prev + 1, packages.length - 1));
  const prevSlide = () => setCurrent((prev) => Math.max(prev - 1, 0));

  return (
    <section className="px-6 lg:px-20 space-y-11 lg:space-y-16">
      {/* HEADER */}
      <header>
        <div className="space-y-5 mx-auto sm:space-y-6 xl:space-y-5 max-w-[24.35rem] lg:max-w-[30rem]">
          <div className="text-center mb-12">
            <h2 className="text-[#C69C4D] text-xl md:text-2xl leading-normal max-w-2xl mx-auto">
              Book one of our special packages for a getaway you’ll never
              forget.
            </h2>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-[auto_1fr] items-center gap-0 md:gap-10">
        {/* LEFT CONTENT - hanya selebar tombol */}
        <div className="flex flex-col justify-center items-center pl-6">
          <nav className=" sm:block hidden">
            <button
              onClick={prevSlide}
              disabled={isAtStart}
              className={`border border-[#C69C4D] rounded-md w-18 h-18 flex items-center justify-center mb-4 transition ${
                isAtStart
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[#EDE6D8]"
              }`}
              aria-label="Previous Package"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.6}
                stroke="currentColor"
                className="w-6 h-6 text-[#C69C4D]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              disabled={isAtEnd}
              className={`border border-[#C69C4D] rounded-md w-18 h-18 flex items-center justify-center transition ${
                isAtEnd ? "opacity-40 cursor-not-allowed" : "hover:bg-[#EDE6D8]"
              }`}
              aria-label="Next Package"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.6}
                stroke="currentColor"
                className="w-6 h-6 text-[#C69C4D]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative flex justify-center w-full  overflow-hidden">
          {/* DESKTOP MODE */}
          <div
            className="hidden md:flex gap-6 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${current * 46}%)`,
            }}
          >
            {packages.map((item, index) => (
              <div
                key={index}
                className="min-w-0 shrink-0 grow-0 pl-4 basis-auto group sm:pl-10 sm:last:pr-10 lg:pl-18 lg:last:pr-18 pb-1"
              >
                <div className="w-[21.5rem] aspect-[10/10.6] sm:w-72 lg:w-[21.5rem] floating-element-decoration">
                  <div className="relative w-full h-80">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="w-full h-full object-cover relative z-10 rounded-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  <div className="py-6 text-left">
                    <div className="flex flex-wrap gap-3">
                      <p className="text-[13px] text-gray-500 bg-[#EDE6D8] px-3 py-1 mb-2">
                        {item.duration}
                      </p>
                    </div>
                    <h3 className="text-xl text-[#C69C4D] mb-2">
                      {item.title}
                    </h3>
                    <button className="text-[#C69C4D] text-sm border-b border-[#C69C4D]">
                      DISCOVER
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE MODE */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
          >
            {packages.map((item, index) => (
              <div
                key={index}
                className="w-[21.5rem] aspect-[10/10.6] sm:w-72 lg:w-[21.5rem] floating-element-decoration"
              >
                <div className="relative w-full h-72">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[13px] text-gray-500 mb-2">
                    {item.duration}
                  </p>
                  <h3 className="text-xl font-serif text-[#B58B38] mb-2">
                    {item.title}
                  </h3>
                  <button className="text-[#B58B38] text-sm border-b border-[#B58B38] hover:text-[#9e7a2f] transition">
                    DISCOVER
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

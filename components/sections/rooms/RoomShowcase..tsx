"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface Room {
  title: string;
  unitsAvailable: string;
  size: string;
  features: string[];
  description: string;
  images: string[];
  ctaPrimary?: string;
  ctaSecondary?: string;
}

interface RoomShowcaseProps {
  room: Room;
}

export default function RoomShowcase({ room }: RoomShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ============================================================================
  // CHECK SCROLL POSITION
  // ============================================================================
  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Update current index based on scroll position
    const imageElements =
      scrollRef.current.querySelectorAll("[data-image-item]");
    let closestIndex = 0;
    let closestDistance = Infinity;

    imageElements.forEach((element, index) => {
      const el = element as HTMLElement;
      const distance = Math.abs(el.offsetLeft - scrollLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setCurrent(closestIndex);
  };

  // ============================================================================
  // SCROLL FUNCTIONS
  // ============================================================================
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  // ============================================================================
  // SCROLL EVENT LISTENER
  // ============================================================================
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        checkScroll();
      }, 100);
    };

    // Initial check
    checkScroll();

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Recheck on window resize
  useEffect(() => {
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <section className="bg-[#EFEBE2] py-20 px-4 md:px-12 overflow-hidden">
      <ul className="space-y-36 sm:space-y-28 lg:space-y-40 xl:space-y-36">
        <li>
          <article className="sm:pr-0 2xl:pl-40 sm:max-w-7xl sm:mx-auto">
            <div className="relative space-y-6 sm:flex sm:gap-10 xl:gap-28 2xl:gap-52 sm:space-y-0 outline-none sm:flex-row-reverse">
              {/* ================================================================ */}
              {/* IMAGE GALLERY SECTION */}
              {/* ================================================================ */}
              <div className="flex-1 rounded-md overflow-hidden">
                <div className="overflow-hidden">
                  <div
                    ref={scrollRef}
                    className="flex -ml-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {room.images.map((src, index) => (
                      <div
                        key={index}
                        data-image-item
                        className="min-w-0 shrink-0 grow-0 pl-4 basis-auto snap-start"
                      >
                        <div className="sm:pl-0 -mr-7 pl-6 sm:mr-0 last:pr-12">
                          <div className="aspect-10/12 w-88 overflow-hidden rounded-md sm:aspect-10/14 sm:w-88 lg:w-112 lg:aspect-10/13">
                            <Image
                              src={src}
                              alt={`${room.title} image ${index + 1}`}
                              width={700}
                              height={900}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              priority={index <= 2}
                              loading={index <= 2 ? "eager" : "lazy"}
                              quality={85}
                              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 448px"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination Dots (Mobile) */}
                <div className="flex justify-center gap-2 mt-6 sm:hidden">
                  {room.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const container = scrollRef.current;
                        if (!container) return;
                        const imageElements =
                          container.querySelectorAll("[data-image-item]");
                        const target = imageElements[index] as HTMLElement;
                        if (target) {
                          target.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "start",
                          });
                        }
                      }}
                      className={`h-2 rounded-full transition-all ${
                        index === current
                          ? "bg-[#B58B38] w-6"
                          : "bg-gray-300 w-2"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* ================================================================ */}
              {/* CONTENT SECTION */}
              {/* ================================================================ */}
              <div className="flex-1 sm:max-w-md lg:max-w-lg">
                <header>
                  <h2 className="text-2xl md:text-4xl font-serif text-[#B58B38] mb-3">
                    {room.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {room.unitsAvailable} | {room.size}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {room.features.map((feature, i) => (
                      <span
                        key={i}
                        className="bg-[#EDE6D8] text-gray-700 px-4 py-2 rounded-md text-[13px]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </header>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm mb-10">
                  {room.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-6 mb-10">
                  <button className="text-[#B58B38] border-b border-[#B58B38] pb-1 hover:text-[#9e7a2f] transition">
                    {room.ctaPrimary || "BOOK NOW"}
                  </button>
                  <button className="text-gray-500 border-b border-transparent hover:border-gray-400 transition pb-1">
                    {room.ctaSecondary || "LEARN MORE"}
                  </button>
                </div>

                {/* Navigation Buttons */}
                <div className="md:block hidden">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={scrollLeft}
                      disabled={!canScrollLeft}
                      className="p-3 sm:p-4 border border-[#D5B984]/30 rounded-xl hover:bg-[#D5B984]/10 transition-all text-[#D5B984] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      aria-label="Previous Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 sm:w-7 sm:h-7"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={scrollRight}
                      disabled={!canScrollRight}
                      className="p-3 sm:p-4 border border-[#D5B984]/30 rounded-xl hover:bg-[#D5B984]/10 transition-all text-[#D5B984] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      aria-label="Next Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 sm:w-7 sm:h-7"
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
          </article>
        </li>
      </ul>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>
    </section>
  );
}

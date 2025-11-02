"use client";

import { useState } from "react";
import data from "@/data/testimonials.json";

export default function TestimonialsSection() {
  const testimonials = data.testimonials;
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  const prevDisabled = current === 0;
  const nextDisabled = current === total - 1;

  const handlePrev = () => {
    if (!prevDisabled) setCurrent((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!nextDisabled) setCurrent((prev) => prev + 1);
  };

  return (
    <section className="text-[#3B4D41] py-20 px-6 md:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#C69C4D] mb-4">
              {data.title}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-[#C69C4D] text-sm">
              {data.reviews.map((review) => (
                <div key={review.source} className="flex items-center gap-1">
                  <span>{review.rating}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1">
                    / {review.count} {review.source} Reviews
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              onClick={handlePrev}
              disabled={prevDisabled}
              className={`flex items-center justify-center border border-[#C69C4D] rounded-lg h-18 w-18 transition-all duration-300 ${
                prevDisabled
                  ? "opacity-30 cursor-not-allowed"
                  : "text-[#C69C4D] hover:bg-[#C69C4D] hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
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
              disabled={nextDisabled}
              className={`flex items-center justify-center border border-[#C69C4D] rounded-lg h-18 w-18 transition-all duration-300 ${
                nextDisabled
                  ? "opacity-30 cursor-not-allowed"
                  : "text-[#C69C4D] hover:bg-[#C69C4D] hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
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

        <hr className="border-[#C69C4D]/40 mb-10" />

        {/* Testimonial Slider */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="min-w-full grid md:grid-cols-2 gap-10 px-2"
              >
                <div>
                  <h3 className="text-lg font-medium">
                    {t.name} <br />
                    <span className="font-normal">{t.location}</span>
                  </h3>
                  <p className="text-sm mt-2">{t.date}</p>
                </div>

                <div className="space-y-4">
                  <p className="italic text-lg leading-relaxed">"{t.short}"</p>
                  <p className="text-base leading-relaxed">{t.full}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

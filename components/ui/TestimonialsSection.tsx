"use client";

import { useState } from "react";
import data from "@/data/testimonials.json";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const testimonial = data.testimonials[current];

  const prevTestimonial = () =>
    setCurrent((prev) =>
      prev === 0 ? data.testimonials.length - 1 : prev - 1
    );

  const nextTestimonial = () =>
    setCurrent((prev) =>
      prev === data.testimonials.length - 1 ? 0 : prev + 1
    );

  return (
    <section className="text-[#3B4D41] py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#B68745] mb-4">
              {data.title}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-[#B68745] text-sm">
              {data.reviews.map((review) => (
                <div key={review.source} className="flex items-center gap-1">
                  <span>{review.rating}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
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
              onClick={prevTestimonial}
              className="border border-[#B68745] text-[#B68745] rounded-lg p-3 hover:bg-[#B68745] hover:text-white transition"
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
              onClick={nextTestimonial}
              className="border border-[#B68745] text-[#B68745] rounded-lg p-3 hover:bg-[#B68745] hover:text-white transition"
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

        <hr className="border-[#B68745]/40 mb-10" />

        {/* Testimonial Content */}
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-medium">
              {testimonial.name} <br />
              <span className="font-normal">{testimonial.location}</span>
            </h3>
            <p className="text-sm mt-2">{testimonial.date}</p>
          </div>

          <div className="space-y-4">
            <p className="italic text-lg leading-relaxed">
              "{testimonial.short}"
            </p>
            <p className="text-base leading-relaxed">{testimonial.full}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import  { useState } from "react";
import Image from "next/image";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";

interface PackageInclusion {
  icon: string;
  text: string;
}

interface Package {
  id: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  duration: string;
  price: {
    amount: number;
    currency: string;
    per: string;
  };
  image: string;
  imageAlt: string;
  inclusions: PackageInclusion[];
  highlights: string[];
  cta: {
    text: string;
    link: string;
  };
  featured?: boolean;
}

interface PackagesData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  };
  categories: string[];
  packages: Package[];
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function PackagesPage({ data }: { data: PackagesData }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [ref, hasEntered] = useViewportEnter({ threshold: 0.1 });

  // Filter packages by category
  const filteredPackages =
    selectedCategory === "All"
      ? data.packages
      : data.packages.filter((pkg) => pkg.category === selectedCategory);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={data.hero.image}
            alt="Ulaman Packages"
            fill
            priority
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl text-center space-y-6">
            <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-white/90 font-light">
              {data.hero.subtitle}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-tight">
              {data.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
              {data.hero.description}
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
            <span className="text-xs tracking-widest uppercase">Explore</span>
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
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {["All", ...data.categories].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => (
              <PackageCard key={pkg.id} package={pkg} index={index} />
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg">
                No packages found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ref}
        className={`py-20 sm:py-24 lg:py-32 bg-stone-900 transition-all duration-1000 ${
          hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white">
            Not Sure Which Package to Choose?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Our team is here to help you create the perfect experience tailored
            to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors duration-300 tracking-wider uppercase text-sm font-medium"
            >
              Contact Us
            </a>
            <a
              href="tel:+62361234567"
              className="inline-block px-8 py-4 border border-white text-white hover:bg-white hover:text-stone-900 transition-colors duration-300 tracking-wider uppercase text-sm font-medium"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// PACKAGE CARD COMPONENT
// ============================================================================

function PackageCard({
  package: pkg,
  index,
}: {
  package: Package;
  index: number;
}) {
  const [ref, hasEntered] = useViewportEnter({ threshold: 0.2 });
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article
      ref={ref}
      className={`group bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ${
        hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-200">
        <Image
          src={pkg.image}
          alt={pkg.imageAlt}
          fill
          className={`object-cover group-hover:scale-110 transition-all duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setImageLoaded(true)}
        />
        {pkg.featured && (
          <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 text-xs tracking-wider uppercase font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category Badge */}
        <div className="text-xs tracking-widest uppercase text-stone-500">
          {pkg.category}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-serif text-stone-900 mb-2">
            {pkg.name}
          </h3>
          <p className="text-sm text-amber-700 font-medium">{pkg.tagline}</p>
        </div>

        {/* Description */}
        <p className="text-stone-600 leading-relaxed line-clamp-3">
          {pkg.description}
        </p>

        {/* Highlights */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <ul className="space-y-2">
            {pkg.highlights.slice(0, 3).map((highlight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-stone-600"
              >
                <svg
                  className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Price & Duration */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <div>
            <div className="text-xs text-stone-500 uppercase tracking-wider">
              Duration
            </div>
            <div className="text-sm font-medium text-stone-900">
              {pkg.duration}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-stone-500 uppercase tracking-wider">
              From
            </div>
            <div className="text-2xl font-serif text-amber-700">
              {pkg.price.currency}
              {pkg.price.amount.toLocaleString()}
            </div>
            <div className="text-xs text-stone-500">{pkg.price.per}</div>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href={pkg.cta.link}
          className="block w-full py-3 text-center bg-stone-900 text-white hover:bg-stone-800 transition-colors duration-300 tracking-wider uppercase text-sm font-medium"
        >
          {pkg.cta.text}
        </a>
      </div>
    </article>
  );
}

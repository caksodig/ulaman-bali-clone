"use client";

import AnimatedLink from "@/components/ui/animated-link";
import data from "@/data/retreats/cta.json";

interface CallToActionSectionProps {
  pageKey: keyof typeof data;
}

export default function CallToActionSection({
  pageKey,
}: CallToActionSectionProps) {
  const section = data[pageKey];

  if (!section) return null;

  return (
    <section className="pb-24 text-center my-12">
      <div className="max-w-125 lg:max-w-160 mx-auto px-32">
        <h2 className="text-xl md:text-3xl font-normal text-[#C69C4D] mb-6 leading-relaxed">
          {section.message}
        </h2>
        <AnimatedLink
          href={section.ctaLink}
          className="uppercase tracking-wide text-sm font-medium"
        >
          {section.ctaText}
        </AnimatedLink>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

interface RetreatIntroProps {
  title: string;
  description: string;
}

export const RetreatIntro = ({ title, description }: RetreatIntroProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      className={`text-center py-28 px-6 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="space-y-em sm:w-fit sm:mx-auto sm:text-center max-w-152 xl:max-w-176">
        <h2 className="text-2xl md:text-3xl font-serif text-[#B68745] mb-8 leading-snug">
          {title}
        </h2>
        <p className="text-sm md:text-base text-stone-700 leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
};

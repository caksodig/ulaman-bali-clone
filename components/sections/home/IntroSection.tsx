"use client";
import { useEffect, useRef, useState } from "react";
import LazySection from "@/components/ui/LazySection";

interface IntroData {
  title: string;
}

interface IntroSectionProps {
  data: IntroData;
}

export default function IntroSection({ data }: IntroSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visible = 1 - Math.min(Math.max(rect.top / windowHeight, 0), 1);
      targetProgress.current = visible;
    };

    const smoothUpdate = () => {
      // Linear interpolation untuk smoothing
      setProgress((prev) => prev + (targetProgress.current - prev) * 0.5);
      rafId = requestAnimationFrame(smoothUpdate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    smoothUpdate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const chars = data.title.split("");

  return (
    <LazySection
      animationType="fade"
      threshold={0.1}
      className="relative py-32 overflow-hidden bg-[#EFEBE2]"
    >
      <div
        ref={ref}
        className="max-w-152 sm:space-y-6 lg:space-y-5 md:max-w-176 mx-auto max-h-screen px-6 lg:px-16"
      >
        <h1 className="flex justify-center flex-wrap">
          {chars.map((char, i) => {
            const ratio = i / chars.length;
            const active = progress > ratio;
            return (
              <span
                key={i}
                className={`transition-colors duration-500 text-3xl md:text-2xl lg:text-4xl tracking-normal ${
                  active ? "text-[#C69C4D]" : "text-stone-400"
                }`}
                style={{
                  transitionTimingFunction: "ease-in-out",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </h1>
      </div>
    </LazySection>
  );
}

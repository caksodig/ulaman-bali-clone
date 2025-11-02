"use client";
import { useEffect, useRef } from "react";

interface TimelineLineProps {
  /** Warna garis */
  strokeColor?: string;
  /** Lebar garis fallback span (mobile) */
  lineWidth?: string;
  /** Durasi animasi scroll (ms) */
  animationDuration?: number;
}

export default function TimelineLine({
  strokeColor = "#c39132",
  lineWidth = "3.5px",
  animationDuration = 800,
}: TimelineLineProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    const span = spanRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);

      const drawLength = length * progress;
      path.style.strokeDashoffset = `${length - drawLength}`;

      // fallback line scale (mobile)
      if (span) {
        span.style.transform = `translate3d(-1.75px,0,0) scale(1,${progress})`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* MOBILE/TABLET fallback line */}
      <span
        ref={spanRef}
        className="absolute w-[3.5px] inset-y-0 left-1/2 -translate-x-1/2 bg-[#c39132] origin-top rounded-t-full rounded-b-full xl:hidden"
        style={{
          transform: "translate3d(-1.75px,0,0) scale(1,0)",
          transition: `transform ${animationDuration}ms ease-out`,
          width: lineWidth,
        }}
      />

      {/* DESKTOP SVG PATH */}
      <svg
        id="line_1"
        data-name="line 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 805.391 640.71"
        className="rotate-180 hidden absolute inset-y-0 left-1/2 -translate-x-1/2 xl:block"
      >
        <path
          ref={pathRef}
          id="Path_5094"
          data-name="Path 5094"
          d="M1,1c.037,13.215.245,31.873,1.023,54.227,2.8,80.5,7.314,97.773,15.512,112.756C31.294,193.129,51.86,206.967,63,214.458c111,74.678,277.031-11.49,322.566,50.059,19.926,26.934,19.051,85.227,18.46,124.57-.151,10.083-.675,18.476-1.133,24.336"
          transform="translate(0.377 0.289)"
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </svg>
    </>
  );
}

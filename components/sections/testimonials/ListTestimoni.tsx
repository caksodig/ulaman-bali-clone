"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import testimonials from "@/data/testimonials/testimonials2.json";

type Testimonial = {
  id: number;
  name: string;
  quote: string;
  videoSrc: string;
  poster: string;
  caption: string;
};

export default function ListTestimoni() {
  return (
    <section className="px-6 lg:my-32 lg:mx-8 lg:px-32">
      <ul className="space-y-24 sm:space-y-36 xl:flex xl:space-y-0 xl:justify-between flex-wrap">
        {testimonials.map((item: Testimonial) => (
          <li key={item.id} className="xl:w-min group">
            <TestimonialCard data={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TestimonialCard({ data }: { data: Testimonial }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <article className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-x-5 lg:gap-x-7 xl:gap-5 xl:w-[34.6rem]">
      <figure className="w-full sm:w-1/2 relative">
        <div
          className="relative group cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            playsInline
            loop
            poster={data.poster}
            preload="auto"
            className="w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:brightness-90"
          >
            <source src={data.videoSrc} type="video/webm" />
          </video>

          {/* Overlay Hover Text */}
          <div
            className={clsx(
              "absolute inset-0 flex items-center justify-center rounded-lg text-white text-sm md:text-base font-medium backdrop-blur-[2px] bg-black/30 opacity-0 transition-opacity duration-300",
              isHovering && "opacity-100"
            )}
          >
            {isPlaying ? "Pause Video" : "Play Video"}
          </div>
        </div>

        <figcaption className="text-sm pt-4 sm:pt-0 xl:pt-4 top-full opacity-40 sm:absolute">
          {data.caption}
        </figcaption>
      </figure>

      <header className="w-full flex flex-col justify-between space-y-5 sm:w-1/2 lg:w-2/5 sm:justify-end">
        <div>
          <h6 className="text-[#C69C4D] text-xs xl:text-sm">
            {String(data.id).padStart(2, "0")}
          </h6>
          <h5 className="text-[#C69C4D] text-2xl sm:text-xl lg:text-4xl">
            {data.name}
          </h5>
        </div>
        <div className="pb-8 sm:pb-0">
          <p>{data.quote}</p>
        </div>
      </header>
    </article>
  );
}

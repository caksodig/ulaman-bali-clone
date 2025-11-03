"use client";
import React from "react";
import Image from "next/image";

interface TestimonialItemProps {
  id: string;
  name: string;
  quote: string;
  caption: string;
  video: {
    src: string;
    poster: string;
  };
  reverse?: boolean;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({
  id,
  name,
  quote,
  caption,
  video,
  reverse = false,
}) => {
  return (
    <li className={reverse ? "group lg:mt-44 group-even:flex-row-reverse" : ""}>
      <article
        className={`flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-x-5 lg:gap-x-7 ${
          reverse ? "sm:flex-row-reverse" : ""
        }`}
      >
        {/* Video Section */}
        <figure className="w-full sm:w-1/2 lg:w-3/5 relative">
          <div className="relative cursor-pointer">
            <div className="lg:max-w-max aspect-[18/10] lg:overflow-hidden rounded-lg">
              <video
                className="w-full h-full object-cover rounded-lg"
                poster={video.poster}
                preload="none"
                controls
              >
                <source src={video.src} type="video/webm" />
                <Image
                  src={video.poster}
                  alt={name}
                  fill
                  className="object-cover rounded-lg"
                />
              </video>
            </div>
          </div>
          <figcaption className="text-sm pt-4 sm:pt-0 xl:pt-4 top-full opacity-40 sm:absolute">
            {caption}
          </figcaption>
        </figure>

        {/* Text Section */}
        <header className="w-full flex flex-col justify-between space-y-5 sm:w-1/2 lg:w-2/5 xl:pl-20 xl:group-even:pr-20 xl:group-even:pl-0">
          <div>
            <h6 className="text-[#C69C4D] text-sm xl:text-xl">{id}</h6>
            <h5 className="text-24 text-[#C69C4D] sm:text-xl lg:text-30">
              {name}
            </h5>
          </div>
          <div className="pb-8 sm:pr-4 xl:p-0">
            <p className="text-base leading-relaxed">{quote}</p>
          </div>
        </header>
      </article>
    </li>
  );
};

export default TestimonialItem;

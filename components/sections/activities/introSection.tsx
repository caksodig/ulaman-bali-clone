"use client";
import React, { memo } from "react";
import activitiesData from "@/data/activities/activities.json";

const IntroSection: React.FC = memo(() => {
  const { title, description } = activitiesData;

  return (
    <section
      className="flex flex-col gap-7 sm:gap-11 lg:flex-row lg:justify-between lg:gap-x-28 px-8 lg:px-32"
      aria-labelledby="intro-title"
    >
      {/* Header Section */}
      <header className="flex-1 sm:max-w-sm lg:max-w-md">
        <div className="space-y-4">
          <h4
            id="intro-title"
            className=" text-2xl lg:text-3xl font-semibold tracking-wide text-[#C69C4D]"
          >
            {title}
          </h4>
        </div>
      </header>

      {/* Content Section */}
      <div className="sm:max-w-lg lg:w-1/2">
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {description.split(" ").map((word, i) => (
              <React.Fragment key={i}>
                {word === "each" ? <em>{word}</em> : word}{" "}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
});

IntroSection.displayName = "IntroSection";
export default IntroSection;

"use client";

import React from "react";
import AnimatedLink from "@/components/ui/animated-link";
import data from "@/data/schedule.json";

export default function WeeklySchedule() {
  const { title, subtitle, days, times, activities, cta } = data;

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-[#B68745] mb-2">{title}</h2>
          <p className="text-lg text-[#4A4A4A]">{subtitle}</p>
        </div>

        {/* Table Grid */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[120px_repeat(7,1fr)] border-t border-[#C7B58A]">
            {/* Days Row */}
            <div></div>
            {days.map((day) => (
              <div
                key={day}
                className="text-center p-8 lg:py-4 font-medium text-[#B68745] border-l border-[#C7B58A]"
              >
                {day}
              </div>
            ))}

            {/* Schedule Rows */}
            {times.map((time) => (
              <React.Fragment key={time}>
                {/* Time Label */}
                <div
                  key={`time-${time}`}
                  className="border-t border-[#C7B58A] py-10 px-3 text-sm font-medium text-[#B68745]"
                >
                  {time}
                </div>

                {/* Schedule Cells */}
                {days.map((day, i) => {
                  const activity = activities.find((a) => a.time === time);
                  return (
                    <div
                      key={`${day}-${time}-${i}`}
                      className="border-t border-l border-[#C7B58A] flex items-center justify-center p-2 lg:p-4"
                    >
                      {activity ? (
                        <div
                          className="w-full text-center text-xs rounded-lg py-6 text-[#2E2E2E]"
                          style={{ backgroundColor: activity.color }}
                        >
                          {activity.activity}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-left">
          <AnimatedLink
            href={cta.href}
            className="uppercase text-sm font-medium"
          >
            {cta.text}
          </AnimatedLink>
        </div>
      </div>
    </section>
  );
}

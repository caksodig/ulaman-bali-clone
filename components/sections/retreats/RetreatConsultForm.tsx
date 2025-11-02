"use client";

import { useEffect, useState } from "react";
import AnimatedLink from "@/components/ui/animated-link";

interface Field {
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface ContactPreference {
  label: string;
  subtext: string;
  options: string[];
}

interface RetreatConsultData {
  title: string;
  description: string;
  fields: Field[];
  contactPreference: ContactPreference;
  buttonText: string;
}

export const RetreatConsultForm = () => {
  const [data, setData] = useState<RetreatConsultData | null>(null);
  const [contactVia, setContactVia] = useState<string[]>([]);

  useEffect(() => {
    import("@/data/retreats/retreatConsult.json").then((module) =>
      setData(module.default)
    );
  }, []);

  const toggleContactVia = (method: string) => {
    setContactVia((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  if (!data) return null;

  const firstColumn = data.fields.slice(0, 2);
  const secondColumn = data.fields.slice(2, 4);

  return (
    <section className="py-20 px-6 md:px-12 text-[#6B5D4D]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* LEFT SIDE */}
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#C69C4D] mb-6">
            {data.title}
          </h2>
          <p className="text-gray-700 leading-relaxed text-base">
            {data.description}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <form className="space-y-6">
          {/* Input Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            {firstColumn.map((field) => (
              <div key={field.label}>
                <label className="block text-sm mb-1 text-gray-500">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full bg-transparent border-b border-[#B68745]/40 focus:border-[#B68745] outline-none py-1 text-sm"
                />
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {secondColumn.map((field) => (
              <div key={field.label}>
                <label className="block text-sm mb-1 text-gray-500">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full bg-transparent border-b border-[#C69C4D]/40 focus:border-[#C69C4D] outline-none py-1 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Contact Preference */}
          <div>
            <p className="text-sm text-[#C69C4D] font-medium mb-2">
              {data.contactPreference.subtext}
            </p>
            <p className="text-sm text-[#C69C4D] font-medium mb-3">
              {data.contactPreference.label}
            </p>
            <div className="flex flex-wrap gap-6">
              {data.contactPreference.options.map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    onClick={() => toggleContactVia(method)}
                    className={`w-4 h-4 rounded-full border border-[#C69C4D] flex items-center justify-center ${
                      contactVia.includes(method)
                        ? "bg-[#C69C4D]"
                        : "bg-transparent"
                    }`}
                  >
                    {contactVia.includes(method) && (
                      <span className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </span>
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <AnimatedLink
            href="/contact"
            className="text-sm font-medium tracking-wide"
          >
            {data.buttonText}
          </AnimatedLink>
        </form>
      </div>
    </section>
  );
};

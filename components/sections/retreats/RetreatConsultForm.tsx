"use client";

import { useState } from "react";

export const RetreatConsultForm = () => {
  const [contactVia, setContactVia] = useState<string[]>([]);

  const toggleContactVia = (method: string) => {
    setContactVia((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  return (
    <section className="bg-[#FDF9F1] py-20 px-6 md:px-12 text-[#6B5D4D]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* LEFT SIDE */}
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#B68745] mb-6">
            Not sure which retreat package suits you best?
          </h2>
          <p className="text-gray-700 leading-relaxed text-base">
            Consult with our Holistic Healing & Wellness Team. Let us know your
            preferences and we’ll contact you.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <form className="space-y-6">
          {/* 2 Columns Inputs */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1 text-gray-500">
                Full name*
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full bg-transparent border-b border-[#B68745]/40 focus:border-[#B68745] outline-none py-1 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-500">
                Email address*
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-[#B68745]/40 focus:border-[#B68745] outline-none py-1 text-sm"
                required
              />
            </div>
          </div>

          {/* 2 Columns Inputs */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1 text-gray-500">
                +1 | Phone number (With country code)
              </label>
              <input
                type="text"
                placeholder="+62 812 3456 7890"
                className="w-full bg-transparent border-b border-[#B68745]/40 focus:border-[#B68745] outline-none py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-500">
                Country of residence
              </label>
              <input
                type="text"
                placeholder="Indonesia"
                className="w-full bg-transparent border-b border-[#B68745]/40 focus:border-[#B68745] outline-none py-1 text-sm"
              />
            </div>
          </div>

          {/* Contact Preference */}
          <div>
            <p className="text-sm text-[#B68745] font-medium mb-2">
              Select as many as needed
            </p>
            <p className="text-sm text-[#B68745] font-medium mb-3">
              Prefer to be contacted via*
            </p>
            <div className="flex flex-wrap gap-6">
              {["Email", "WhatsApp", "Telegram"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    onClick={() => toggleContactVia(method)}
                    className={`w-4 h-4 rounded-full border border-[#B68745] flex items-center justify-center ${
                      contactVia.includes(method)
                        ? "bg-[#B68745]"
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
          <button
            type="submit"
            className="mt-6 text-[#B68745] text-sm font-medium tracking-wide border-b border-[#B68745]/40 hover:border-[#B68745] transition-all"
          >
            CONTINUE
          </button>
        </form>
      </div>
    </section>
  );
};

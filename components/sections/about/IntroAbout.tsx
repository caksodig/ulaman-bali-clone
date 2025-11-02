"use client";

import aboutIntro from "@/data/about/aboutIntro.json";

export default function IntroAbout() {
  const { title, content, highlightWords } = aboutIntro;

  const highlightText = (text: string) => {
    let highlighted = text;
    highlightWords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      highlighted = highlighted.replace(regex, "<em>$1</em>");
    });
    return highlighted;
  };

  return (
    <section className="flex flex-col gap-7 lg:gap-x-28 lg:flex-row lg:justify-between sm:gap-11 px-6 lg:px-9 mt-12">
      <header className="lg:max-w-md flex-1 sm:max-w-sm space-y-4">
        <h3 className="text-[#c69c4d] text-3xl lg:text-[2.1875rem] leading-tight">
          {title}
        </h3>
      </header>

      <div className="sm:max-w-lg lg:w-1/2 space-y-4">
        {content.map((paragraph, i) => (
          <p
            key={i}
            className="leading-relaxed text-[#1d1d1d]"
            dangerouslySetInnerHTML={{ __html: highlightText(paragraph) }}
          />
        ))}
      </div>
    </section>
  );
}

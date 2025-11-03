import headerData from "@/data/testimonials/heroTestimonials.json";

export default function Header() {
  const { title } = headerData;

  return (
    <header className="mt-36 px-8 sm:px-16 lg:px-32 text-center">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <h2 className="text-3xl lg:text-4xl font-semibold leading-snug text-[#C69C4D]">
          <span className="block">{title.line1}</span>
          <span className="block">{title.line2}</span>
        </h2>
      </div>
    </header>
  );
}

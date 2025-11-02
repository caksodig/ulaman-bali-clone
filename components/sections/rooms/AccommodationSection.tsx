import Image from "next/image";
import data from "@/data/rooms/accommodationData.json";

export default function AccommodationSection() {
  return (
    <section className="bg-[#EFEBE2] text-[#C69C4D] py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Text Columns */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-20 mb-20">
          {data.paragraphs.map((text, i) => (
            <p
              key={i}
              className="leading-relaxed text-sm text-[#4a4031]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {data.features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center hover:scale-105 transition-transform duration-500"
            >
              <div className="relative w-20 h-20 mb-4">
                <Image
                  src={feature.icon}
                  alt={feature.label}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base font-light text-[#8C7350]">
                {feature.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

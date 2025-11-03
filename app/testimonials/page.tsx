import { HeroSection } from "@/components/sections/retreats/HeroSection";
import testimonialsData from "@/data/testimonials/hero.json";
import CallToActionSection from "@/components/ui/CallToActionSection";
import Header from "@/components/sections/testimonials/Header";
import testimonials from "@/data/testimonials/testimonials.json";
import TestimonialItem from "@/components/sections/testimonials/TestimonialItem";
import ListTestimoni from "@/components/sections/testimonials/ListTestimoni";

export default function RetreatsPage() {
  const { hero } = testimonialsData;

  return (
    <main className="bg-[#EFEBE2]">
      <HeroSection title={hero.title} image={hero.image} />
      <Header />
      <div className="px-6 lg:mt-32 lg:mx-8 lg:px-32">
        <ul className="space-y-24 sm:space-y-36 xl:space-y-44">
          {testimonials.map((testimonial, index) => (
            <TestimonialItem
              key={testimonial.id}
              {...testimonial}
              reverse={index % 2 !== 0}
            />
          ))}
        </ul>
      </div>
      <ListTestimoni />
      <CallToActionSection pageKey="retreats" />
    </main>
  );
}

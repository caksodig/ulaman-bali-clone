import { HeroSection } from "@/components/sections/retreats/HeroSection";
import testimonialsData from "@/data/testimonials/hero.json";
import CallToActionSection from "@/components/ui/CallToActionSection";

export default function RetreatsPage() {
  const { hero } = testimonialsData;

  return (
    <main className="bg-[#EFEBE2]">
      <HeroSection title={hero.title} image={hero.image} />
      <CallToActionSection pageKey="retreats" />
    </main>
  );
}

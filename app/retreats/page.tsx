import { HeroSection } from "@/components/sections/retreats/HeroSection";
import { RetreatIntro } from "@/components/sections/retreats/RetreatIntro";
import retreatsData from "@/data/retreats/retreats.json";
import { RetreatPrograms } from "@/components/sections/retreats/RetreatPrograms";
import retreatPrograms from "@/data/retreats/retreatPrograms.json";

export default function RetreatsPage() {
  const { hero, intro } = retreatsData;

  return (
    <main className="bg-[#EFEBE2]">
      <HeroSection title={hero.title} image={hero.image} />
      <RetreatIntro title={intro.title} description={intro.description} />
      <RetreatPrograms programs={retreatPrograms} />
    </main>
  );
}

import { HeroSection } from "@/components/sections/packagePage/HeroSection";
import packagesData from "@/data/package-ulaman/packages.json";
import PackageShowcase from "@/components/sections/packagePage/PackageShowcase";

export default function PackageUlamanPage() {
  const { hero } = packagesData;
  return (
    <main>
      <div className="space-y-36 sm:space-y-28 lg:space-y-40 xl:space-y-36">
        <HeroSection title={hero.title} image={hero.image} />
        <PackageShowcase />
      </div>
    </main>
  );
}

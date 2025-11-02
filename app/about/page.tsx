import AboutGallery from "@/components/sections/about/AboutGallery";
import { HeroSection } from "@/components/sections/about/Hero";
import IntroAbout from "@/components/sections/about/IntroAbout";
import TheArt from "@/components/sections/about/theArt";
import heroData from "@/data/about/hero.json";
import GalleryCollection from "@/components/sections/about/GalleryCollection";

export default function AboutPage() {
  const { hero } = heroData;
  return (
    <main>
      <HeroSection title={hero.title} image={hero.image} />
      <IntroAbout />
      <AboutGallery />
      <TheArt />
      <GalleryCollection />
    </main>
  );
}

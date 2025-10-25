// app/page.tsx
import type { Metadata } from "next";
import HeroUlaman from "@/components/sections/home/HeroUlaman";
import IntroSection from "@/components/sections/home/IntroSection";
// import AboutSection from "@/components/sections/AboutSection";
import VillaShowcase from "@/components/sections/home/VillaShowcase";
// import ExperienceSection from "@/components/sections/ExperienceSection";
// import TestimonialSection from "@/components/sections/TestimonialSection";

// Import data
import heroData from "@/data/home/hero-sections.json";
import GallerySection from "@/components/sections/home/GallerySection";
// import villasData from "@/data/villas.json";

// Page-specific metadata
export const metadata: Metadata = {
  title: "Home",
  description:
    "Experience authentic Balinese luxury in harmony with nature at Ulaman Eco Luxury Resort",
  openGraph: {
    title: "Ulaman Eco Luxury Resort | Bali",
    description: "Experience authentic Balinese luxury in harmony with nature",
    images: ["/images/home-og.jpg"],
  },
};

export default function HomePage() {
  // Get hero section data
  const heroSection = heroData.sections.find((s) => s.id === "home-hero");

  if (!heroSection) return <></>;

  const media = heroSection.media as {
    type: string;
    videoType?: string;
    videoId?: string;
    posterUrl?: string;
    imageUrl?: string;
    videoUrl?: string;
  };

  // Build intro data expected by IntroSection (IntroSection expects {tagline,title,description[],stats[]})
  const introRaw = heroData.sections.find((s) => s.id === "intro-hero");

  const introData = introRaw
    ? {
        title: introRaw.title ?? "",
        description: Array.isArray(introRaw.description)
          ? (introRaw.description as string[])
          : introRaw.description
          ? [introRaw.description as string]
          : [],
        // No stats in JSON currently — pass empty array so IntroSection can render safely
        stats: [] as { value: string; label: string }[],
      }
    : undefined;

  const galleryRaw = heroData.sections.find((s) => s.id === "gallery-hero");

  const galleryData = galleryRaw
    ? {
        title: galleryRaw.title ?? "",
        description: galleryRaw.description ?? "",
        images:
          (galleryRaw.media as { type: string; galleryImages: string[] })
            ?.galleryImages ?? [],
        cta: galleryRaw.cta ?? { text: "", link: "" },
        seo: galleryRaw.seo ?? { alt: "", title: "" },
      }
    : undefined;

  return (
    <>
      {/* HERO SECTION - No lazy loading, loads immediately */}
      <HeroUlaman
        title={heroSection.title}
        videoUrl={media.videoUrl}
        videoType={(media.videoType as "native" | "youtube") ?? undefined}
        videoId={media.videoId}
        imageUrl={media.posterUrl ?? media.imageUrl}
      />

      {/* INTRO SECTION - Welcome message */}
      {introData ? <IntroSection data={introData} /> : null}

      {galleryData ? <GallerySection data={galleryData} /> : null}

      {/* ABOUT SECTION - Lazy loaded with fade animation */}
      {/* <AboutSection /> */}

      {/* VILLA SECTION - Lazy loaded with slide-up animation */}
      {(() => {
        const villaHero = heroData.sections.find((s) => s.id === "villa-hero");
        const villas =
          villaHero?.villas?.map((villa: any) => ({
            id: villa.id,
            name: villa.nameImage,
            description: villa.descriptionImage,
            image: villa.imageUrl,
            ctaText: villa.cta?.text,
            ctaLink: villa.cta?.link,
          })) ?? [];
        return <VillaShowcase villas={villas} />;
      })()}

      {/* EXPERIENCE SECTION - Lazy loaded with staggered animation */}
      {/* <ExperienceSection experiences={experiencesData.highlighted} /> */}

      {/* TESTIMONIAL SECTION - Lazy loaded */}
      {/* <TestimonialSection /> */}
    </>
  );
}

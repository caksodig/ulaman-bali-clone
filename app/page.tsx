import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CallToActionSection from "@/components/ui/CallToActionSection";

// Components - Critical above fold
import HeroUlaman from "@/components/sections/home/HeroUlaman";
import IntroSection from "@/components/sections/home/IntroSection";

// Components - Lazy loaded below fold
const VillaShowcase = dynamic(
  () => import("@/components/sections/home/VillaShowcase"),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-stone-50 animate-pulse" />,
  }
);

const CircularReveal = dynamic(() => import("@/components/ui/circural"), {
  ssr: true,
});

const GallerySection = dynamic(
  () => import("@/components/sections/home/GallerySection"),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-white animate-pulse" />,
  }
);

const ExperienceGrid = dynamic(
  () => import("@/components/sections/home/ExperienceSection"),
  {
    ssr: true,
    loading: () => <div className="h-96 bg-stone-50 animate-pulse" />,
  }
);

// Data
import heroData from "@/data/home/hero-sections.json";

// Utilities
import {
  getSectionById,
  transformIntroData,
  transformGalleryData,
  transformVillaData,
  transformExperienceData,
  extractMediaData,
  getFallbackHeroData,
} from "@/lib/dataTransFormers";

// Metadata
export const metadata: Metadata = {
  title: "Ulaman Eco Luxury Resort | Bali Private Villas",
  description:
    "Experience authentic Balinese luxury in harmony with nature at Ulaman Eco Luxury Resort. Private eco-villas, infinity pools, and curated cultural experiences in Ubud.",
  keywords: [
    "Bali resort",
    "eco luxury",
    "private villa",
    "Ubud",
    "sustainable tourism",
  ],
  openGraph: {
    title: "Ulaman Eco Luxury Resort | Bali",
    description: "Experience authentic Balinese luxury in harmony with nature",
    images: ["/images/home-og.jpg"],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ulaman Eco Luxury Resort | Bali",
    description: "Experience authentic Balinese luxury in harmony with nature",
    images: ["/images/twitter-home.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

// Main Component
export default function HomePage() {
  // Get sections
  const sections = heroData.sections;
  const heroSection = getSectionById(sections, "home-hero");
  const introSection = getSectionById(sections, "intro-hero");
  const gallerySection = getSectionById(sections, "gallery-hero");
  const villaSection = getSectionById(sections, "villa-hero");
  const experienceSection = getSectionById(sections, "experience-hero");

  // Get hero data with fallback
  const media = extractMediaData(heroSection);
  const heroProps = heroSection
    ? {
        title: heroSection.title,
        description:
          typeof heroSection.description === "string"
            ? heroSection.description
            : undefined,
        logoUrl: "/logo.svg",
        videoType: media?.videoType,
        videoUrl: media?.videoUrl,
        videoId: media?.videoId,
        imageUrl: media?.imageUrl,
        ctaText: heroSection.cta?.text,
        ctaLink: heroSection.cta?.link,
      }
    : getFallbackHeroData();

  // Transform data
  const introData = transformIntroData(introSection);
  const galleryData = transformGalleryData(gallerySection);
  const villaData = transformVillaData(villaSection);
  const experienceData = transformExperienceData(experienceSection);

  return (
    <>
      {/* HERO SECTION - Critical, loads immediately */}
      <HeroUlaman {...heroProps} />

      {/* INTRO SECTION - Above fold */}
      {introData && <IntroSection data={introData} />}

      {/* GALLERY SECTION - Lazy loaded */}
      {galleryData && galleryData.images.length > 0 && (
        <GallerySection data={galleryData} />
      )}

      {/* VILLA SHOWCASE - Lazy loaded */}
      {villaData.length > 0 && (
        <VillaShowcase
          villas={villaData}
          title="Discover cozy elegance, where tranquility meets Bali's serene beauty."
        />
      )}

      {/* CIRCULAR REVEAL SECTION - Stunning scroll animation */}
      <CircularReveal
        title="Experience a blend of nature, comfort and luxury like never before."
        cta={{
          text: "BOOK YOUR STAY",
          link: "/reservations",
        }}
        image="/circular.avif"
        backgroundColor="#E8E4DC"
        textColor="#C69C4D"
        scrollHeight={200}
      >
        {/* EXPERIENCE GRID - Lazy loaded */}
        {experienceData.length > 0 && (
          <ExperienceGrid
            experiences={experienceData}
            title="Book one of our special packages for a getaway you'll never forget."
          />
        )}
      </CircularReveal>
      <CallToActionSection pageKey="home" />
    </>
  );
}

// ISR Configuration - Revalidate every hour
export const revalidate = 3600;

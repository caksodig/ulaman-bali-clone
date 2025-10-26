// // app/page.tsx
// import type { Metadata } from "next";
// import HeroUlaman from "@/components/sections/home/HeroUlaman";
// import IntroSection from "@/components/sections/home/IntroSection";
// import VillaShowcase from "@/components/sections/home/VillaShowcase";
// import ExperienceSection from "@/components/sections/home/ExperienceSection";

// // Import data
// import heroData from "@/data/home/hero-sections.json";
// import GallerySection from "@/components/sections/home/GallerySection";

// // Page-specific metadata
// export const metadata: Metadata = {
//   title: "Home",
//   description:
//     "Experience authentic Balinese luxury in harmony with nature at Ulaman Eco Luxury Resort",
//   openGraph: {
//     title: "Ulaman Eco Luxury Resort | Bali",
//     description: "Experience authentic Balinese luxury in harmony with nature",
//     images: ["/images/home-og.jpg"],
//   },
// };

// export default function HomePage() {
//   // Get hero section data
//   const heroSection = heroData.sections.find((s) => s.id === "home-hero");

//   if (!heroSection) return <></>;

//   const media = heroSection.media as {
//     type: string;
//     videoType?: string;
//     videoId?: string;
//     posterUrl?: string;
//     imageUrl?: string;
//     videoUrl?: string;
//   };

//   // Build intro data expected by IntroSection (IntroSection expects {tagline,title,description[],stats[]})
//   const introRaw = heroData.sections.find((s) => s.id === "intro-hero");

//   const introData = introRaw
//     ? {
//         title: introRaw.title ?? "",
//         description: Array.isArray(introRaw.description)
//           ? (introRaw.description as string[])
//           : introRaw.description
//           ? [introRaw.description as string]
//           : [],
//         // No stats in JSON currently — pass empty array so IntroSection can render safely
//         stats: [] as { value: string; label: string }[],
//       }
//     : undefined;

//   const galleryRaw = heroData.sections.find((s) => s.id === "gallery-hero");

//   const galleryData = galleryRaw
//     ? {
//         title: galleryRaw.title ?? "",
//         description: galleryRaw.description ?? "",
//         images:
//           (galleryRaw.media as { type: string; galleryImages: string[] })
//             ?.galleryImages ?? [],
//         cta: galleryRaw.cta ?? { text: "", link: "" },
//         seo: galleryRaw.seo ?? { alt: "", title: "" },
//       }
//     : undefined;

//   return (
//     <>
//       {/* HERO SECTION - No lazy loading, loads immediately */}
//       <HeroUlaman
//         title={heroSection.title}
//         videoUrl={media.videoUrl}
//         videoType={(media.videoType as "native" | "youtube") ?? undefined}
//         videoId={media.videoId}
//         imageUrl={media.posterUrl ?? media.imageUrl}
//       />

//       {/* INTRO SECTION - Welcome message */}
//       {introData ? <IntroSection data={introData} /> : null}

//       {galleryData ? <GallerySection data={galleryData} /> : null}

//       {/* VILLA SECTION - Lazy loaded with slide-up animation */}
//       {(() => {
//         const villaHero = heroData.sections.find((s) => s.id === "villa-hero");
//         const villas =
//           villaHero?.villas?.map((villa: any) => ({
//             id: villa.id,
//             name: villa.nameImage,
//             description: villa.descriptionImage,
//             image: villa.imageUrl,
//             ctaText: villa.cta?.text,
//             ctaLink: villa.cta?.link,
//           })) ?? [];
//         return <VillaShowcase villas={villas} />;
//       })()}

//       {/* EXPERIENCE SECTION - Lazy loaded with staggered animation */}
//       <ExperienceSection experiences={experiencesData.highlighted} />

//     </>
//   );
// }

// app/page.tsx - Optimized & Type-Safe Homepage
import type { Metadata } from "next";
import dynamic from "next/dynamic";

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

      {/* EXPERIENCE GRID - Lazy loaded */}
      {experienceData.length > 0 && (
        <ExperienceGrid
          experiences={experienceData}
          title="Book one of our special packages for a getaway you'll never forget."
        />
      )}
    </>
  );
}

// ISR Configuration - Revalidate every hour
export const revalidate = 3600;

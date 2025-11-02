import type { Metadata } from "next";
import dynamic from "next/dynamic";
import CallToActionSection from "@/components/ui/CallToActionSection";


// ============================================================================
// CRITICAL - ABOVE THE FOLD (Load Immediately)
// ============================================================================
import HeroUlaman from "@/components/sections/home/HeroUlaman";
import IntroSection from "@/components/sections/home/IntroSection";

// ============================================================================
// LAZY LOADED - BELOW THE FOLD
// ============================================================================

const VillaShowcase = dynamic(
  () => import("@/components/sections/home/VillaShowcase"),
  {
    loading: () => <div className="h-screen bg-[#EFEBE2] animate-pulse" />,
  }
);

const CircularReveal = dynamic(() => import("@/components/ui/circural"), {
  loading: () => <div className="h-screen bg-[#E8E4DC]" />,
});

const GallerySection = dynamic(
  () => import("@/components/sections/home/GallerySection"),
  {
    loading: () => <div className="h-screen bg-[#EFEBE2] animate-pulse" />,
  }
);

const ExperienceGrid = dynamic(
  () => import("@/components/sections/home/ExperienceSection"),
  {
    loading: () => <div className="h-screen bg-[#EFEBE2] animate-pulse" />,
  }
);

const VideoRevealSection = dynamic(
  () => import("@/components/ui/VideoReveral"),
  {
    loading: () => <div className="h-screen bg-[#EFEBE2] animate-pulse" />,
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/ui/TestimonialsSection"),
  {
    loading: () => <div className="h-96 bg-white animate-pulse" />,
  }
);

const InteractiveMap = dynamic(() => import("@/components/ui/InteractiveMap"), {
  loading: () => <div className="h-screen bg-[#E8E4DC] animate-pulse" />,
});

const WeeklySchedule = dynamic(() => import("@/components/ui/WeeklySchedule"), {
  loading: () => <div className="h-96 bg-[#EFEBE2] animate-pulse" />,
});

// ============================================================================
// DATA & UTILITIES
// ============================================================================
import heroData from "@/data/home/hero-sections.json";
import {
  getSectionById,
  transformIntroData,
  transformGalleryData,
  transformVillaData,
  transformExperienceData,
  extractMediaData,
  getFallbackHeroData,
} from "@/lib/dataTransFormers";
import TiraiSection from "@/components/ui/TiraiSection";

// ============================================================================
// METADATA
// ============================================================================
export const metadata: Metadata = {
  title: "Ulaman Eco Luxury Resort | Bali Private Villas & Eco Resort",
  description:
    "Experience authentic Balinese luxury in harmony with nature at Ulaman Eco Luxury Resort. Private eco-villas, infinity pools, and curated cultural experiences in Ubud, Bali.",
  keywords: [
    "Bali resort",
    "eco luxury resort Bali",
    "private villa Ubud",
    "Ubud luxury resort",
    "sustainable tourism Bali",
    "eco villas Bali",
    "Ulaman resort",
    "Bali honeymoon resort",
  ],
  openGraph: {
    title: "Ulaman Eco Luxury Resort | Bali Private Villas",
    description:
      "Experience authentic Balinese luxury in harmony with nature. Private eco-villas with infinity pools in the heart of Ubud.",
    images: [
      {
        url: "/images/home-og.jpg",
        width: 1200,
        height: 630,
        alt: "Ulaman Eco Luxury Resort - Bali",
      },
    ],
    type: "website",
    locale: "en_US",
    siteName: "Ulaman Eco Luxury Resort",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ulaman Eco Luxury Resort | Bali",
    description: "Experience authentic Balinese luxury in harmony with nature",
    images: ["/images/twitter-home.jpg"],
  },
  alternates: {
    canonical: "https://ulamanresort.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ============================================================================
// JSON-LD STRUCTURED DATA
// ============================================================================
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Resort",
  name: "Ulaman Eco Luxury Resort",
  description:
    "Experience authentic Balinese luxury in harmony with nature at Ulaman Eco Luxury Resort.",
  image: "/images/home-og.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Raya Keliki",
    addressLocality: "Ubud",
    addressRegion: "Bali",
    postalCode: "80571",
    addressCountry: "ID",
  },
  priceRange: "$$",
  starRating: {
    "@type": "Rating",
    ratingValue: "5",
  },
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Infinity Pool",
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Spa",
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Restaurant",
    },
  ],
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function HomePage() {
  // Get sections
  const sections = heroData.sections;
  const heroSection = getSectionById(sections, "home-hero");
  const introSection = getSectionById(sections, "intro-hero");
  const gallerySection = getSectionById(sections, "gallery-hero");
  const villaSection = getSectionById(sections, "villa-hero");
  const experienceSection = getSectionById(sections, "experience-hero");

  // Transform hero data
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
        showPosterModal: false,
      }
    : getFallbackHeroData();

  // Transform section data
  const introData = transformIntroData(introSection);
  const galleryData = transformGalleryData(gallerySection);
  const villaData = transformVillaData(villaSection);
  const experienceData = transformExperienceData(experienceSection);

  // Map hotspots data
  const mapHotspots = [
    {
      id: "villa-1",
      name: "Pool Villa",
      description: "Luxury private villa with infinity pool",
      icon: "villa" as const,
      position: { x: 30, y: 45 },
      link: "/villas/pool-villa",
    },
    {
      id: "restaurant",
      name: "Main Restaurant",
      description: "Fine dining with panoramic views",
      icon: "restaurant" as const,
      position: { x: 50, y: 35 },
      link: "/dining",
    },
    {
      id: "spa",
      name: "Spa & Wellness",
      description: "Traditional Balinese spa treatments",
      icon: "spa" as const,
      position: { x: 70, y: 50 },
      link: "/spa",
    },
  ];

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ================================================================ */}
      {/* ABOVE THE FOLD - Critical Path */}
      {/* ================================================================ */}

      <HeroUlaman
        title="Ulaman Eco Luxury Resort"
        posterUrl="/image/new-figure.avif"
        videoType="youtube"
        videoId="7moIJ0LIwPc"
        showPosterModal={true}
      />

      {introData && <IntroSection data={introData} />}

      {/* ================================================================ */}
      {/* BELOW THE FOLD - Lazy Loaded */}
      {/* ================================================================ */}

      {galleryData && galleryData.images.length > 0 && (
        <GallerySection data={galleryData} />
      )}

      {villaData.length > 0 && (
        <VillaShowcase
          villas={villaData}
          title="Discover cozy elegance, where tranquility meets Bali's serene beauty."
        />
      )}

      {/* ================================================================ */}
      {/* CIRCULAR REVEAL WITH EXPERIENCE SECTION */}
      {/* ================================================================ */}

      <CircularReveal
        title="Experience a blend of nature, comfort and luxury like never before."
        cta={{
          text: "BOOK YOUR STAY",
          link: "/reservations",
        }}
        image="/circular.avif"
        backgroundColor="#EFEBE2"
        textColor="#C69C4D"
        scrollHeight={150}
      ></CircularReveal>
      {experienceData.length > 0 && (
        <ExperienceGrid
          experiences={experienceData}
          title="Book one of our special packages for a getaway you'll never forget."
        />
      )}

      <TiraiSection
        backgroundColor="#EFEBE2"
        accentColor="#C69C4D"
        textColor="##343e35"
      />

      {/* ================================================================ */}
      {/* VIDEO REVEAL SECTION - Spa Experience */}
      {/* ================================================================ */}

      <VideoRevealSection
        topText="Balance - Relaxation"
        bottomText="Renewal - Healin"
        videoUrl="/videos/spa-experience.webm"
        videoPoster="/image/cover-spa.avif"
        ctaText="VISIT SPA WEBSITE"
        ctaLink="https://riversidespabyulaman.com/"
        backgroundColor="#EFEBE2"
        textColor="#343E35"
        accentColor="#C69C4D"
        preloadVideo={true}
      />

      {/* ================================================================ */}
      {/* ADDITIONAL SECTIONS */}
      {/* ================================================================ */}

      <InteractiveMap
        title="Discover Ulaman from above"
        instruction="Tap on an icon"
        mapImage="/image/ulaman-map.jpg"
        hotspots={mapHotspots}
        backgroundColor="#EFEBE2"
        accentColor="#C69C4D"
      />

      <TestimonialsSection />

      <WeeklySchedule />

      <CallToActionSection pageKey="home" />
    </>
  );
}

// ============================================================================
// ISR CONFIGURATION
// ============================================================================
export const revalidate = 3600;

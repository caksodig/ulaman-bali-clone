import type {
  IntroData,
  GalleryData,
  VillaShowcase,
  ExperienceCard,
} from "@/types/content";

// Generic section data from JSON
interface RawSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string | string[];
  media?: {
    type?: string;
    videoType?: "native" | "youtube";
    videoId?: string;
    videoUrl?: string;
    posterUrl?: string;
    imageUrl?: string;
    galleryImages?: string[];
  };
  cta?: { text: string; link: string };
  seo?: { alt: string; title: string };
  villas?: any[];
  experiences?: any[];
}

/**
 * Get section by ID with type safety
 */
export function getSectionById(sections: any[], id: string): RawSection | null {
  const section = sections.find((s) => s.id === id);
  return section || null;
}

/**
 * Transform raw section data to IntroData format
 */
export function transformIntroData(
  section: RawSection | null
): IntroData | null {
  if (!section) return null;

  return {
    tagline: section.subtitle || "",
    title: section.title || "",
    description: Array.isArray(section.description)
      ? section.description
      : section.description
      ? [section.description]
      : [],
    stats: [],
  };
}

/**
 * Transform raw section data to GalleryData format
 */
export function transformGalleryData(
  section: RawSection | null
): GalleryData | null {
  if (!section || !section.media?.galleryImages) return null;

  return {
    title: section.title || "",
    description:
      typeof section.description === "string" ? section.description : "",
    images: section.media.galleryImages || [],
    cta: section.cta || { text: "View Gallery", link: "/gallery" },
    seo: section.seo || { alt: section.title, title: section.title },
  };
}

/**
 * Transform raw villa data to VillaShowcase format
 */
export function transformVillaData(
  section: RawSection | null
): VillaShowcase[] {
  if (!section?.villas || !Array.isArray(section.villas)) return [];

  return section.villas
    .filter((villa) => villa && villa.id) // Filter invalid entries
    .map((villa) => ({
      id: villa.id,
      title: villa.title || villa.title || "Unnamed Villa",
      name: villa.nameImage || villa.name || "Unnamed Villa",
      description:
        villa.descriptionImage || villa.description || "Luxury villa",
      image: villa.imageUrl || villa.image || "/images/placeholder.jpg",
      ctaText: villa.cta?.text || "DISCOVER",
      ctaLink: villa.cta?.link || `/villa/${villa.id}`,
    }));
}

/**
 * Transform raw experience data to ExperienceCard format
 */
export function transformExperienceData(
  section: RawSection | null
): ExperienceCard[] {
  if (!section?.experiences || !Array.isArray(section.experiences)) return [];

  return section.experiences
    .filter((exp) => exp && exp.id) // Filter invalid entries
    .map((exp) => ({
      id: exp.id,
      title: exp.title || "Experience",
      duration: exp.duration || "1 Day",
      image: exp.image || "/images/placeholder.jpg",
      ctaText: exp.ctaText || "DISCOVER",
      ctaLink: exp.ctaLink || `/experience/${exp.id}`,
    }));
}

/**
 * Safe array check with fallback
 */
export function ensureArray<T>(data: T | T[] | undefined): T[] {
  if (Array.isArray(data)) return data;
  if (data !== undefined && data !== null) return [data];
  return [];
}

/**
 * Extract media data with type safety
 */
export function extractMediaData(section: RawSection | null) {
  if (!section?.media) return null;

  return {
    type: section.media.type || "image",
    videoType: section.media.videoType,
    videoId: section.media.videoId,
    videoUrl: section.media.videoUrl,
    posterUrl: section.media.posterUrl,
    imageUrl: section.media.imageUrl || section.media.posterUrl,
  };
}

/**
 * Validate section has required data
 */
export function isValidSection(section: any): section is RawSection {
  return (
    section &&
    typeof section === "object" &&
    typeof section.id === "string" &&
    typeof section.title === "string"
  );
}

/**
 * Get fallback data for critical sections
 */
export function getFallbackHeroData() {
  return {
    title: "Ulaman Eco Luxury Resort",
    description: "Experience Balinese luxury in harmony with nature",
    logoUrl: "/logo.svg",
    videoType: undefined,
    videoUrl: undefined,
    videoId: undefined,
    imageUrl: "/images/hero-fallback.jpg",
  };
}

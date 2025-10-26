// types/content.ts
/**
 * Complete type definitions for Ulaman Bali content
 * Generated based on dataTransformers and component requirements
 */

// ============================================
// MEDIA & BASIC TYPES
// ============================================

export type VideoType = "native" | "youtube";

export interface MediaConfig {
  type: "video" | "image" | "gallery";

  // Video configuration
  videoType?: VideoType;
  videoUrl?: string;
  videoId?: string;

  // Image configuration
  posterUrl?: string;
  imageUrl?: string;
  mobileImageUrl?: string;

  // Gallery configuration
  galleryImages?: string[];
}

export interface CTAConfig {
  text: string;
  link: string;
  external?: boolean;
}

export interface SEOConfig {
  alt: string;
  title: string;
  description?: string;
}

// ============================================
// HERO SECTION
// ============================================

export interface HeroSectionData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  logoUrl?: string;
  media: MediaConfig;
  cta?: CTAConfig;
  seo?: SEOConfig;
}

export interface HeroUlamanProps {
  title: string;
  description?: string;
  logoUrl?: string;
  videoUrl?: string;
  videoType?: VideoType;
  videoId?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

// ============================================
// INTRO SECTION
// ============================================

export interface IntroStat {
  value: string;
  label: string;
}

export interface IntroData {
  tagline: string;
  title: string;
  description: string[];
  stats: IntroStat[];
}

export interface IntroSectionProps {
  data: IntroData;
}

// ============================================
// VILLA SECTION
// ============================================

export interface VillaShowcase {
  id: string;
  name: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface VillaShowcaseProps {
  villas: VillaShowcase[];
  title?: string;
  subtitle?: string;
}

// Full villa data (for detail pages)
export interface Villa {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  size: string;
  guests: number;
  bedrooms: number;
  bathrooms?: number;
  image: string;
  gallery?: string[];
  price: string;
  amenities?: string[];
  features?: string[];
  views?: string[];
  available: boolean;
}

// ============================================
// EXPERIENCE SECTION
// ============================================

export interface ExperienceCard {
  id: string;
  title: string;
  duration: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ExperienceGridProps {
  experiences: ExperienceCard[];
  title?: string;
}

// Full experience data (for detail pages)
export interface Experience {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  includes?: string[];
  schedule: string;
  maxGuests: number;
  difficulty: string;
}

// ============================================
// FEATURES SECTION
// ============================================

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesSectionProps {
  features: Feature[];
}

// ============================================
// GALLERY SECTION
// ============================================

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

export interface GalleryData {
  title: string;
  description: string;
  images: string[];
  cta: CTAConfig;
  seo: SEOConfig;
}

export interface GallerySectionProps {
  data: GalleryData;
}

// ============================================
// TESTIMONIAL SECTION
// ============================================

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  date: string;
}

export interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

// ============================================
// LOCATION SECTION
// ============================================

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  title: string;
  address: string;
  phone: string;
  email: string;
  coordinates: LocationCoordinates;
}

export interface LocationSectionProps {
  location: LocationData;
}

// ============================================
// RAW JSON DATA TYPES (from hero-sections.json)
// ============================================

export interface RawMediaData {
  type?: string;
  videoType?: VideoType;
  videoId?: string;
  videoUrl?: string;
  posterUrl?: string;
  imageUrl?: string;
  galleryImages?: string[];
}

export interface RawVillaData {
  id: string;
  name?: string;
  nameImage?: string;
  description?: string;
  descriptionImage?: string;
  image?: string;
  imageUrl?: string;
  cta?: CTAConfig;
}

export interface RawExperienceData {
  id: string;
  title: string;
  duration?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface RawSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string | string[];
  media?: RawMediaData;
  cta?: CTAConfig;
  seo?: SEOConfig;
  villas?: RawVillaData[];
  experiences?: RawExperienceData[];
}

export interface RawHeroData {
  sections: RawSection[];
}

// ============================================
// HOMEPAGE DATA
// ============================================

export interface HomePageData {
  hero: HeroSectionData;
  intro: IntroData;
  villas: VillaShowcase[];
  features: Feature[];
  experiences: ExperienceCard[];
  gallery: GalleryData;
  testimonials: Testimonial[];
  location: LocationData;
}

// ============================================
// UTILITY TYPES
// ============================================

export type SectionId =
  | "home-hero"
  | "intro-hero"
  | "villa-hero"
  | "experience-hero"
  | "gallery-hero"
  | "testimonial-hero"
  | "location-hero";

export type ComponentStatus = "idle" | "loading" | "success" | "error";

export interface LoadingState {
  status: ComponentStatus;
  message?: string;
}

// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavigationData {
  logo: string;
  logoText: string;
  navLinks: NavLink[];
  cta: CTAConfig;
}

// ============================================
// FORM TYPES
// ============================================

export interface NewsletterFormData {
  email: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

export interface BookingFormData {
  villaId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// ============================================
// METADATA TYPES
// ============================================

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface VillaFilters {
  guests?: number;
  bedrooms?: number;
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];
  available?: boolean;
}

export interface ExperienceFilters {
  category?: string;
  duration?: string;
  difficulty?: string;
  priceMin?: number;
  priceMax?: number;
}

// ============================================
// TYPE GUARDS
// ============================================

export function isValidCTA(cta: any): cta is CTAConfig {
  return (
    cta &&
    typeof cta === "object" &&
    typeof cta.text === "string" &&
    typeof cta.link === "string"
  );
}

export function isValidMediaConfig(media: any): media is MediaConfig {
  return media && typeof media === "object" && typeof media.type === "string";
}

export function isValidVilla(villa: any): villa is VillaShowcase {
  return (
    villa &&
    typeof villa === "object" &&
    typeof villa.id === "string" &&
    typeof villa.name === "string" &&
    typeof villa.description === "string" &&
    typeof villa.image === "string"
  );
}

export function isValidExperience(exp: any): exp is ExperienceCard {
  return (
    exp &&
    typeof exp === "object" &&
    typeof exp.id === "string" &&
    typeof exp.title === "string" &&
    typeof exp.duration === "string" &&
    typeof exp.image === "string"
  );
}

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_CTA: CTAConfig = {
  text: "Learn More",
  link: "#",
};

export const DEFAULT_SEO: SEOConfig = {
  alt: "Ulaman Bali",
  title: "Ulaman Eco Luxury Resort",
  description: "Experience authentic Balinese luxury",
};

export const DEFAULT_STAT: IntroStat = {
  value: "0",
  label: "Stat",
};

// ============================================
// EXPORT ALL TYPES
// ============================================

export type {
  MediaConfig as Media,
  CTAConfig as CTA,
  SEOConfig as SEO,
  VillaShowcase as VillaCard,
  ExperienceCard as ExperienceCardType,
  GalleryImage as GalleryImageType,
};

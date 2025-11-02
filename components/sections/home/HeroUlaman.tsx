"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// ============================================================================
// TYPES
// ============================================================================

interface HeroUlamanProps {
  title: string;
  posterUrl: string; // Required - always show poster first
  videoUrl?: string;
  videoType?: "native" | "youtube";
  videoId?: string;
  showPosterModal?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SCROLL_DEBOUNCE_MS = 16; // ~60fps
const FADE_THRESHOLD = 0.5; // 50% of hero height
const YOUTUBE_IFRAME_DELAY = 300; // ms

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HeroUlaman({
  title,
  posterUrl,
  videoUrl,
  videoType = "native",
  videoId,
  showPosterModal = true,
  ctaText = "Book Now",
  ctaLink = "https://www.book-secure.com/?HotelName=ASIAIDHTLUlamanEcoLu&hname=ASIAIDHTLUlamanEcoLu&arrival=2025-11-15&adults1=1&campaignId=41350&accessCode=CAMP-Specialopening&redir=BIZ-so5523q0o4&rt=1761933766&property=idbal31691&code=CAMP-Specialopening&s=results",
}: HeroUlamanProps) {
  // ============================================================================
  // STATE
  // ============================================================================
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [posterModalOpen, setPosterModalOpen] = useState(showPosterModal);
  const [posterImageLoaded, setPosterImageLoaded] = useState(false);

  // ============================================================================
  // REFS
  // ============================================================================
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // YOUTUBE PRECONNECT (Performance Critical)
  // ============================================================================
  useEffect(() => {
    if (videoType !== "youtube" || !videoId) return;

    const preconnectDomains = [
      "https://www.youtube-nocookie.com",
      "https://www.youtube.com",
      "https://i.ytimg.com",
    ];

    const links = preconnectDomains.map((href) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, [videoType, videoId]);

  // ============================================================================
  // SCROLL HANDLER (Debounced & Optimized)
  // ============================================================================
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const heroHeight = heroRef.current?.offsetHeight || 0;
      const fadeThreshold = heroHeight * FADE_THRESHOLD;

      setIsVisible(currentScrollY <= fadeThreshold);
    }, SCROLL_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // ============================================================================
  // VIDEO HANDLERS
  // ============================================================================
  const handleVideoCanPlay = useCallback(() => {
    setVideoReady(true);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setTimeout(() => {
      setVideoReady(true);
    }, YOUTUBE_IFRAME_DELAY);
  }, []);

  // ============================================================================
  // MODAL HANDLERS
  // ============================================================================
  const closePosterModal = useCallback(() => {
    setPosterModalOpen(false);
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const opacity = Math.max(1 - scrollY / 500, 0);
  const translateY = scrollY * 0.5;

  const youtubeEmbedUrl =
    videoType === "youtube" && videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&start=5`
      : null;

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      {/* ================================================================== */}
      {/* HERO SECTION */}
      {/* ================================================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden bg-neutral-900"
      >
        {/* Background Content Container */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            posterModalOpen ? "blur-sm scale-105" : "blur-0 scale-100"
          }`}
        >
          {/* ============================================================ */}
          {/* POSTER IMAGE (Always Primary) */}
          {/* ============================================================ */}
          <div className="absolute inset-0">
            <Image
              src={posterUrl}
              alt={title}
              fill
              priority
              quality={90}
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ${
                posterImageLoaded ? "opacity-100" : "opacity-0"
              } ${videoReady ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setPosterImageLoaded(true)}
            />
          </div>

          {/* ============================================================ */}
          {/* VIDEO LAYER (Appears after poster loads) */}
          {/* ============================================================ */}
          {posterImageLoaded && (
            <>
              {/* Native Video */}
              {videoType === "native" && videoUrl && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onCanPlay={handleVideoCanPlay}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    videoReady ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              )}

              {/* YouTube Embed */}
              {videoType === "youtube" && youtubeEmbedUrl && (
                <iframe
                  src={youtubeEmbedUrl}
                  title={title}
                  onLoad={handleIframeLoad}
                  allow="autoplay; encrypted-media"
                  className={`absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000 ${
                    videoReady ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ border: "none" }}
                />
              )}
            </>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
        </div>

        {/* ============================================================ */}
        {/* LOADING STATE */}
        {/* ============================================================ */}
        {!posterImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#C69C4D]/30 border-t-[#C69C4D] rounded-full animate-spin" />
              <p className="text-white/70 text-sm tracking-wide animate-pulse">
                Loading experience...
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCROLL INDICATOR */}
        {/* ============================================================ */}
        {isVisible && posterImageLoaded && (
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce transition-opacity duration-300"
            style={{ opacity }}
          >
            <div className="flex flex-col items-center gap-2 text-white/80">
              <span className="text-xs tracking-widest uppercase">Scroll</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        )}
      </section>

      {/* ================================================================== */}
      {/* POSTER MODAL */}
      {/* ================================================================== */}
      {posterModalOpen && showPosterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="poster-modal"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closePosterModal}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div className="relative z-50 max-h-[90vh] max-w-[90vw] animate-fadeIn">
            <div className="relative w-full max-w-fit">
              {/* Poster Image */}
              <div className="relative aspect-[10/12.5] max-h-[70vh] rounded-tl-3xl rounded-br-3xl border-4 border-[#C69C4D] shadow-2xl overflow-hidden">
                <Image
                  src={posterUrl}
                  alt={title}
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover"
                  priority
                  quality={95}
                />
              </div>

              {/* Close Button */}
              <button
                onClick={closePosterModal}
                className="absolute -top-4 -right-4 w-12 h-12 flex items-center justify-center text-white bg-[#C69C4D] rounded-full shadow-lg transition-all duration-300 hover:bg-[#b28844] hover:scale-110 hover:rotate-90 focus:outline-none focus:ring-4 focus:ring-[#C69C4D]/50 z-10"
                aria-label="Close poster"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* CTA Button */}
              {ctaText && ctaLink && (
                <div className="absolute -bottom-16 left-0">
                  <a
                    href={ctaLink}
                    className="inline-block rounded-tr-xl rounded-bl-xl border-2 border-[#C69C4D] bg-[#C69C4D] text-white px-8 py-3 font-medium tracking-wide transition-all duration-300 hover:bg-white hover:text-[#C69C4D] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#C69C4D]/50"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ctaText}
                  </a>
                </div>
              )}

              {/* Skip Hint */}
              <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm whitespace-nowrap">
                Click anywhere to continue
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

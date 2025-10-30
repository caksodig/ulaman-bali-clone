"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// ============================================================================
// TYPES
// ============================================================================

interface HeroUlamanProps {
  title: string;
  videoUrl?: string;
  videoType?: "native" | "youtube";
  videoId?: string;
  imageUrl?: string;
  showPosterModal?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HeroUlaman({
  title,
  videoUrl,
  videoType = "native",
  videoId,
  imageUrl,
  showPosterModal = true,
}: HeroUlamanProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [posterOpen, setPosterOpen] = useState(showPosterModal && !!imageUrl);
  const [imageLoaded, setImageLoaded] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // PRECONNECT TO YOUTUBE (Critical Performance Optimization!)
  // ============================================================================

  useEffect(() => {
    if (videoType === "youtube" && videoId) {
      // Preconnect to YouTube domains
      const preconnectLinks = [
        "https://www.youtube-nocookie.com",
        "https://www.youtube.com",
        "https://i.ytimg.com",
      ];

      preconnectLinks.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = href;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      });
    }
  }, [videoType, videoId]);

  // ============================================================================
  // SCROLL HANDLER (DEBOUNCED)
  // ============================================================================

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const heroHeight = heroRef.current?.offsetHeight || 0;
      const fadeThreshold = heroHeight * 0.5;

      setIsVisible(currentScrollY <= fadeThreshold);
    }, 16); // ~60fps
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // ============================================================================
  // VIDEO LOAD HANDLERS
  // ============================================================================

  const handleVideoCanPlay = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleIframeLoad = useCallback(() => {
    // Small delay to ensure YouTube player is ready
    setTimeout(() => {
      setVideoLoaded(true);
    }, 300);
  }, []);

  const handlePosterClose = useCallback(() => {
    setPosterOpen(false);
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const opacity = Math.max(1 - scrollY / 500, 0);
  const translateY = scrollY * 0.5;

  const embedUrl =
    videoType === "youtube" && videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&start=5`
      : null;

  const showBackgroundBlur = posterOpen && showPosterModal;

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
        className="relative w-full h-screen min-h-screen overflow-hidden bg-neutral-900"
      >
        {/* ============================================================== */}
        {/* BACKGROUND VIDEO/IMAGE LAYER */}
        {/* ============================================================== */}
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-500 ${
            showBackgroundBlur ? "blur-sm scale-105" : "blur-0 scale-100"
          }`}
        >
          {/* Fallback Background Image (Always show for instant load) */}
          {imageUrl && (
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                priority
                quality={85}
                className={`object-cover transition-opacity duration-700 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                } ${videoLoaded ? "opacity-0" : "opacity-100"}`}
                sizes="100vw"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}

          {/* Native Video */}
          {videoType === "native" && videoUrl && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={imageUrl}
              onCanPlay={handleVideoCanPlay}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* YouTube Iframe (Load immediately, no delay!) */}
          {videoType === "youtube" && embedUrl && (
            <div className="absolute inset-0 w-full h-full">
              <iframe
                src={embedUrl}
                title={title}
                onLoad={handleIframeLoad}
                allow="autoplay; encrypted-media"
                className={`absolute top-1/2 left-1/2 w-screen h-[56.25vw] min-h-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-700 ${
                  videoLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{ border: "none" }}
              />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
        </div>

        {/* ============================================================== */}
        {/* LOADING INDICATOR */}
        {/* ============================================================== */}
        {!videoLoaded && !imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
            <div className="flex flex-col items-center gap-4">
              {/* Spinner */}
              <div className="w-12 h-12 border-4 border-[#C69C4D]/30 border-t-[#C69C4D] rounded-full animate-spin" />
              {/* Loading Text */}
              <p className="text-white/70 text-sm tracking-wide animate-pulse">
                Loading experience...
              </p>
            </div>
          </div>
        )}

        {/* Scroll Indicator */}
        {isVisible && videoLoaded && (
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce"
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
      {/* POSTER MODAL (Optional) */}
      {/* ================================================================== */}
      {posterOpen && imageUrl && showPosterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="poster-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
            onClick={handlePosterClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div className="relative z-50 flex items-center justify-center max-h-[90vh] max-w-[90vw] animate-fadeIn">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              {/* Poster Image */}
              <div className="relative w-auto h-auto max-h-[85vh] max-w-[85vw] flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt={title}
                  width={800}
                  height={1200}
                  className="object-contain max-h-[85vh]"
                  priority
                  quality={90}
                />
              </div>

              {/* Close Button */}
              <button
                onClick={handlePosterClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white bg-[#C69C4D] rounded-full transition-all duration-300 hover:bg-[#b28844] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C69C4D] z-50"
                aria-label="Close poster"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Optional: "Skip" text hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                Click anywhere to continue
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

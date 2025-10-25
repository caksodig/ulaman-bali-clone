"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroUlamanProps {
  title: string;
  videoUrl?: string;
  videoType?: "native" | "youtube";
  videoId?: string;
  imageUrl?: string;
}

export default function HeroUlaman({
  title,
  videoUrl,
  videoType = "native",
  videoId,
  imageUrl,
}: HeroUlamanProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [posterOpen, setPosterOpen] = useState(true);
  const [backgroundBlur, setBackgroundBlur] = useState(() => posterOpen);
  const heroRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const heroHeight = heroRef.current?.offsetHeight || 0;
      const fadeThreshold = heroHeight * 0.5;

      if (currentScrollY > fadeThreshold) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate dynamic opacity and transform based on scroll
  const opacity = Math.max(1 - scrollY / 500, 0);
  const translateY = scrollY * 0.5;

  // Generate iframe embed URLs
  const getEmbedUrl = () => {
    if (!videoId) return null;

    switch (videoType) {
      case "youtube":
        // YouTube with optimizations: autoplay, mute, loop, no controls, no branding
        return `https://www.youtube-nocookie.com/embed/${videoId}?start=5&autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&start=5`;

      default:
        return null;
    }
  };

  const embedUrl = getEmbedUrl();

  // Lazy load iframe after component mount
  useEffect(() => {
    if (embedUrl) {
      // Delay iframe load slightly for better initial page load
      const timer = setTimeout(() => {
        setIsVideoLoaded(true);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [embedUrl]);

  const handleIframeLoad = () => {
    setIsVideoLoaded(true);
    // remove heavy blur applied while poster was introduced
    setBackgroundBlur(false);
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen h-screen overflow-hidden"
    >
      {/* BACKGROUND LAYER */}
      <div
        // blur background while poster modal is open (controlled by backgroundBlur)
        className={`absolute inset-0 w-full h-full transition-filter duration-300 ${
          backgroundBlur ? "filter blur-sm scale-[1.02]" : ""
        }`}
      >
        {/* NATIVE VIDEO */}
        {videoType === "native" && videoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
            poster={imageUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : null}

        {/* YouTube iframe (only when embedUrl available and loaded) */}
        {videoType === "youtube" && embedUrl && isVideoLoaded ? (
          <div className="absolute inset-0 w-full h-full">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={title}
              onLoad={handleIframeLoad}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute top-1/2 left-1/2 w-screen h-[56.25vw] min-h-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                border: "none",
              }}
            />
          </div>
        ) : null}
      </div>
      {/* POSTER MODAL (popup) */}
      {posterOpen && imageUrl && (
        <div className="fixed inset-0 z-30 flex items-center justify-center px-4">
          {/* translucent backdrop + blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={() => setPosterOpen(false)}
          />

          {/* content */}
          <div className="relative z-40 flex items-center justify-center max-h-[90vh] max-w-[90vw]">
            <div className="relative rounded-lg overflow-hidden shadow-2xl bg-black">
              {/* Responsive image container that adapts to portrait or landscape */}
              <div className="relative w-auto h-auto max-h-[85vh] max-w-[85vw] flex items-center justify-center">
                <Image
                  src={imageUrl}
                  alt={`${title} poster`}
                  width={400}
                  height={700}
                  className="object-cover"
                  priority
                />
              </div>

              {/* close button */}
              <button
                onClick={() => setPosterOpen(false)}
                className="absolute top-4 right-16 text-white bg-[#C69C4D] rounded-full p-2 transition z-50"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

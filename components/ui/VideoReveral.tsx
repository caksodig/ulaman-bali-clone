"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================================
// TYPES
// ============================================================================

interface VideoRevealSectionProps {
  topText: string;
  bottomText: string;
  videoUrl: string;
  videoPoster?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  preloadVideo?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function VideoRevealSection({
  topText = "Balance - Relaxation",
  bottomText = "Renewal - Healing",
  videoUrl,
  videoPoster,
  ctaText,
  ctaLink,
  backgroundColor = "#EFEBE2",
  textColor = "#343E35",
  accentColor = "#C69C4D",
  preloadVideo = true,
}: VideoRevealSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const isPlayingRef = useRef(false);

  // ============================================================================
  // VIDEO PRELOADING & READY STATE
  // ============================================================================

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      setIsVideoReady(true);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplaythrough", handleCanPlayThrough);

    // Preload video metadata on component mount
    if (preloadVideo) {
      video.load();
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [videoUrl, preloadVideo]);

  // ============================================================================
  // SCROLL ANIMATION (Optimized with throttling)
  // ============================================================================

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = rect.height;

    const startPoint = windowHeight;
    const endPoint = windowHeight / 2 - sectionHeight / 2;

    let progress = 0;
    if (sectionTop < startPoint && sectionTop > endPoint) {
      progress = (startPoint - sectionTop) / (startPoint - endPoint);
      progress = Math.max(0, Math.min(1, progress));
    } else if (sectionTop <= endPoint) {
      progress = 1;
    }

    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        handleScroll();
        rafRef.current = 0;
      });
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", scrollListener);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  // ============================================================================
  // VIDEO CONTROLS (Optimized)
  // ============================================================================

  const handlePlayVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || isPlayingRef.current) return;

    try {
      setIsLoading(true);
      isPlayingRef.current = true;

      // Reset video to start if it ended
      if (video.ended) {
        video.currentTime = 0;
      }

      // Wait for video to be ready
      if (video.readyState < 3) {
        await new Promise((resolve) => {
          const onCanPlay = () => {
            video.removeEventListener("canplay", onCanPlay);
            resolve(null);
          };
          video.addEventListener("canplay", onCanPlay);
          video.load();
        });
      }

      await video.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error playing video:", error);
      setIsPlaying(false);
      setIsLoading(false);
      isPlayingRef.current = false;
    }
  }, []);

  const handlePauseVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  const handleStopVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const topTextTransform = `translate3d(${scrollProgress * 100}vw, 0, 0)`;
  const bottomTextTransform = `translate3d(-${scrollProgress * 100}vw, 0, 0)`;

  const videoSize = isPlaying
    ? { width: "80vw", height: "80vh", maxWidth: "1200px", maxHeight: "675px" }
    : {
        width: "min(70vw, 600px)",
        height: "min(70vw, 600px)",
        maxWidth: "600px",
        maxHeight: "600px",
      };

  const borderRadius = isPlaying ? "16px" : "50%";

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* ANIMATED TEXT LAYERS */}
      <div
        className="absolute top-1 left-0 pointer-events-none z-10 will-change-transform"
        style={{ transform: topTextTransform }}
      >
        <h2
          className="text-[20vw] md:text-[15vw] font-light whitespace-nowrap opacity-20"
          style={{ color: textColor }}
        >
          {topText}
        </h2>
      </div>

      <div
        className="absolute bottom-1 right-0 pointer-events-none z-10 will-change-transform"
        style={{ transform: bottomTextTransform }}
      >
        <h2
          className="text-[20vw] md:text-[15vw] font-light whitespace-nowrap opacity-20"
          style={{ color: textColor }}
        >
          {bottomText}
        </h2>
      </div>

      {/* VIDEO CONTAINER */}
      <div
        className="relative z-20 flex items-center justify-center"
        onMouseEnter={() => !isPlaying && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative overflow-hidden shadow-2xl transition-all duration-1000 ease-out will-change-transform"
          style={{
            width: videoSize.width,
            height: videoSize.height,
            maxWidth: videoSize.maxWidth,
            maxHeight: videoSize.maxHeight,
            borderRadius,
          }}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            poster={videoPoster}
            playsInline
            preload={preloadVideo ? "auto" : "metadata"}
            onEnded={handleVideoEnded}
            muted={false}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: `${accentColor} transparent transparent transparent`,
                  }}
                />
                <span className="text-white text-sm font-medium">
                  Loading...
                </span>
              </div>
            </div>
          )}

          {/* Overlay Gradient */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
          )}

          {/* Play Button */}
          {!isPlaying && (
            <button
              onClick={handlePlayVideo}
              disabled={isLoading}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              } ${isLoading ? "cursor-wait" : "cursor-pointer"}`}
              aria-label="Play video"
            >
              <div
                className="flex items-center gap-3 px-8 py-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: `${accentColor}CC`,
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-white font-medium text-sm tracking-wide uppercase">
                  Play Video
                </span>
              </div>
            </button>
          )}

          {/* Pause/Stop Buttons */}
          {isPlaying && (
            <div className="absolute top-6 right-6 z-30 flex gap-3">
              <button
                onClick={handlePauseVideo}
                className="flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: `${accentColor}CC`,
                }}
                aria-label="Pause video"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
                <span className="text-white font-medium text-sm tracking-wide uppercase">
                  Pause
                </span>
              </button>

              <button
                onClick={handleStopVideo}
                className="flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: `${textColor}CC`,
                }}
                aria-label="Stop video"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
                <span className="text-white font-medium text-sm tracking-wide uppercase">
                  Stop
                </span>
              </button>
            </div>
          )}

          {/* CTA Link */}
          {isPlaying && ctaText && ctaLink && (
            <a
              href={ctaLink}
              className="absolute bottom-6 right-6 z-30 px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 text-white font-medium text-sm tracking-wide uppercase"
              style={{
                backgroundColor: `${accentColor}CC`,
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ctaText} →
            </a>
          )}
        </div>

        {/* Hover Ring Effect */}
        {!isPlaying && isHovered && !isLoading && (
          <div
            className="absolute inset-0 rounded-full border-4 animate-ping opacity-30 pointer-events-none"
            style={{
              borderColor: accentColor,
              width: videoSize.width,
              height: videoSize.height,
            }}
          />
        )}
      </div>

      {/* SCROLL INDICATOR */}
      {!isPlaying && scrollProgress < 0.9 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce opacity-70">
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: textColor }}
            >
              Scroll
            </span>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              style={{ color: accentColor }}
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
  );
}

// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { useViewportEnter } from "@/hooks/useIntersectionObserver";
// import AnimatedLink from "@/components/ui/animated-link";
// import type { RefObject } from "react";

// interface GallerySectionProps {
//   data: {
//     title: string;
//     description: string;
//     images: string[];
//     cta?: {
//       text: string;
//       link: string;
//     };
//     seo?: {
//       alt: string;
//       title: string;
//     };
//   };
// }

// export default function GallerySection({ data }: GallerySectionProps) {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const [titleRef, hasTitleEntered] = useViewportEnter({ threshold: 0.3 });
//   const [subtitleRef, hasSubtitleEntered] = useViewportEnter({
//     threshold: 0.3,
//   });
//   const [descRef, hasDescEntered] = useViewportEnter({ threshold: 0.3 });
//   const [ctaRef, hasCtaEntered] = useViewportEnter({ threshold: 0.3 });

//   const handlePrevImage = () =>
//     setCurrentImageIndex((prev) =>
//       prev === 0 ? data.images.length - 1 : prev - 1
//     );

//   const handleNextImage = () =>
//     setCurrentImageIndex((prev) =>
//       prev === data.images.length - 1 ? 0 : prev + 1
//     );

//   return (
//     <section className="relative py-0 overflow-hidden bg-[#EFEBE2]">
//       <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 sm:gap-11 gap-10 lg:gap-20 items-center px-4 sm:px-6 lg:px-8 ">
//         {/* Left Side - Image Gallery */}
//         <div className="relative w-full aspect-80/110 rounded-lg overflow-hidden shadow-md">
//           {data.images[currentImageIndex] && (
//             <Image
//               src={data.images[currentImageIndex]}
//               alt={`${data.seo?.alt || "Gallery image"} ${
//                 currentImageIndex + 1
//               }`}
//               fill
//               priority={currentImageIndex === 0}
//               className="object-cover transition-opacity duration-500"
//               sizes="(max-width: 1280px) 100vw, 640px"
//             />
//           )}

//           {/* Navigation Controls */}
//           <div className="absolute inset-0 flex items-center justify-between p-4">
//             <button
//               onClick={handlePrevImage}
//               aria-label="Previous image"
//               className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>

//             <button
//               onClick={handleNextImage}
//               aria-label="Next image"
//               className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             </button>
//           </div>

//           {/* Image Counter */}
//           <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
//             {currentImageIndex + 1} / {data.images.length}
//           </div>
//         </div>

//         {/* Right Side - Text Content */}
//         <div className="flex flex-col space-y-6">
//           <h2
//             ref={titleRef as RefObject<HTMLHeadingElement>}
//             className={`text-lg md:text-xl lg:text-2xl text-[#C69C4D] transition-all duration-700 delay-100 ${
//               hasTitleEntered
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-6"
//             }`}
//           >
//             {data.title}
//           </h2>

//           <p
//             ref={descRef as RefObject<HTMLParagraphElement>}
//             className={`text-[#343E35] text-sm leading-relaxed transition-all duration-700 delay-200 ${
//               hasDescEntered
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-6"
//             }`}
//           >
//             {data.description}
//           </p>
//           {data.cta && (
//             <div
//               ref={ctaRef as RefObject<HTMLDivElement>}
//               className={`transition-all duration-700 delay-300 ${
//                 hasCtaEntered
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-6"
//               }`}
//             >
//               <AnimatedLink href={data.cta.link} className="uppercase">
//                 {data.cta.text}
//               </AnimatedLink>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";
import AnimatedLink from "@/components/ui/animated-link";
import type { RefObject } from "react";

// ============================================================================
// TYPES
// ============================================================================

interface GallerySectionProps {
  data: {
    title: string;
    description: string;
    images: string[];
    cta?: {
      text: string;
      link: string;
    };
    seo?: {
      alt: string;
      title: string;
    };
  };
}

// ============================================================================
// IMAGE PRELOADER COMPONENT
// ============================================================================

/**
 * Hidden component that preloads next/prev images in background
 * Ensures smooth transitions without loading delay
 */
function ImagePreloader({ images }: { images: string[] }) {
  return (
    <div className="hidden">
      {images.map((src, idx) => (
        <link key={`preload-${idx}`} rel="preload" as="image" href={src} />
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GallerySection({ data }: GallerySectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<number, boolean>
  >({});
  const [direction, setDirection] = useState<"next" | "prev">("next");

  // Intersection observers for animations
  const [titleRef, hasTitleEntered] = useViewportEnter<HTMLHeadingElement>({
    threshold: 0.3,
  });
  const [descRef, hasDescEntered] = useViewportEnter<HTMLParagraphElement>({
    threshold: 0.3,
  });
  const [ctaRef, hasCtaEntered] = useViewportEnter<HTMLDivElement>({
    threshold: 0.3,
  });

  // ============================================================================
  // PRELOAD STRATEGY
  // ============================================================================

  /**
   * Calculate which images to preload based on current index
   * Strategy: Current + 2 next + 1 previous
   */
  const imagesToPreload = useMemo(() => {
    const total = data.images.length;
    const indices = new Set<number>();

    // Current image
    indices.add(currentImageIndex);

    // Next 2 images (circular)
    indices.add((currentImageIndex + 1) % total);
    indices.add((currentImageIndex + 2) % total);

    // Previous image (circular)
    indices.add((currentImageIndex - 1 + total) % total);

    return Array.from(indices).map((idx) => data.images[idx]);
  }, [currentImageIndex, data.images]);

  /**
   * Preload images when component mounts or index changes
   */
  useEffect(() => {
    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [imagesToPreload]);

  // ============================================================================
  // IMAGE LOADING STATE MANAGEMENT
  // ============================================================================

  const handleImageLoad = useCallback((index: number) => {
    setImageLoadStates((prev) => ({ ...prev, [index]: true }));
  }, []);

  const handleImageError = useCallback((index: number) => {
    console.error(`Failed to load image at index ${index}`);
    setImageLoadStates((prev) => ({ ...prev, [index]: false }));
  }, []);

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================

  const handlePrevImage = useCallback(() => {
    setDirection("prev");
    setCurrentImageIndex((prev) =>
      prev === 0 ? data.images.length - 1 : prev - 1
    );
  }, [data.images.length]);

  const handleNextImage = useCallback(() => {
    setDirection("next");
    setCurrentImageIndex((prev) =>
      prev === data.images.length - 1 ? 0 : prev + 1
    );
  }, [data.images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevImage, handleNextImage]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const currentImage = data.images[currentImageIndex];
  const isCurrentImageLoaded = imageLoadStates[currentImageIndex] ?? false;
  const altText = `${data.seo?.alt || "Gallery image"} ${
    currentImageIndex + 1
  }`;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <section className="relative py-0 overflow-hidden bg-[#EFEBE2]">
      {/* Preload images in background */}
      <ImagePreloader images={imagesToPreload} />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 sm:gap-11 gap-10 lg:gap-20 items-center px-4 sm:px-6 lg:px-8">
        {/* ================================================================ */}
        {/* LEFT: IMAGE GALLERY */}
        {/* ================================================================ */}
        <div className="relative w-full aspect-[80/110] rounded-lg overflow-hidden shadow-md bg-neutral-200">
          {/* Skeleton Loader */}
          {!isCurrentImageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%]" />
          )}

          {/* Main Image */}
          {currentImage && (
            <Image
              key={currentImageIndex} // Force remount on change for smooth transition
              src={currentImage}
              alt={altText}
              fill
              priority={currentImageIndex <= 2} // Priority for first 3 images
              loading={currentImageIndex <= 2 ? "eager" : "lazy"}
              quality={90}
              className={`object-cover transition-opacity duration-500 ${
                isCurrentImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
              onLoad={() => handleImageLoad(currentImageIndex)}
              onError={() => handleImageError(currentImageIndex)}
            />
          )}

          {/* Navigation Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-4 z-10">
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            {currentImageIndex + 1} / {data.images.length}
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {data.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentImageIndex ? "next" : "prev");
                  setCurrentImageIndex(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT: TEXT CONTENT */}
        {/* ================================================================ */}
        <div className="flex flex-col space-y-6">
          <h2
            ref={titleRef}
            className={`text-lg md:text-xl lg:text-2xl text-[#C69C4D] transition-all duration-700 delay-100 ${
              hasTitleEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {data.title}
          </h2>

          <p
            ref={descRef}
            className={`text-[#343E35] text-sm leading-relaxed transition-all duration-700 delay-200 ${
              hasDescEntered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {data.description}
          </p>

          {data.cta && (
            <div
              ref={ctaRef}
              className={`transition-all duration-700 delay-300 ${
                hasCtaEntered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <AnimatedLink href={data.cta.link} className="uppercase">
                {data.cta.text}
              </AnimatedLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// "use client";

// import { useEffect, useRef, useState, ReactNode } from "react";
// import Image from "next/image";

// interface CircularRevealProps {
//   // Content before reveal
//   title?: string;
//   subtitle?: string;
//   cta?: {
//     text: string;
//     link: string;
//   };

//   // Image for reveal
//   image: string;
//   imageAlt?: string;

//   // Next section content
//   children: ReactNode;

//   // Customization
//   backgroundColor?: string;
//   textColor?: string;
//   scrollHeight?: number;
// }

// export default function CircularReveal({
//   title,
//   subtitle,
//   cta,
//   image,
//   imageAlt = "Reveal image",
//   children,
//   backgroundColor = "#E8E4DC",
//   textColor = "#C69C4D",
//   scrollHeight = 200,
// }: CircularRevealProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [scrollProgress, setScrollProgress] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!containerRef.current) return;

//       const rect = containerRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;

//       const sectionTop = rect.top;
//       const sectionHeight = rect.height;

//       const startPoint = windowHeight;
//       const endPoint = -sectionHeight;

//       let progress = 0;
//       if (sectionTop < startPoint && sectionTop > endPoint) {
//         progress = (startPoint - sectionTop) / (startPoint - endPoint);
//         progress = Math.max(0, Math.min(1, progress));
//       } else if (sectionTop <= endPoint) {
//         progress = 1;
//       }

//       setScrollProgress(progress);
//     };

//     // Use requestAnimationFrame for smoother updates
//     let rafId: number;
//     const scrollListener = () => {
//       if (rafId) return;
//       rafId = requestAnimationFrame(() => {
//         handleScroll();
//         rafId = 0;
//       });
//     };

//     window.addEventListener("scroll", scrollListener, { passive: true });
//     handleScroll();

//     return () => {
//       window.removeEventListener("scroll", scrollListener);
//       if (rafId) cancelAnimationFrame(rafId);
//     };
//   }, []);

//   // Animation calculations
//   const titleOpacity =
//     scrollProgress < 0.2 ? 1 : Math.max(0, 1 - (scrollProgress - 0.2) / 0.1);

//   const circleScale =
//     scrollProgress < 0.2
//       ? 0
//       : scrollProgress < 0.5
//       ? ((scrollProgress - 0.2) / 0.3) * 2.5 // Scale up to 250% for full coverage
//       : 2.5;

//   const circleOpacity = scrollProgress > 0.2 ? 1 : 0;

//   const imageOpacity =
//     scrollProgress < 0.3
//       ? 0
//       : scrollProgress < 0.5
//       ? (scrollProgress - 0.3) / 0.2
//       : 1;

//   const fullImageOpacity = scrollProgress > 0.5 && scrollProgress < 0.8 ? 1 : 0;

//   const nextSectionTranslate =
//     scrollProgress < 0.75
//       ? 100
//       : Math.max(0, 100 - ((scrollProgress - 0.75) / 0.25) * 100);

//   return (
//     <div ref={containerRef} className="relative">
//       {/* STICKY REVEAL CONTAINER */}
//       <div
//         className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
//         style={{ backgroundColor }}
//       >
//         {/* Title & CTA Layer */}
//         {(title || subtitle || cta) && (
//           <div
//             className="relative z-30 text-center px-4 space-y-6 max-w-5xl mx-auto"
//             style={{
//               opacity: titleOpacity,
//               transform: `translateY(${(1 - titleOpacity) * 20}px)`,
//               pointerEvents: titleOpacity > 0.5 ? "auto" : "none",
//             }}
//           >
//             {subtitle && (
//               <p
//                 className="text-sm md:text-base tracking-[0.3em] uppercase font-light"
//                 style={{ color: textColor }}
//               >
//                 {subtitle}
//               </p>
//             )}

//             {title && (
//               <h2
//                 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed"
//                 style={{ color: textColor }}
//               >
//                 {title}
//               </h2>
//             )}

//             {cta && (
//               <div className="pt-4">
//                 <a
//                   href={cta.link}
//                   className="inline-block px-8 py-3 border-2 transition-all duration-300 text-sm tracking-wider uppercase font-medium hover:scale-105"
//                   style={{
//                     borderColor: textColor,
//                     color: textColor,
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = textColor;
//                     e.currentTarget.style.color = backgroundColor;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = "transparent";
//                     e.currentTarget.style.color = textColor;
//                   }}
//                 >
//                   {cta.text}
//                 </a>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Circular Reveal Animation */}
//         <div
//           className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
//           style={{ opacity: circleOpacity }}
//         >
//           <div
//             className="relative rounded-full overflow-hidden will-change-transform"
//             style={{
//               width: "40vmin",
//               height: "40vmin",
//               transform: `scale(${circleScale})`,
//               transformOrigin: "center",
//             }}
//           >
//             <Image
//               src={image}
//               alt={imageAlt}
//               fill
//               className="object-cover"
//               style={{ opacity: imageOpacity }}
//               sizes="100vw"
//               quality={90}
//               priority
//             />
//           </div>
//         </div>

//         {/* Full Image Layer */}
//         <div
//           className="absolute inset-0 z-10"
//           style={{
//             opacity: fullImageOpacity,
//             transition: "opacity 0.3s ease-out",
//           }}
//         >
//           <Image
//             src={image}
//             alt={imageAlt}
//             fill
//             className="object-cover"
//             sizes="100vw"
//             quality={90}
//           />
//           <div className="absolute inset-0 bg-black/20" />
//         </div>
//       </div>

//       {/* SCROLL SPACER */}
//       <div style={{ height: `${scrollHeight}vh` }} />

//       {/* NEXT SECTION - Slides Up (Parallax) */}
//       <div
//         className="sticky bottom-0 bg-white z-40"
//         style={{
//           transform: `translateY(${nextSectionTranslate}%)`,
//           willChange: "transform",
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";

interface CircularRevealProps {
  // Content before reveal
  title?: string;
  subtitle?: string;
  cta?: {
    text: string;
    link: string;
  };

  // Image for reveal
  image: string;
  imageAlt?: string;

  // Next section content
  children: ReactNode;

  // Customization
  backgroundColor?: string;
  textColor?: string;
  scrollHeight?: number;
}

export default function CircularReveal({
  title,
  subtitle,
  cta,
  image,
  imageAlt = "Reveal image",
  children,
  backgroundColor = "#E8E4DC",
  textColor = "#C69C4D",
  scrollHeight = 200,
}: CircularRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      const startPoint = windowHeight;
      const endPoint = -sectionHeight;

      let progress = 0;
      if (sectionTop < startPoint && sectionTop > endPoint) {
        progress = (startPoint - sectionTop) / (startPoint - endPoint);
        progress = Math.max(0, Math.min(1, progress));
      } else if (sectionTop <= endPoint) {
        progress = 1;
      }

      setScrollProgress(progress);
    };

    let rafId: number;
    const scrollListener = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = 0;
      });
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", scrollListener);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Animation stages:
  // 0 - 0.2: Title & CTA visible
  // 0.2 - 0.6: Arch/Portal expands (narrow → full width)
  // 0.6 - 0.75: Full image hold
  // 0.75 - 1.0: Next section slides up smooth

  const titleOpacity =
    scrollProgress < 0.2 ? 1 : Math.max(0, 1 - (scrollProgress - 0.2) / 0.1);

  // Portal width: starts narrow, expands to full width
  const portalWidth =
    scrollProgress < 0.2
      ? 0
      : scrollProgress < 0.6
      ? ((scrollProgress - 0.2) / 0.4) * 100 // 0% → 100%
      : 100;

  // Portal height: fixed at viewport height
  const portalHeight = 80; // 80vh

  const portalOpacity = scrollProgress > 0.2 ? 1 : 0;

  const imageOpacity =
    scrollProgress < 0.3
      ? 0
      : scrollProgress < 0.5
      ? (scrollProgress - 0.3) / 0.2
      : 1;

  // Next section slides up smoothly
  const nextSectionTranslate =
    scrollProgress < 0.75
      ? 100
      : Math.max(0, 100 - ((scrollProgress - 0.75) / 0.25) * 100);

  return (
    <div ref={containerRef} className="relative">
      {/* STICKY CONTAINER */}
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor }}
      >
        {/* Title & CTA Layer */}
        {(title || subtitle || cta) && (
          <div
            className="relative z-30 text-center px-4 space-y-6 max-w-5xl mx-auto"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${(1 - titleOpacity) * 20}px)`,
              pointerEvents: titleOpacity > 0.5 ? "auto" : "none",
            }}
          >
            {subtitle && (
              <p
                className="text-sm md:text-base tracking-[0.3em] uppercase font-light"
                style={{ color: textColor }}
              >
                {subtitle}
              </p>
            )}

            {title && (
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed"
                style={{ color: textColor }}
              >
                {title}
              </h2>
            )}

            {cta && (
              <div className="pt-4">
                <a
                  href={cta.link}
                  className="inline-block px-8 py-3 border-2 transition-all duration-300 text-sm tracking-wider uppercase font-medium hover:scale-105"
                  style={{
                    borderColor: textColor,
                    color: textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = textColor;
                    e.currentTarget.style.color = backgroundColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = textColor;
                  }}
                >
                  {cta.text}
                </a>
              </div>
            )}
          </div>
        )}

        {/* ARCH/PORTAL SHAPE - Expands from center */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          style={{ opacity: portalOpacity }}
        >
          <div
            className="relative overflow-hidden will-change-transform"
            style={{
              width: `${portalWidth}vw`,
              height: `${portalHeight}vh`,
              transition: "width 0.1s ease-out",
            }}
          >
            {/* Arch/Portal Clip Path */}
            <div
              className="absolute inset-0"
              style={{
                clipPath:
                  portalWidth < 100
                    ? `path('M 0 ${portalHeight * 0.3}vh Q 0 0, ${
                        portalWidth * 0.5
                      }vw 0 T ${portalWidth}vw ${
                        portalHeight * 0.3
                      }vh L ${portalWidth}vw ${portalHeight}vh L 0 ${portalHeight}vh Z')`
                    : "none", // Full screen = no clip
              }}
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover"
                style={{ opacity: imageOpacity }}
                sizes="100vw"
                quality={90}
                priority
              />
            </div>
          </div>
        </div>

        {/* FULL IMAGE BACKGROUND (when portal is 100% width) */}
        {portalWidth >= 100 && (
          <div className="absolute inset-0 z-10">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        )}
      </div>

      {/* SCROLL SPACER */}
      <div style={{ height: `${scrollHeight}vh` }} />

      {/* NEXT SECTION - Slides Up Smoothly */}
      {/* <div
        className="sticky bottom-0 bg-white z-40"
        style={{
          transform: `translateY(${nextSectionTranslate}%)`,
          willChange: "transform",
        }}
      >
        {children}
      </div> */}
    </div>
  );
}

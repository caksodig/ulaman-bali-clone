"use client";

import { ReactNode, ElementType } from "react";
import { useViewportEnter } from "@/hooks/useIntersectionObserver";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  animationType?:
    | "fade"
    | "slide-up"
    | "slide-left"
    | "slide-right"
    | "scale"
    | "none";
  delay?: number;
  duration?: number;
  as?: ElementType;
}

/**
 * LazySection - Wrapper component for lazy loading content with animations
 * Automatically triggers animation when section enters viewport
 *
 * @example
 * <LazySection animationType="slide-up" delay={200}>
 *   <YourContent />
 * </LazySection>
 */
export default function LazySection({
  children,
  className = "",
  threshold = 0.15,
  rootMargin = "0px 0px -100px 0px",
  animationType = "fade",
  delay = 0,
  duration = 600,
  as: Component = "section",
}: LazySectionProps) {
  const [ref, hasEntered] = useViewportEnter<HTMLElement>({
    threshold,
    rootMargin,
  });

  // Animation classes based on type
  const getAnimationClasses = () => {
    if (animationType === "none") return "";

    const baseClasses = "transition-all ease-out";
    const durationClass = `duration-${duration}`;

    if (!hasEntered) {
      // Initial state (before entering viewport)
      switch (animationType) {
        case "fade":
          return `${baseClasses} ${durationClass} opacity-0`;
        case "slide-up":
          return `${baseClasses} ${durationClass} opacity-0 translate-y-12`;
        case "slide-left":
          return `${baseClasses} ${durationClass} opacity-0 -translate-x-12`;
        case "slide-right":
          return `${baseClasses} ${durationClass} opacity-0 translate-x-12`;
        case "scale":
          return `${baseClasses} ${durationClass} opacity-0 scale-95`;
        default:
          return `${baseClasses} ${durationClass} opacity-0`;
      }
    } else {
      // Final state (after entering viewport)
      return `${baseClasses} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100`;
    }
  };

  return (
    <Component
      ref={ref}
      className={`${getAnimationClasses()} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
}

/**
 * LazySectionGroup - For staggered animations of multiple sections
 *
 * @example
 * <LazySectionGroup staggerDelay={100}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </LazySectionGroup>
 */
interface LazySectionGroupProps {
  children: ReactNode[];
  className?: string;
  threshold?: number;
  rootMargin?: string;
  animationType?: LazySectionProps["animationType"];
  staggerDelay?: number;
  baseDuration?: number;
  as?: ElementType;
}

export function LazySectionGroup({
  children,
  className = "",
  threshold = 0.15,
  rootMargin = "0px 0px -100px 0px",
  animationType = "slide-up",
  staggerDelay = 100,
  baseDuration = 600,
  as: Component = "div",
}: LazySectionGroupProps) {
  const [ref, hasEntered] = useViewportEnter<HTMLElement>({
    threshold,
    rootMargin,
  });

  return (
    <Component ref={ref} className={className}>
      {Array.isArray(children) &&
        children.map((child, index) => (
          <div
            key={index}
            className={`transition-all ease-out duration-${baseDuration} ${
              hasEntered
                ? "opacity-100 translate-y-0 translate-x-0 scale-100"
                : animationType === "fade"
                ? "opacity-0"
                : animationType === "slide-up"
                ? "opacity-0 translate-y-12"
                : animationType === "slide-left"
                ? "opacity-0 -translate-x-12"
                : animationType === "slide-right"
                ? "opacity-0 translate-x-12"
                : animationType === "scale"
                ? "opacity-0 scale-95"
                : "opacity-0"
            }`}
            style={{
              transitionDelay: hasEntered ? `${index * staggerDelay}ms` : "0ms",
            }}
          >
            {child}
          </div>
        ))}
    </Component>
  );
}

/**
 * ProgressiveImage - Lazy load images with blur-up effect
 *
 * @example
 * <ProgressiveImage
 *   src="/images/hero.jpg"
 *   alt="Hero"
 *   className="w-full h-96 object-cover"
 * />
 */
interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  threshold?: number;
  blurDataURL?: string;
}

export function ProgressiveImage({
  src,
  alt,
  className = "",
  threshold = 0.1,
  blurDataURL,
}: ProgressiveImageProps) {
  const [ref, hasEntered] = useViewportEnter<HTMLDivElement>({
    threshold,
  });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {hasEntered ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-500 opacity-0 animate-fade-in"
          loading="lazy"
          onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
        />
      ) : (
        <div
          className="w-full h-full bg-gray-200 animate-pulse"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: "cover",
            filter: "blur(10px)",
          }}
        />
      )}
    </div>
  );
}

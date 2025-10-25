import { useEffect, useRef, useState, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
  triggerOnce?: boolean;
}

interface IntersectionObserverResult {
  isIntersecting: boolean;
  hasIntersected: boolean;
  entry?: IntersectionObserverEntry;
}

/**
 * Custom hook for Intersection Observer API
 * Perfect for lazy loading sections, animations, and infinite scroll
 *
 * @param options - Configuration for the intersection observer
 * @returns [ref, isIntersecting, hasIntersected, entry]
 *
 * @example
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
 * return <div ref={ref}>{isVisible ? 'Visible!' : 'Not visible'}</div>
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): [
  RefObject<T | null>,
  boolean,
  boolean,
  IntersectionObserverEntry | undefined
] {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = false,
    triggerOnce = false,
  } = options;

  const elementRef = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const element = elementRef.current;

    // Early return if no element or if frozen
    if (!element || (freezeOnceVisible && hasIntersected)) {
      return;
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === "undefined") {
      console.warn("IntersectionObserver is not supported in this browser");
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observerCallback: IntersectionObserverCallback = ([entry]) => {
      const isElementIntersecting = entry.isIntersecting;

      setEntry(entry);
      setIsIntersecting(isElementIntersecting);

      // Mark as intersected once it becomes visible
      if (isElementIntersecting) {
        setHasIntersected(true);

        // If triggerOnce is enabled, disconnect observer
        if (triggerOnce) {
          observer.disconnect();
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(element);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [
    threshold,
    root,
    rootMargin,
    freezeOnceVisible,
    hasIntersected,
    triggerOnce,
  ]);

  return [elementRef, isIntersecting, hasIntersected, entry];
}

/**
 * Simplified version that only returns ref and visibility state
 * Perfect for simple use cases
 *
 * @example
 * const [ref, isVisible] = useInView({ threshold: 0.3 });
 */
export function useInView<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const [ref, isIntersecting] = useIntersectionObserver<T>(options);
  return [ref, isIntersecting];
}

/**
 * Hook for detecting when element enters viewport (triggers once)
 * Ideal for triggering animations or lazy loading
 *
 * @example
 * const [ref, hasEntered] = useViewportEnter();
 * return (
 *   <div ref={ref} className={hasEntered ? 'animate-fade-in' : 'opacity-0'}>
 *     Content
 *   </div>
 * );
 */
export function useViewportEnter<T extends Element = Element>(
  options: Omit<UseIntersectionObserverOptions, "triggerOnce"> = {}
): [RefObject<T | null>, boolean] {
  const [ref, , hasIntersected] = useIntersectionObserver<T>({
    ...options,
    triggerOnce: true,
  });
  return [ref, hasIntersected];
}

/**
 * Hook for progressive loading with different thresholds
 * Returns visibility percentage (0-100)
 *
 * @example
 * const [ref, visibility] = useVisibilityPercentage();
 * return (
 *   <div ref={ref} style={{ opacity: visibility / 100 }}>
 *     Fades in based on scroll
 *   </div>
 * );
 */
export function useVisibilityPercentage<T extends Element = Element>(
  options: Omit<UseIntersectionObserverOptions, "threshold"> = {}
): [RefObject<T | null>, number] {
  const [ref, , , entry] = useIntersectionObserver<T>({
    ...options,
    threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0, 0.01, 0.02, ..., 1
  });

  const visibility = entry ? Math.round(entry.intersectionRatio * 100) : 0;

  return [ref, visibility];
}

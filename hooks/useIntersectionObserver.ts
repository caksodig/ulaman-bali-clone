// import { useEffect, useRef, useState, RefObject } from "react";

// interface UseIntersectionObserverOptions {
//   threshold?: number | number[];
//   root?: Element | null;
//   rootMargin?: string;
//   freezeOnceVisible?: boolean;
//   triggerOnce?: boolean;
// }

// interface IntersectionObserverResult {
//   isIntersecting: boolean;
//   hasIntersected: boolean;
//   entry?: IntersectionObserverEntry;
// }

// /**
//  * Custom hook for Intersection Observer API
//  * Perfect for lazy loading sections, animations, and infinite scroll
//  *
//  * @param options - Configuration for the intersection observer
//  * @returns [ref, isIntersecting, hasIntersected, entry]
//  *
//  * @example
//  * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
//  * return <div ref={ref}>{isVisible ? 'Visible!' : 'Not visible'}</div>
//  */
// export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
//   options: UseIntersectionObserverOptions = {}
// ): [
//   RefObject<T | null>,
//   boolean,
//   boolean,
//   IntersectionObserverEntry | undefined
// ] {
//   const {
//     threshold = 0.1,
//     root = null,
//     rootMargin = "0px",
//     freezeOnceVisible = false,
//     triggerOnce = false,
//   } = options;

//   const elementRef = useRef<T>(null);
//   const [isIntersecting, setIsIntersecting] = useState(false);
//   const [hasIntersected, setHasIntersected] = useState(false);
//   const [entry, setEntry] = useState<IntersectionObserverEntry>();

//   useEffect(() => {
//     const element = elementRef.current;

//     // Early return if no element or if frozen
//     if (!element || (freezeOnceVisible && hasIntersected)) {
//       return;
//     }

//     // Check if IntersectionObserver is supported
//     if (typeof IntersectionObserver === "undefined") {
//       console.warn("IntersectionObserver is not supported in this browser");
//       setIsIntersecting(true);
//       setHasIntersected(true);
//       return;
//     }

//     const observerCallback: IntersectionObserverCallback = ([entry]) => {
//       const isElementIntersecting = entry.isIntersecting;

//       setEntry(entry);
//       setIsIntersecting(isElementIntersecting);

//       // Mark as intersected once it becomes visible
//       if (isElementIntersecting) {
//         setHasIntersected(true);

//         // If triggerOnce is enabled, disconnect observer
//         if (triggerOnce) {
//           observer.disconnect();
//         }
//       }
//     };

//     const observer = new IntersectionObserver(observerCallback, {
//       threshold,
//       root,
//       rootMargin,
//     });

//     observer.observe(element);

//     // Cleanup
//     return () => {
//       observer.disconnect();
//     };
//   }, [
//     threshold,
//     root,
//     rootMargin,
//     freezeOnceVisible,
//     hasIntersected,
//     triggerOnce,
//   ]);

//   return [elementRef, isIntersecting, hasIntersected, entry];
// }

// /**
//  * Simplified version that only returns ref and visibility state
//  * Perfect for simple use cases
//  *
//  * @example
//  * const [ref, isVisible] = useInView({ threshold: 0.3 });
//  */
// export function useInView<T extends Element = Element>(
//   options: UseIntersectionObserverOptions = {}
// ): [RefObject<T | null>, boolean] {
//   const [ref, isIntersecting] = useIntersectionObserver<T>(options);
//   return [ref, isIntersecting];
// }

// /**
//  * Hook for detecting when element enters viewport (triggers once)
//  * Ideal for triggering animations or lazy loading
//  *
//  * @example
//  * const [ref, hasEntered] = useViewportEnter();
//  * return (
//  *   <div ref={ref} className={hasEntered ? 'animate-fade-in' : 'opacity-0'}>
//  *     Content
//  *   </div>
//  * );
//  */
// export function useViewportEnter<T extends Element = Element>(
//   options: Omit<UseIntersectionObserverOptions, "triggerOnce"> = {}
// ): [RefObject<T | null>, boolean] {
//   const [ref, , hasIntersected] = useIntersectionObserver<T>({
//     ...options,
//     triggerOnce: true,
//   });
//   return [ref, hasIntersected];
// }

// /**
//  * Hook for progressive loading with different thresholds
//  * Returns visibility percentage (0-100)
//  *
//  * @example
//  * const [ref, visibility] = useVisibilityPercentage();
//  * return (
//  *   <div ref={ref} style={{ opacity: visibility / 100 }}>
//  *     Fades in based on scroll
//  *   </div>
//  * );
//  */
// export function useVisibilityPercentage<T extends Element = Element>(
//   options: Omit<UseIntersectionObserverOptions, "threshold"> = {}
// ): [RefObject<T | null>, number] {
//   const [ref, , , entry] = useIntersectionObserver<T>({
//     ...options,
//     threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0, 0.01, 0.02, ..., 1
//   });

//   const visibility = entry ? Math.round(entry.intersectionRatio * 100) : 0;

//   return [ref, visibility];
// }

import { useEffect, useRef, useState, RefObject } from "react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface UseIntersectionObserverOptions {
  /** Threshold(s) at which to trigger the callback (0-1) */
  threshold?: number | number[];
  /** Root element for intersection detection (null = viewport) */
  root?: Element | null;
  /** Margin around the root element */
  rootMargin?: string;
  /** Stop observing after first intersection */
  freezeOnceVisible?: boolean;
  /** Trigger callback only once when element enters viewport */
  triggerOnce?: boolean;
  /** Enable console warnings for debugging */
  debug?: boolean;
}

interface IntersectionObserverResult {
  isIntersecting: boolean;
  hasIntersected: boolean;
  entry?: IntersectionObserverEntry;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Custom hook for Intersection Observer API with full control
 * Perfect for lazy loading, animations, infinite scroll, and analytics tracking
 *
 * @template T - Element type (defaults to HTMLElement for maximum compatibility)
 * @param options - Configuration for the intersection observer
 * @returns [ref, isIntersecting, hasIntersected, entry]
 *
 * @example
 * ```tsx
 * const [ref, isVisible, hasBeenSeen] = useIntersectionObserver({
 *   threshold: 0.5,
 *   triggerOnce: true
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible ? 'Currently visible!' : 'Not visible'}
 *     {hasBeenSeen && ' (Has been seen before)'}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver<T extends Element = HTMLElement>(
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
    debug = false,
  } = options;

  // Refs and state - Fixed: Use RefObject<T> without null
  const elementRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const element = elementRef.current;

    // Early return conditions
    if (!element) {
      if (debug) {
        console.warn("[useIntersectionObserver] No element attached to ref");
      }
      return;
    }

    if (freezeOnceVisible && hasIntersected) {
      if (debug) {
        console.log("[useIntersectionObserver] Frozen - already intersected");
      }
      return;
    }

    // Browser support check
    if (typeof IntersectionObserver === "undefined") {
      console.warn(
        "[useIntersectionObserver] IntersectionObserver is not supported in this browser. Falling back to visible state."
      );
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    // Observer callback
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const [observerEntry] = entries;

      if (!observerEntry) return;

      const isElementIntersecting = observerEntry.isIntersecting;

      if (debug) {
        console.log("[useIntersectionObserver] Intersection change:", {
          isIntersecting: isElementIntersecting,
          intersectionRatio: observerEntry.intersectionRatio,
          boundingClientRect: observerEntry.boundingClientRect,
        });
      }

      setEntry(observerEntry);
      setIsIntersecting(isElementIntersecting);

      // Mark as intersected once it becomes visible
      if (isElementIntersecting) {
        setHasIntersected(true);

        // Disconnect if triggerOnce is enabled
        if (triggerOnce && observerRef.current) {
          if (debug) {
            console.log(
              "[useIntersectionObserver] Disconnecting (triggerOnce)"
            );
          }
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      }
    };

    // Create and start observing
    try {
      observerRef.current = new IntersectionObserver(observerCallback, {
        threshold,
        root,
        rootMargin,
      });

      observerRef.current.observe(element);

      if (debug) {
        console.log("[useIntersectionObserver] Observer initialized", {
          threshold,
          rootMargin,
          element,
        });
      }
    } catch (error) {
      console.error(
        "[useIntersectionObserver] Failed to create observer:",
        error
      );
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;

        if (debug) {
          console.log(
            "[useIntersectionObserver] Observer disconnected (cleanup)"
          );
        }
      }
    };
  }, [
    threshold,
    root,
    rootMargin,
    freezeOnceVisible,
    hasIntersected,
    triggerOnce,
    debug,
  ]);

  return [elementRef, isIntersecting, hasIntersected, entry];
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

/**
 * Simplified hook that only returns ref and current visibility state
 * Perfect for toggling classes or showing/hiding content
 *
 * @example
 * ```tsx
 * const [ref, isVisible] = useInView({ threshold: 0.3 });
 *
 * return (
 *   <div ref={ref} className={isVisible ? 'opacity-100' : 'opacity-0'}>
 *     Content fades in when visible
 *   </div>
 * );
 * ```
 */
export function useInView<T extends Element = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const [ref, isIntersecting] = useIntersectionObserver<T>(options);
  return [ref, isIntersecting];
}

/**
 * Hook for detecting when element enters viewport (triggers once)
 * Ideal for triggering animations, lazy loading images, or analytics events
 *
 * @example
 * ```tsx
 * const [ref, hasEntered] = useViewportEnter({ threshold: 0.2 });
 *
 * return (
 *   <div
 *     ref={ref}
 *     className={`transition-all duration-700 ${
 *       hasEntered
 *         ? 'translate-y-0 opacity-100'
 *         : 'translate-y-10 opacity-0'
 *     }`}
 *   >
 *     Animated content
 *   </div>
 * );
 * ```
 */
export function useViewportEnter<T extends Element = HTMLElement>(
  options: Omit<UseIntersectionObserverOptions, "triggerOnce"> = {}
): [RefObject<T | null>, boolean] {
  const [ref, , hasIntersected] = useIntersectionObserver<T>({
    ...options,
    triggerOnce: true,
  });
  return [ref, hasIntersected];
}

/**
 * Hook for progressive loading with visibility percentage (0-100)
 * Returns how much of the element is visible in viewport
 *
 * @example
 * ```tsx
 * const [ref, visibility] = useVisibilityPercentage();
 *
 * return (
 *   <div
 *     ref={ref}
 *     style={{
 *       opacity: visibility / 100,
 *       transform: `scale(${0.8 + (visibility / 500)})`
 *     }}
 *   >
 *     Content scales and fades based on scroll position
 *   </div>
 * );
 * ```
 */
export function useVisibilityPercentage<T extends Element = HTMLElement>(
  options: Omit<UseIntersectionObserverOptions, "threshold"> = {}
): [RefObject<T | null>, number] {
  // Create array of thresholds from 0 to 1 (0%, 1%, 2%, ..., 100%)
  const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

  const [ref, , , entry] = useIntersectionObserver<T>({
    ...options,
    threshold: thresholds,
  });

  // Calculate visibility percentage
  const visibility = entry ? Math.round(entry.intersectionRatio * 100) : 0;

  return [ref, visibility];
}

/**
 * Hook for lazy loading with placeholder state
 * Perfect for images, videos, or heavy components
 *
 * @example
 * ```tsx
 * const [ref, shouldLoad] = useLazyLoad({ rootMargin: '200px' });
 *
 * return (
 *   <div ref={ref}>
 *     {shouldLoad ? (
 *       <img src="heavy-image.jpg" alt="Loaded when near viewport" />
 *     ) : (
 *       <div className="skeleton-loader" />
 *     )}
 *   </div>
 * );
 * ```
 */
export function useLazyLoad<T extends Element = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const [ref, hasEntered] = useViewportEnter<T>({
    threshold: 0.01, // Trigger early
    rootMargin: "50px", // Load before entering viewport
    ...options,
  });
  return [ref, hasEntered];
}

/**
 * Hook for infinite scroll implementation
 * Triggers callback when sentinel element enters viewport
 *
 * @example
 * ```tsx
 * const [ref] = useInfiniteScroll(() => {
 *   console.log('Load more items!');
 *   fetchMoreData();
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={ref} className="h-10" />
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll<T extends Element = HTMLElement>(
  onLoadMore: () => void,
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>] {
  const [ref, isIntersecting] = useInView<T>({
    threshold: 0.1,
    rootMargin: "100px",
    ...options,
  });

  const callbackRef = useRef(onLoadMore);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  // Trigger callback when intersecting
  useEffect(() => {
    if (isIntersecting) {
      callbackRef.current();
    }
  }, [isIntersecting]);

  return [ref];
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { UseIntersectionObserverOptions, IntersectionObserverResult };

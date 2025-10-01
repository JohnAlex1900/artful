// src/hooks/use-global-reveal.ts
import { useEffect } from "react";

/**
 * Adds a reveal-on-scroll behaviour for common page blocks.
 * Call useGlobalReveal(location) from App (so it re-runs on route change).
 *
 * You can tune `selector` to match your app structure.
 */
export default function useGlobalReveal(dep?: any) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Elements we want to reveal automatically
    const selector = [
      "main section",
      "main .container",
      "main .grid > *",
      "main .card",
      "main .service-card",
      "main .portfolio-item",
      "main img",
      "[data-reveal]",
    ].join(",");

    // Root to scan inside (main is better than document to avoid nav/footer)
    const root = document.querySelector("main") || document;

    const els = Array.from(root.querySelectorAll(selector)) as HTMLElement[];

    if (els.length === 0) return;

    // Add 'reveal' base class if not already present and skip explicit opt-outs
    const toObserve = els.filter(
      (el) => !el.classList.contains("reveal-ignore")
    );

    toObserve.forEach((el) => {
      if (!el.classList.contains("reveal")) {
        el.classList.add("reveal");
      }
      // If developer set data-reveal-delay (seconds), set transitionDelay inline
      const delayAttr = el.getAttribute("data-reveal-delay");
      if (delayAttr) {
        const parsed = parseFloat(delayAttr);
        if (!Number.isNaN(parsed)) el.style.transitionDelay = `${parsed}s`;
      }
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            // Add visible class (will trigger CSS transition)
            el.classList.add("reveal-visible");
            // Stop observing to animate only once
            obs.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    toObserve.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [dep]); // re-run on dependency (pass location)
}

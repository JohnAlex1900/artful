import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function useNavbarTheme() {
  const [location] = useLocation();
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    const checkBackground = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Hero section detection (first screen on home page)
      const isInHeroSection = location === "/" && scrollY < windowHeight * 0.8;

      // Footer detection (bottom of any page)
      const documentHeight = document.documentElement.scrollHeight;
      const currentPosition = scrollY + windowHeight;
      const isNearFooter = currentPosition > documentHeight - 300;

      // Dark sections detection for other pages
      const darkSections = document.querySelectorAll(
        '[data-dark-section="true"], .bg-charcoal-800, .bg-charcoal-700',
      );
      let isOverDarkSection = false;

      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Check if navbar (top 80px) overlaps with dark section
        if (rect.top <= 80 && rect.bottom >= 0) {
          isOverDarkSection = true;
        }
      });

      setIsDarkBackground(isInHeroSection || isNearFooter || isOverDarkSection);
    };

    // Check on mount and scroll
    checkBackground();
    window.addEventListener("scroll", checkBackground);

    // Check on route change
    const timer = setTimeout(checkBackground, 100);

    return () => {
      window.removeEventListener("scroll", checkBackground);
      clearTimeout(timer);
    };
  }, [location]);

  return isDarkBackground;
}

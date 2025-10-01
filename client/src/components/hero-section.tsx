import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id?: string;
  image: string;
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
};

interface HeroSectionProps {
  slides?: Slide[];
  // fallback props (kept for backward compatibility)
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showScrollIndicator?: boolean;
  autoplayInterval?: number; // ms
}

export default function HeroSection({
  slides,
  title,
  subtitle,
  ctaText,
  ctaLink,
  showScrollIndicator = false,
  autoplayInterval = 4000,
}: HeroSectionProps) {
  // Normalize slides: if slides are provided use them, otherwise build a single-slide fallback
  const slidesToUse: Slide[] =
    Array.isArray(slides) && slides.length > 0
      ? slides
      : [
          {
            image:
              "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
            headline: title || "Transforming Spaces with Artful Design",
            subheadline:
              subtitle ||
              "Creating sophisticated interiors and exteriors that reflect your unique style.",
            ctaText: ctaText || "Explore Our Work",
            ctaLink: ctaLink || "/portfolio",
          },
        ];

  const slideCount = slidesToUse.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const autoplayRef = useRef<number | null>(null);

  // Autoplay
  useEffect(() => {
    if (paused || slideCount <= 1) return;

    autoplayRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, autoplayInterval);

    return () => {
      if (autoplayRef.current !== null)
        window.clearInterval(autoplayRef.current);
    };
  }, [paused, slideCount, autoplayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setCurrent((p) => (p === 0 ? slideCount - 1 : p - 1));
      if (e.key === "ArrowRight") setCurrent((p) => (p + 1) % slideCount);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slideCount]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true); // pause while interacting
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - touchStartX.current;
    if (delta > 50) setCurrent((p) => (p === 0 ? slideCount - 1 : p - 1));
    else if (delta < -50) setCurrent((p) => (p + 1) % slideCount);
    touchStartX.current = null;
    setTimeout(() => setPaused(false), 500);
  };

  const goPrev = () => setCurrent((p) => (p === 0 ? slideCount - 1 : p - 1));
  const goNext = () => setCurrent((p) => (p + 1) % slideCount);

  return (
    <section
      className="relative w-full h-[80vh] md:h-[90vh] bg-black overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Slides track */}
      <div
        className="absolute inset-0 flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slidesToUse.map((s, i) => (
          <div key={s.id ?? i} className="min-w-full h-full relative">
            <img
              src={s.image}
              alt={s.headline}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />

            {/* Gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/40" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-3xl mx-6 md:mx-12 lg:mx-20 text-white">
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 drop-shadow">
                  {s.headline}
                </h1>
                {s.subheadline && (
                  <p className="text-lg md:text-xl text-white/90 mb-6 max-w-lg">
                    {s.subheadline}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  <Link href={s.ctaLink ?? "/portfolio"}>
                    <a className="inline-block px-6 py-3 rounded-2xl bg-gold-500 text-charcoal-900 font-semibold shadow hover:bg-gold-600 transition">
                      {s.ctaText ?? "Explore Our Work"}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      {slideCount > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 p-2 hover:bg-black/60 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            aria-label="Next slide"
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 p-2 hover:bg-black/60 text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </section>
  );
}

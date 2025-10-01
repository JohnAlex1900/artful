import { useState, useEffect, KeyboardEvent } from "react";
import { useLocation } from "wouter";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "@/components/footer"; // Your footer component
import Reveal from "@/components/reveal";

interface GalleryServicePageProps {
  title: string;
  description: string;
  images: string[];
}

export default function ServicePage({
  title,
  description,
  images,
}: GalleryServicePageProps) {
  const [location] = useLocation();
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const openFullscreen = (index: number) => setFullscreenIndex(index);
  const closeFullscreen = () => setFullscreenIndex(null);

  const prevImage = () => {
    if (fullscreenIndex === null) return;
    setFullscreenIndex((prev) =>
      prev === 0 ? images.length - 1 : (prev as number) - 1
    );
  };

  const nextImage = () => {
    if (fullscreenIndex === null) return;
    setFullscreenIndex((prev) =>
      prev === images.length - 1 ? 0 : (prev as number) + 1
    );
  };

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (fullscreenIndex !== null) {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeFullscreen();
    }
  };

  useEffect(() => {
    const listener = (e: globalThis.KeyboardEvent) => {
      if (fullscreenIndex !== null) {
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "Escape") closeFullscreen();
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [fullscreenIndex]);

  return (
    <div className="min-h-screen pt-20 bg-cream-50">
      {/* Title Section */}
      <section className="py-20 text-center">
        <Reveal>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-charcoal-800 mb-6">
            {title}
          </h1>
          <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
            {description}
          </p>
        </Reveal>
      </section>

      {/* Gallery */}
      <section className="py-10 container mx-auto px-4 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div
                className="cursor-pointer overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                onClick={() => openFullscreen(idx)}
              >
                <img
                  src={img}
                  alt={`${title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Fullscreen Overlay */}
      {fullscreenIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white p-2"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={images[fullscreenIndex]}
            alt={`${title} fullscreen`}
            className="max-w-full max-h-full object-contain"
          />

          <button
            onClick={nextImage}
            className="absolute right-4 text-white p-2"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

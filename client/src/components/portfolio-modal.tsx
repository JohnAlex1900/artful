import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    category: string;
    images: string[];
    description: string;
    location?: string;
    size?: string;
    duration?: string;
    client?: string;
  } | null;
}

export default function PortfolioModal({
  isOpen,
  onClose,
  project,
}: PortfolioModalProps) {
  // ✅ Hooks always at top
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const openFullscreen = (index: number) => setFullscreenIndex(index);
  const closeFullscreen = () => setFullscreenIndex(null);

  const showPrev = fullscreenIndex !== null && fullscreenIndex > 0;
  const showNext =
    fullscreenIndex !== null &&
    project !== null &&
    fullscreenIndex < project.images.length - 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenIndex === null) return;
      if (e.key === "ArrowLeft" && showPrev)
        setFullscreenIndex(fullscreenIndex - 1);
      if (e.key === "ArrowRight" && showNext)
        setFullscreenIndex(fullscreenIndex + 1);
      if (e.key === "Escape") closeFullscreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenIndex, showPrev, showNext]);

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || fullscreenIndex === null || !project)
      return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;

    if (deltaX > 50 && showPrev) setFullscreenIndex(fullscreenIndex - 1);
    else if (deltaX < -50 && showNext) setFullscreenIndex(fullscreenIndex + 1);

    touchStartX.current = null;
  };

  // If no project, render an empty fragment instead of null (hooks safe)
  if (!project) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl w-full max-h-[90vh] overflow-y-auto p-0"
        data-testid="modal-portfolio"
      >
        <DialogTitle className="sr-only">
          {project.title} Project Details
        </DialogTitle>

        {/* Fullscreen overlay */}
        {fullscreenIndex !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              className="absolute top-5 right-5 text-white"
              onClick={closeFullscreen}
            >
              <X className="h-8 w-8" />
            </button>

            {showPrev && (
              <button
                className="absolute left-5 text-white"
                onClick={() => setFullscreenIndex(fullscreenIndex - 1)}
              >
                <ChevronLeft className="h-12 w-12" />
              </button>
            )}

            <img
              src={project.images[fullscreenIndex]}
              alt={`${project.title} - image ${fullscreenIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-md shadow-lg transition-all"
            />

            {showNext && (
              <button
                className="absolute right-5 text-white"
                onClick={() => setFullscreenIndex(fullscreenIndex + 1)}
              >
                <ChevronRight className="h-12 w-12" />
              </button>
            )}
          </div>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-sm text-gold-500 font-medium mb-2">
                {project.category}
              </div>
              <h3 className="font-serif text-3xl font-bold text-charcoal-800">
                {project.title}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-charcoal-600 hover:text-charcoal-800"
              data-testid="button-close-modal"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {project.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${project.title} - image ${idx + 1}`}
                className="w-full h-64 object-cover rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform"
                onClick={() => openFullscreen(idx)}
              />
            ))}
          </div>

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="font-semibold text-charcoal-800 mb-4">
                Project Details
              </h4>
              <div className="space-y-3 text-charcoal-600">
                {project.location && (
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{project.location}</span>
                  </div>
                )}
                {project.size && (
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{project.size}</span>
                  </div>
                )}
                {project.duration && (
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{project.duration}</span>
                  </div>
                )}
                {project.client && (
                  <div className="flex justify-between">
                    <span>Client:</span>
                    <span className="font-medium">{project.client}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-charcoal-800 mb-4">
                About This Project
              </h4>
              <div
                className="text-charcoal-600 leading-relaxed"
                data-testid="text-modal-description"
              >
                {project.description}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="border-t border-cream-300 pt-6 text-center">
            <h4 className="font-serif text-xl font-semibold text-charcoal-800 mb-4">
              Love This Design?
            </h4>
            <p className="text-charcoal-600 mb-6">
              Get a personalized quote for a similar project tailored to your
              space and style.
            </p>
            <Link href="/contact" data-testid="button-get-quote">
              <Button
                size="lg"
                className="bg-gold-500 text-white hover:bg-gold-600"
                onClick={onClose}
              >
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

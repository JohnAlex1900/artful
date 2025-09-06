import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    category: string;
    images: string[]; // ✅ changed from image: string
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
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl w-full max-h-[90vh] overflow-y-auto p-0"
        data-testid="modal-portfolio"
      >
        <DialogTitle className="sr-only">
          {project.title} Project Details
        </DialogTitle>
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

          {/* ✅ Image Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {project.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${project.title} - image ${idx + 1}`}
                className="w-full h-64 object-cover rounded-xl shadow-md"
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

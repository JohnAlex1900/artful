import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  showScrollIndicator?: boolean;
}

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
  showScrollIndicator = false,
}: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-20"
      data-dark-section="true"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-gradient"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Transforming Spaces with
          <br />
          <span className="text-gold-400">Artful Design</span>
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 text-cream-100 font-light max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <Link href={ctaLink} data-testid="button-hero-cta">
            <Button
              size="lg"
              className="bg-gold-500 text-white hover:bg-gold-600 transform hover:scale-105 transition-all duration-300"
            >
              {ctaText}
            </Button>
          </Link>
        )}
      </div>

      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      )}
    </section>
  );
}

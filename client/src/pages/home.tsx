import { Link } from "wouter";
import HeroSection from "@/components/hero-section";
import ServiceCard from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Transforming Spaces with Artful Design"
        subtitle="Creating sophisticated interiors and exteriors that reflect your unique style and enhance your lifestyle"
        ctaText="Explore Our Work"
        ctaLink="/portfolio"
        showScrollIndicator={true}
      />

      {/* Service Highlights Section */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-800 mb-6">
              Our Expertise
            </h2>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              We specialize in creating exceptional spaces across residential,
              commercial, and hospitality sectors
            </p>
          </div>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            data-testid="services-grid"
          >
            {SERVICES.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                image={service.images?.[0]}
                link={service.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-800 mb-6">
                Where Vision Meets{" "}
                <span className="text-gold-500">Excellence</span>
              </h2>
              <p className="text-lg text-charcoal-600 mb-8 leading-relaxed">
                With over a decade of experience in transforming spaces, Artful
                Structures Limited combines innovative design thinking with
                meticulous attention to detail. We believe that every space
                tells a story, and we're here to help you tell yours
                beautifully.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about" data-testid="button-read-story">
                  <Button className="bg-gold-500 text-white hover:bg-gold-600">
                    Read Our Story
                  </Button>
                </Link>
                <Link href="/design-process" data-testid="button-our-process">
                  <Button
                    variant="outline"
                    className="border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white"
                  >
                    Our Process
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
                alt="Design team at work"
                className="rounded-2xl shadow-lg w-full h-auto"
                data-testid="img-team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-charcoal-800 py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-cream-100 mb-8 max-w-2xl mx-auto">
            Let's bring your vision to life with our expert design services and
            personalized approach
          </p>
          <Link href="/contact" data-testid="button-contact-today">
            <Button
              size="lg"
              className="bg-gold-500 text-white hover:bg-gold-600 transform hover:scale-105 transition-all duration-300"
            >
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

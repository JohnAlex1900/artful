import { Link } from "wouter";
import HeroSection from "@/components/hero-section";
import ServiceCard from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/constants";
import Reveal from "@/components/reveal";
import { useQuery } from "@tanstack/react-query";
import { getSiteContent } from "@/lib/cms";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";

export default function Home() {
  const { data: siteContent } = useQuery({
    queryKey: ["site-content"],
    queryFn: getSiteContent,
  });

  const heroSlides =
    siteContent?.home.heroSlides?.length
      ? siteContent.home.heroSlides
      : DEFAULT_SITE_CONTENT.home.heroSlides;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection slides={heroSlides} showScrollIndicator={true} />

      {/* Service Highlights Section */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-800 mb-6">
                Our Expertise
              </h2>
              <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
                We specialize in creating exceptional spaces across residential,
                commercial, and hospitality sectors
              </p>
            </div>
          </Reveal>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            data-testid="services-grid"
          >
            {SERVICES.map((service, index) => (
              <Reveal key={index} delay={index * 0.15}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  image={service.images?.[0]}
                  link={service.link}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal className="order-2 lg:order-1">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-800 mb-6">
                  Where Vision Meets{" "}
                  <span className="text-gold-500">Excellence</span>
                </h2>
                <p className="text-lg text-charcoal-600 mb-8 leading-relaxed">
                  With over a decade of experience in transforming spaces,
                  Artful Structures Limited combines innovative design thinking
                  with meticulous attention to detail. We believe that every
                  space tells a story, and we're here to help you tell yours
                  beautifully.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Reveal delay={0.1}>
                    <Link href="/about" data-testid="button-read-story">
                      <Button className="bg-gold-500 text-white hover:bg-gold-600">
                        Read Our Story
                      </Button>
                    </Link>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <Link
                      href="/design-process"
                      data-testid="button-our-process"
                    >
                      <Button
                        variant="outline"
                        className="border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white"
                      >
                        Our Process
                      </Button>
                    </Link>
                  </Reveal>
                </div>
              </div>
            </Reveal>
            <Reveal className="order-1 lg:order-2" delay={0.3}>
              <img
                src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
                alt="Design team at work"
                className="rounded-2xl shadow-lg w-full h-auto"
                data-testid="img-team"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-charcoal-800 py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Space?
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-xl text-cream-100 mb-8 max-w-2xl mx-auto">
              Let's bring your vision to life with our expert design services
              and personalized approach
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link href="/contact" data-testid="button-contact-today">
              <Button
                size="lg"
                className="bg-gold-500 text-white hover:bg-gold-600 transform hover:scale-105 transition-all duration-300"
              >
                Contact Us Today
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

import { Link } from "wouter";
import HeroSection from "@/components/hero-section";
import ServiceCard from "@/components/service-card";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/reveal";
import { useResolvedSiteContent } from "@/lib/cms-preview";

export default function Home() {
  const siteContent = useResolvedSiteContent();

  const heroSlides = siteContent.home.heroSlides;
  const homeContent = siteContent.home;
  const highlight = homeContent.aboutTeaser.highlightText;
  const highlightIndex = homeContent.aboutTeaser.title.indexOf(highlight);
  const teaserTitleBefore =
    highlightIndex >= 0
      ? homeContent.aboutTeaser.title.slice(0, highlightIndex)
      : homeContent.aboutTeaser.title;
  const teaserTitleAfter =
    highlightIndex >= 0
      ? homeContent.aboutTeaser.title.slice(highlightIndex + highlight.length)
      : "";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection slides={heroSlides} showScrollIndicator={true} />

      {/* Service Highlights Section */}
      <section className="py-14 md:py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-charcoal-800 mb-4 md:mb-6">
                {homeContent.expertise.title}
              </h2>
              <p className="text-base md:text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
                {homeContent.expertise.subtitle}
              </p>
            </div>
          </Reveal>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8"
            data-testid="services-grid"
          >
            {homeContent.expertise.cards.map((service, index) => (
              <Reveal key={index} delay={index * 0.15}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  image={service.image}
                  link={service.link}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal className="order-2 lg:order-1">
              <div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-charcoal-800 mb-4 md:mb-6 leading-tight">
                  {teaserTitleBefore}
                  {highlightIndex >= 0 ? (
                    <span className="text-gold-500">{highlight}</span>
                  ) : null}
                  {teaserTitleAfter}
                </h2>
                <p className="text-base md:text-lg text-charcoal-600 mb-6 md:mb-8 leading-relaxed">
                  {homeContent.aboutTeaser.body}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Reveal delay={0.1}>
                    <Link href={homeContent.aboutTeaser.primaryButtonLink} data-testid="button-read-story">
                      <Button className="bg-gold-500 text-white hover:bg-gold-600 w-full sm:w-auto">
                        {homeContent.aboutTeaser.primaryButtonText}
                      </Button>
                    </Link>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <Link
                      href={homeContent.aboutTeaser.secondaryButtonLink}
                      data-testid="button-our-process"
                    >
                      <Button
                        variant="outline"
                        className="border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white w-full sm:w-auto"
                      >
                        {homeContent.aboutTeaser.secondaryButtonText}
                      </Button>
                    </Link>
                  </Reveal>
                </div>
              </div>
            </Reveal>
            <Reveal className="order-1 lg:order-2" delay={0.3}>
              <img
                src={homeContent.aboutTeaser.image}
                alt="Design team at work"
                className="rounded-2xl shadow-lg w-full h-auto"
                data-testid="img-team"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-charcoal-800 py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              {homeContent.ctaStrip.title}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base md:text-xl text-cream-100 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              {homeContent.ctaStrip.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link href={homeContent.ctaStrip.buttonLink} data-testid="button-contact-today">
              <Button
                size="lg"
                className="bg-gold-500 text-white hover:bg-gold-600 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                {homeContent.ctaStrip.buttonText}
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

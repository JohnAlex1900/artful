import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useResolvedSiteContent } from "@/lib/cms-preview";
import {
  Home,
  Building,
  Utensils,
  Wrench,
  Palette,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  Shield,
} from "lucide-react";
import Reveal from "@/components/reveal";


const whyChooseUs = [
  {
    icon: <Users className="w-8 h-8 text-gold-500" />,
    title: "Expert Team",
    description:
      "Our experienced designers bring creativity, technical expertise, and passion to every project.",
  },
  {
    icon: <Clock className="w-8 h-8 text-gold-500" />,
    title: "Timely Delivery",
    description:
      "We respect your timeline and deliver projects on schedule without compromising quality.",
  },
  {
    icon: <Shield className="w-8 h-8 text-gold-500" />,
    title: "Quality Guarantee",
    description:
      "We stand behind our work with comprehensive warranties and ongoing support.",
  },
];

export default function Services() {
  const [location] = useLocation();
  const siteContent = useResolvedSiteContent();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "home":
        return <Home className="w-8 h-8" />;
      case "building":
        return <Building className="w-8 h-8" />;
      case "lightbulb":
        return <Lightbulb className="w-8 h-8" />;
      case "check-circle":
        return <CheckCircle className="w-8 h-8" />;
      case "palette":
        return <Palette className="w-8 h-8" />;
      default:
        return <Building className="w-8 h-8" />;
    }
  };

  const servicesCards = siteContent.servicesLanding.cards;

  useEffect(() => {
    // Check if there's a hash in the URL and scroll to that section
    if (location.includes("#")) {
      const hash = location.split("#")[1];
      const element = document.getElementById(hash);
      if (element) {
        // Small delay to ensure page has rendered
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-14 md:py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="text-center mb-10 md:mb-16">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-charcoal-800 mb-4 md:mb-6 leading-tight">
                Our <span className="text-gold-500">Services</span>
              </h1>
              <p className="text-base md:text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive design solutions tailored to transform your spaces
                and exceed your expectations
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-10 md:space-y-20">
            {servicesCards.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.2}>
                <div
                  id={service.id}
                  className={`grid lg:grid-cols-2 gap-8 md:gap-12 items-center scroll-mt-24 p-4 md:p-0 rounded-2xl md:rounded-none border border-cream-200 md:border-0 bg-cream-50/40 md:bg-transparent ${
                    index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                  }`}
                  data-testid={`service-${service.id}`}
                >
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="rounded-2xl shadow-lg w-full h-auto"
                      data-testid={`img-${service.id}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                  </div>

                  <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                    <div className="flex items-center mb-4 gap-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gold-500 rounded-full flex items-center justify-center text-white shrink-0">
                        {getServiceIcon(service.icon)}
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-800 leading-tight">
                          {service.title}
                        </h2>
                        <p className="text-base md:text-lg font-medium text-gold-500">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-base md:text-lg text-charcoal-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-6 md:mb-8">
                      <div>
                        <h4 className="font-semibold text-charcoal-800 mb-3">
                          What We Offer:
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-charcoal-600"
                            >
                              <CheckCircle className="w-4 h-4 text-gold-500 mr-2 mt-1 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-charcoal-800 mb-3">
                          Our Process:
                        </h4>
                        <ul className="space-y-2">
                          {service.process.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-charcoal-600"
                            >
                              <ArrowRight className="w-4 h-4 text-gold-500 mr-2 mt-1 flex-shrink-0" />
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      data-testid={`button-${service.id}-consultation`}
                    >
                      <Button className="bg-gold-500 text-white hover:bg-gold-600 w-full sm:w-auto">
                        Get Consultation
                      </Button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 md:py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-800 mb-4 md:mb-6">
                Why Choose{" "}
                <span className="text-gold-500">Artful Structures Limited</span>
              </h2>
              <p className="text-base md:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
                We combine creativity, expertise, and dedication to deliver
                exceptional design solutions
              </p>
            </div>
          </Reveal>

          <div
            className="grid md:grid-cols-3 gap-5 md:gap-8"
            data-testid="why-choose-us"
          >
            {whyChooseUs.map((item, index) => (
              <Reveal key={index} delay={index * 0.15}>
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      {item.icon}
                    </div>
                    <h3 className="font-serif text-lg md:text-xl font-semibold text-charcoal-800 mb-3 md:mb-4">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-charcoal-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-charcoal-800">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              Ready to Transform Your Space?
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base md:text-xl text-cream-100 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Contact us today to discuss your project and discover how our
              expert team can bring your vision to life
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" data-testid="button-get-quote">
                <Button
                  size="lg"
                  className="bg-gold-500 text-white hover:bg-gold-600 w-full sm:w-auto"
                >
                  Get Free Quote
                </Button>
              </Link>
              <Link href="/portfolio" data-testid="button-view-work">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-cream-100 text-gold-500 hover:bg-cream-100 hover:text-charcoal-800 w-full sm:w-auto"
                >
                  View Our Work
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

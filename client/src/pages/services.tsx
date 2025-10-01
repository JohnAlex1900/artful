import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const services = [
  {
    id: "home-interior",
    title: "Home Interior Design",
    subtitle: "Crafting Luxurious Living Experiences",
    description:
      "Transform your home into a sophisticated sanctuary that reflects your personality and lifestyle. Our comprehensive home interior design service combines elegant aesthetics with functional living solutions, creating spaces that are both beautiful and practical for modern family life.",
    icon: <Home className="w-8 h-8" />,
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1036777293444526725/original/cefd30cc-b5f2-4780-bfc7-a67978689e87.jpeg?im_w=720",
    features: [
      "Complete home design and styling",
      "Living room and bedroom design",
      "Kitchen and dining area planning",
      "Bathroom design and renovation",
      "Custom storage and built-in solutions",
      "Luxury finishes and material selection",
    ],
    process: [
      "Lifestyle assessment and space analysis",
      "Concept development and mood boards",
      "3D visualization and walkthroughs",
      "Project management and installation",
    ],
  },
  {
    id: "commercial-interior",
    title: "Commercial Interior Design",
    subtitle: "Professional Spaces That Inspire Excellence",
    description:
      "Create impressive commercial environments that enhance productivity, reflect your brand identity, and leave lasting impressions on clients. From modern offices to retail spaces, we design commercial interiors that drive business success and employee satisfaction.",
    icon: <Building className="w-8 h-8" />,
    image:
      "https://furniturepalacekenya.com/wp-content/uploads/2025/01/0O2A4852-768x512.jpg",
    features: [
      "Corporate office design and layout",
      "Reception and lobby areas",
      "Conference rooms and meeting spaces",
      "Retail and showroom design",
      "Restaurant and hospitality interiors",
      "Brand integration and signage",
    ],
    process: [
      "Business requirements analysis",
      "Space planning and workflow optimization",
      "Design development and approval",
      "Coordinated implementation with minimal disruption",
    ],
  },
  {
    id: "gypsum-ceilings",
    title: "Gypsum Ceilings",
    subtitle: "Architectural Excellence Above You",
    description:
      "Elevate your spaces with our expertly crafted gypsum ceiling solutions. We design and install stunning ceiling features that add architectural interest, improve acoustics, and provide elegant lighting integration while maintaining the highest standards of craftsmanship.",
    icon: <Lightbulb className="w-8 h-8" />,
    image:
      "https://i.ibb.co/9kqVWWF5/Whats-App-Image-2025-09-02-at-23-42-26.jpg",
    features: [
      "Custom gypsum ceiling design",
      "Coffered and tray ceiling installation",
      "Integrated lighting solutions",
      "Acoustic ceiling treatments",
      "False ceiling installations",
      "Decorative ceiling features",
    ],
    process: [
      "Structural assessment and measurements",
      "Custom design and engineering",
      "Professional installation and finishing",
      "Lighting integration and final touches",
    ],
  },
  {
    id: "flooring-services",
    title: "Flooring Services",
    subtitle: "Foundation of Beautiful Design",
    description:
      "Complete your interior transformation with our comprehensive flooring solutions. From luxurious hardwood to contemporary tiles, we provide expert installation and finishing services that create stunning foundations for your beautifully designed spaces.",
    icon: <CheckCircle className="w-8 h-8" />,
    image:
      "https://i.ibb.co/YFmrRwYD/Whats-App-Image-2025-09-02-at-23-42-30-1.jpg",
    features: [
      "Hardwood flooring installation",
      "Luxury vinyl and laminate flooring",
      "Ceramic and porcelain tile installation",
      "Natural stone and marble flooring",
      "Carpet and area rug installation",
      "Floor refinishing and restoration",
    ],
    process: [
      "Flooring consultation and material selection",
      "Subfloor preparation and assessment",
      "Professional installation and finishing",
      "Quality inspection and final cleanup",
    ],
  },
  {
    id: "painting-services",
    title: "Painting Services",
    subtitle: "Color That Transforms Spaces",
    description:
      "Bring your design vision to life with our professional painting services. We combine premium materials, expert techniques, and meticulous attention to detail to deliver flawless finishes that complement your interior design and protect your investment.",
    icon: <Palette className="w-8 h-8" />,
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=831&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    features: [
      "Interior and exterior painting",
      "Color consultation and design",
      "Premium paint and finish selection",
      "Decorative painting techniques",
      "Wallpaper installation and removal",
      "Surface preparation and priming",
    ],
    process: [
      "Color consultation and sample testing",
      "Surface preparation and protection",
      "Professional painting and finishing",
      "Quality inspection and touch-ups",
    ],
  },
  {
    id: "office-partitioning",
    title: "Office Partitioning",
    subtitle: "Smart Space Division Solutions",
    description:
      "Optimize your workspace with our innovative office partitioning systems. We create flexible, functional divisions that enhance privacy, improve acoustics, and adapt to changing business needs while maintaining an open, collaborative atmosphere.",
    icon: <Building className="w-8 h-8" />,
    image:
      "https://www.officeworkdesign.com/wp-content/uploads/2023/02/modular-office-partitions-11.jpg",
    features: [
      "Glass partition systems",
      "Movable and modular partitions",
      "Acoustic partition solutions",
      "Custom millwork partitions",
      "Executive office enclosures",
      "Conference room divisions",
    ],
    process: [
      "Workspace analysis and planning",
      "Partition system design and selection",
      "Professional installation and integration",
      "Testing and final adjustments",
    ],
  },
];

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
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-charcoal-800 mb-6">
                Our <span className="text-gold-500">Services</span>
              </h1>
              <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
                Comprehensive design solutions tailored to transform your spaces
                and exceed your expectations
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.2}>
                <div
                  id={service.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center scroll-mt-24 ${
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
                    />
                  </div>

                  <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center text-white mr-4">
                        {service.icon}
                      </div>
                      <div>
                        <h2 className="font-serif text-3xl font-bold text-charcoal-800">
                          {service.title}
                        </h2>
                        <p className="text-lg font-medium text-gold-500">
                          {service.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-lg text-charcoal-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                      <Button className="bg-gold-500 text-white hover:bg-gold-600">
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
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-charcoal-800 mb-6">
                Why Choose{" "}
                <span className="text-gold-500">Artful Structures Limited</span>
              </h2>
              <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
                We combine creativity, expertise, and dedication to deliver
                exceptional design solutions
              </p>
            </div>
          </Reveal>

          <div
            className="grid md:grid-cols-3 gap-8"
            data-testid="why-choose-us"
          >
            {whyChooseUs.map((item, index) => (
              <Reveal key={index} delay={index * 0.15}>
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {item.icon}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal-800 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-charcoal-600">{item.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-charcoal-800">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-serif text-4xl font-bold text-white mb-6">
              Ready to Transform Your Space?
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-xl text-cream-100 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your project and discover how our
              expert team can bring your vision to life
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" data-testid="button-get-quote">
                <Button
                  size="lg"
                  className="bg-gold-500 text-white hover:bg-gold-600"
                >
                  Get Free Quote
                </Button>
              </Link>
              <Link href="/portfolio" data-testid="button-view-work">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-cream-100 text-gold-500 hover:bg-cream-100 hover:text-charcoal-800"
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

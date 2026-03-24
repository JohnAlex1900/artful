import { Lightbulb, Heart, CheckCircle } from "lucide-react";
import { COMPANY_VALUES } from "@/lib/constants";
import Reveal from "@/components/reveal"; // ✅ added
import { useResolvedSiteContent } from "@/lib/cms-preview";

export default function About() {
  const siteContent = useResolvedSiteContent();
  const aboutData = siteContent.about;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "lightbulb":
        return <Lightbulb className="w-8 h-8 text-white" />;
      case "heart":
        return <Heart className="w-8 h-8 text-white" />;
      case "check-circle":
        return <CheckCircle className="w-8 h-8 text-white" />;
      default:
        return <CheckCircle className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <section className="py-14 md:py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <Reveal>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-charcoal-800 mb-4 md:mb-6 leading-tight">
                {aboutData.heroTitle}
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base md:text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
                {aboutData.heroSubtitle}
              </p>
            </Reveal>
          </div>

          {/* Company Story */}
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 mb-14 md:mb-20 items-center">
            <div className="space-y-6">
              <Reveal>
                <h2 className="font-serif text-2xl md:text-4xl font-bold text-charcoal-800">
                  {aboutData.journeyTitle}
                </h2>
              </Reveal>
              {aboutData.journeyStory.map((story, index) => (
                <Reveal key={`story-${index}`} delay={0.1 + index * 0.1}>
                  <p className="text-base md:text-lg text-charcoal-600 leading-relaxed">
                    {story}
                  </p>
                </Reveal>
              ))}

              {/* Stats */}
              <div
                className="grid grid-cols-3 gap-3 md:gap-6 pt-4 md:pt-6"
                data-testid="stats-grid"
              >
                {[
                  { value: "250+", label: "Projects Completed" },
                  { value: "13", label: "Years Experience" },
                  { value: "200+", label: "Happy Clients" },
                ].map((stat, index) => (
                  <Reveal key={index} delay={0.3 + index * 0.15}>
                    <div className="text-center">
                      <div
                        className="text-2xl md:text-3xl font-bold text-gold-500 mb-1 md:mb-2"
                        data-testid={`stat-${stat.label
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm text-charcoal-600 font-medium leading-snug">
                        {stat.label}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Studio Image */}
            <Reveal delay={0.4}>
              <img
                src={aboutData.studioImage}
                alt="Our design studio"
                className="rounded-2xl shadow-lg w-full h-auto"
                data-testid="img-studio"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>

          {/* Mission & Values */}
          <div className="bg-white rounded-3xl p-6 md:p-12 mb-12 md:mb-16">
            <div className="text-center mb-8 md:mb-12">
              <Reveal>
                <h2 className="font-serif text-2xl md:text-4xl font-bold text-charcoal-800 mb-3 md:mb-4">
                  Our Mission
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-base md:text-lg text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
                  {aboutData.missionStatement}
                </p>
              </Reveal>
            </div>

            <div
              className="grid md:grid-cols-3 gap-5 md:gap-8"
              data-testid="values-grid"
            >
              {COMPANY_VALUES.map((value, index) => (
                <Reveal key={index} delay={index * 0.2}>
                  <div className="text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      {getIcon(value.icon)}
                    </div>
                    <h3 className="font-serif text-lg md:text-xl font-semibold text-charcoal-800 mb-3 md:mb-4">
                      {value.title}
                    </h3>
                    <p className="text-sm md:text-base text-charcoal-600 leading-relaxed">{value.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Target Customers */}
          <div className="text-center">
            <Reveal>
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-charcoal-800 mb-6 md:mb-8">
                Who We Serve
              </h2>
            </Reveal>
            <div
              className="grid md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
              data-testid="customers-grid"
            >
              {[
                {
                  title: "Homeowners",
                  desc: "Creating personalized living spaces",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  ),
                },
                {
                  title: "Businesses",
                  desc: "Professional office environments",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  ),
                },
                {
                  title: "Hotels & Restaurants",
                  desc: "Memorable hospitality experiences",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  ),
                },
                {
                  title: "Developers",
                  desc: "Large-scale project partnerships",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  ),
                },
              ].map((customer, index) => (
                <Reveal key={index} delay={index * 0.2}>
                  <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg">
                    <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {customer.icon}
                      </svg>
                    </div>
                    <h4 className="font-semibold text-charcoal-800 mb-2">
                      {customer.title}
                    </h4>
                    <p className="text-sm text-charcoal-600 leading-relaxed">{customer.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

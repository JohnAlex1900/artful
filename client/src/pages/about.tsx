import { Lightbulb, Heart, CheckCircle } from "lucide-react";
import { COMPANY_VALUES } from "@/lib/constants";

export default function About() {
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
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-charcoal-800 mb-6">
              About{" "}
              <span className="text-gold-500">Artful Structures Limited</span>
            </h1>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              Founded on the belief that exceptional design has the power to
              transform lives
            </p>
          </div>

          {/* Company Story */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-800">
                Our Journey
              </h2>
              <p className="text-lg text-charcoal-600 leading-relaxed">
                Artful Structures Limited was born from a passion for creating
                spaces that inspire and elevate. Founded in 2010, we started as
                a small team of dedicated designers with a shared vision: to
                make exceptional design accessible to everyone.
              </p>
              <p className="text-lg text-charcoal-600 leading-relaxed">
                Over the years, we've grown into a full-service design firm, but
                our core philosophy remains unchanged. We believe that every
                space, whether residential or commercial, should reflect the
                personality and needs of those who inhabit it.
              </p>
              <div
                className="grid grid-cols-3 gap-6 pt-6"
                data-testid="stats-grid"
              >
                <div className="text-center">
                  <div
                    className="text-3xl font-bold text-gold-500 mb-2"
                    data-testid="stat-projects"
                  >
                    250+
                  </div>
                  <div className="text-charcoal-600 font-medium">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-3xl font-bold text-gold-500 mb-2"
                    data-testid="stat-years"
                  >
                    13
                  </div>
                  <div className="text-charcoal-600 font-medium">
                    Years Experience
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-3xl font-bold text-gold-500 mb-2"
                    data-testid="stat-clients"
                  >
                    200+
                  </div>
                  <div className="text-charcoal-600 font-medium">
                    Happy Clients
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Our design studio"
                className="rounded-2xl shadow-lg w-full h-auto"
                data-testid="img-studio"
              />
            </div>
          </div>

          {/* Mission & Values */}
          <div className="bg-white rounded-3xl p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-800 mb-4">
                Our Mission & Values
              </h2>
              <p className="text-lg text-charcoal-600 max-w-3xl mx-auto">
                We're driven by core values that guide every project and client
                relationship
              </p>
            </div>

            <div
              className="grid md:grid-cols-3 gap-8"
              data-testid="values-grid"
            >
              {COMPANY_VALUES.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    {getIcon(value.icon)}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-charcoal-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-charcoal-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Target Customers */}
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-800 mb-8">
              Who We Serve
            </h2>
            <div
              className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              data-testid="customers-grid"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </div>
                <h4 className="font-semibold text-charcoal-800 mb-2">
                  Homeowners
                </h4>
                <p className="text-sm text-charcoal-600">
                  Creating personalized living spaces
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
                <h4 className="font-semibold text-charcoal-800 mb-2">
                  Businesses
                </h4>
                <p className="text-sm text-charcoal-600">
                  Professional office environments
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </div>
                <h4 className="font-semibold text-charcoal-800 mb-2">
                  Hotels & Restaurants
                </h4>
                <p className="text-sm text-charcoal-600">
                  Memorable hospitality experiences
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <h4 className="font-semibold text-charcoal-800 mb-2">
                  Developers
                </h4>
                <p className="text-sm text-charcoal-600">
                  Large-scale project partnerships
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

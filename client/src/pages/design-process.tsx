import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { PROCESS_STEPS } from "@/lib/constants";
import { useState, useEffect } from "react";
import Reveal from "@/components/reveal";

export default function DesignProcess() {
  // We'll store a map of stepNumber => current image index for steps with multiple images
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: number]: number;
  }>({});

  useEffect(() => {
    const intervalIds: number[] = [];

    PROCESS_STEPS.forEach((step) => {
      if (Array.isArray(step.images) && step.images.length > 1) {
        // Initialize index
        setCurrentImageIndex((prev) => ({ ...prev, [step.number]: 0 }));

        // Setup interval for fade transition
        const id = setInterval(() => {
          setCurrentImageIndex((prev) => ({
            ...prev,
            [step.number]: (prev[step.number] + 1) % step.images.length,
          }));
        }, 4000); // 4 seconds per image
        intervalIds.push(id);
      }
    });

    return () => {
      intervalIds.forEach((id) => clearInterval(id));
    };
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Reveal>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-charcoal-800 mb-6">
                Our <span className="text-gold-500">Design Process</span>
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
                A systematic approach that ensures your vision becomes reality
                through careful planning and expert execution
              </p>
            </Reveal>
          </div>

          {/* Process Steps */}
          <div className="max-w-6xl mx-auto">
            {PROCESS_STEPS.map((step, index) => {
              const images = Array.isArray(step.images)
                ? step.images
                : [step.images];
              const currentIdx = currentImageIndex[step.number] || 0;

              return (
                <Reveal key={step.number} delay={index * 0.2}>
                  <div
                    className={`flex flex-col lg:flex-row items-center gap-12 mb-20 ${
                      index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                    data-testid={`step-${step.number}`}
                  >
                    {/* Text Content */}
                    <div className="lg:w-1/2">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-xl">
                            {step.number}
                          </span>
                        </div>
                        <h3 className="font-serif text-3xl font-bold text-charcoal-800">
                          {step.title}
                        </h3>
                      </div>
                      <h4 className="text-xl font-semibold text-charcoal-700 mb-4">
                        {step.subtitle}
                      </h4>
                      <p className="text-lg text-charcoal-600 mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      <ul className="space-y-2 text-charcoal-600">
                        {step.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-gold-500 mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Image Content */}
                    <div className="lg:w-1/2 relative w-full h-96">
                      {images.map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`${step.title} - image ${imgIndex + 1}`}
                          className={`absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg transition-opacity duration-1000 ${
                            imgIndex === currentIdx
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          data-testid={`img-step-${step.number}-${imgIndex}`}
                        />
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* CTA Section */}
          <Reveal delay={0.3}>
            <div className="text-center mt-16 bg-cream-50 rounded-3xl p-12">
              <h3 className="font-serif text-3xl font-bold text-charcoal-800 mb-6">
                Ready to Start Your{" "}
                <span className="text-gold-500">Design Journey</span>?
              </h3>
              <p className="text-lg text-charcoal-600 mb-8 max-w-2xl mx-auto">
                Let's discuss your project and see how our proven process can
                transform your space
              </p>
              <Link href="/contact" data-testid="button-start-project">
                <Button
                  size="lg"
                  className="bg-gold-500 text-white hover:bg-gold-600"
                >
                  Start Your Project
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

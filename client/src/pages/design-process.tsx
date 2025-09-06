import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { PROCESS_STEPS } from "@/lib/constants";

export default function DesignProcess() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-charcoal-800 mb-6">
              Our <span className="text-gold-500">Design Process</span>
            </h1>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              A systematic approach that ensures your vision becomes reality
              through careful planning and expert execution
            </p>
          </div>

          {/* Process Steps */}
          <div className="max-w-6xl mx-auto">
            {PROCESS_STEPS.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row items-center gap-12 mb-20 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
                data-testid={`step-${step.number}`}
              >
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
                <div className="lg:w-1/2">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="rounded-2xl shadow-lg w-full h-auto"
                    data-testid={`img-step-${step.number}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
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
        </div>
      </section>
    </div>
  );
}

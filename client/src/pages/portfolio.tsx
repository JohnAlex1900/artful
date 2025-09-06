import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PortfolioModal from "@/components/portfolio-modal";
import { PORTFOLIO_PROJECTS } from "@/lib/constants";

type Category =
  | "all"
  | "residential"
  | "commercial"
  | "hospitality"
  | "transformations";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = [
    { key: "all" as Category, label: "All Projects" },
    { key: "residential" as Category, label: "Residential" },
    { key: "commercial" as Category, label: "Commercial" },
    { key: "hospitality" as Category, label: "Hospitality" },
    { key: "transformations" as Category, label: "Transformations" },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter(
          (project) => project.category === activeCategory
        );

  const openModal = (project: any) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <section className="py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-charcoal-800 mb-6">
              Our <span className="text-gold-500">Portfolio</span>
            </h1>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              Explore our collection of thoughtfully designed spaces that
              showcase our commitment to excellence
            </p>
          </div>

          {/* Portfolio Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              <div
                className="flex flex-wrap gap-2"
                data-testid="portfolio-tabs"
              >
                {categories.map((category) => (
                  <Button
                    key={category.key}
                    variant={
                      activeCategory === category.key ? "default" : "ghost"
                    }
                    onClick={() => setActiveCategory(category.key)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeCategory === category.key
                        ? "bg-gold-500 text-white hover:bg-gold-600"
                        : "text-charcoal-600 hover:text-gold-500"
                    }`}
                    data-testid={`tab-${category.key}`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Grid */}
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            data-testid="portfolio-grid"
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => openModal(project)}
                data-testid={`project-${project.id}`}
              >
                <img
                  src={project.images?.[0]} // ✅ show the first image
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-gold-500 font-medium mb-2">
                    {project.categoryLabel}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-charcoal-800 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-charcoal-600 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-3xl p-12">
            <h3 className="font-serif text-3xl font-bold text-charcoal-800 mb-6">
              Ready to Create Your{" "}
              <span className="text-gold-500">Dream Space</span>?
            </h3>
            <p className="text-lg text-charcoal-600 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can transform your space into something
              extraordinary
            </p>
            <Link href="/contact" data-testid="button-consultation">
              <Button
                size="lg"
                className="bg-gold-500 text-white hover:bg-gold-600"
              >
                Book a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Modal */}
      <PortfolioModal
        isOpen={modalOpen}
        onClose={closeModal}
        project={
          selectedProject
            ? {
                title: selectedProject.title,
                category: selectedProject.categoryLabel,
                images: selectedProject.images || [selectedProject.image], // ✅ fallback
                description: selectedProject.description,
                location: selectedProject.location,
                size: selectedProject.size,
                duration: selectedProject.duration,
                client: selectedProject.client,
              }
            : null
        }
      />
    </div>
  );
}

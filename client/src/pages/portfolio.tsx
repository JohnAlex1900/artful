import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PortfolioModal from "@/components/portfolio-modal";
import Reveal from "@/components/reveal";
import { useResolvedSiteContent } from "@/lib/cms-preview";

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

  const siteContent = useResolvedSiteContent();

  const projects = siteContent.portfolio.projects;

  const categories = [
    { key: "all" as Category, label: "All Projects" },
    { key: "residential" as Category, label: "Residential" },
    { key: "commercial" as Category, label: "Commercial" },
    { key: "hospitality" as Category, label: "Hospitality" },
    { key: "transformations" as Category, label: "Transformations" },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter(
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
      <section className="py-14 md:py-20 bg-cream-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <Reveal>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-charcoal-800 mb-4 md:mb-6 leading-tight">
                Our <span className="text-gold-500">Portfolio</span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base md:text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
                Explore our collection of thoughtfully designed spaces that
                showcase our commitment to excellence
              </p>
            </Reveal>
          </div>

          {/* Portfolio Navigation Tabs */}
          <Reveal delay={0.2}>
            <div className="mb-8 md:mb-12">
              <div className="bg-white rounded-xl p-2 shadow-lg overflow-x-auto">
                <div
                  className="flex gap-2 min-w-max"
                  data-testid="portfolio-tabs"
                >
                  {categories.map((category) => (
                    <Button
                      key={category.key}
                      variant={
                        activeCategory === category.key ? "default" : "ghost"
                      }
                      onClick={() => setActiveCategory(category.key)}
                      className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-200 whitespace-nowrap ${
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
          </Reveal>

          {/* Portfolio Grid */}
          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 mb-12 md:mb-16"
            data-testid="portfolio-grid"
          >
            {filteredProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.15}>
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer md:hover:scale-105"
                  onClick={() => openModal(project)}
                  data-testid={`project-${project.id}`}
                >
                  <img
                    src={project.images?.[0]} // ✅ show the first image
                    alt={project.title}
                    className="w-full h-52 md:h-64 object-cover"
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index < 2 ? "high" : "auto"}
                  />
                  <div className="p-5 md:p-6">
                    <div className="text-xs md:text-sm text-gold-500 font-medium mb-2">
                      {project.categoryLabel}
                    </div>
                    <h3 className="font-serif text-lg md:text-xl font-semibold text-charcoal-800 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm md:text-base text-charcoal-600 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA Section */}
          <Reveal delay={0.3}>
            <div className="text-center bg-white rounded-3xl p-6 md:p-12">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-800 mb-4 md:mb-6 leading-tight">
                Ready to Create Your{" "}
                <span className="text-gold-500">Dream Space</span>?
              </h3>
              <p className="text-base md:text-lg text-charcoal-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                Let's discuss how we can transform your space into something
                extraordinary
              </p>
              <Link href="/contact" data-testid="button-consultation">
                <Button
                  size="lg"
                  className="bg-gold-500 text-white hover:bg-gold-600 w-full sm:w-auto"
                >
                  Book a Consultation
                </Button>
              </Link>
            </div>
          </Reveal>
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

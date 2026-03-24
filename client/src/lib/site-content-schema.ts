import { z } from "zod";

export const heroSlideSchema = z.object({
  image: z.string().url(),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  ctaText: z.string().min(1),
  ctaLink: z.string().min(1),
});

export const homeExpertiseCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  link: z.string().min(1),
});

export const homeExpertiseSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  cards: z.array(homeExpertiseCardSchema).min(1),
});

export const homeAboutTeaserSchema = z.object({
  title: z.string().min(1),
  highlightText: z.string().min(1),
  body: z.string().min(1),
  primaryButtonText: z.string().min(1),
  primaryButtonLink: z.string().min(1),
  secondaryButtonText: z.string().min(1),
  secondaryButtonLink: z.string().min(1),
  image: z.string().url(),
});

export const homeCtaStripSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  buttonText: z.string().min(1),
  buttonLink: z.string().min(1),
});

export const portfolioProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  categoryLabel: z.string().min(1),
  images: z.array(z.string().url()).min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  size: z.string().min(1),
  duration: z.string().min(1),
  client: z.string().min(1),
});

export type ServiceNode = {
  title: string;
  link?: string;
  description: string;
  images: string[];
  subServices?: ServiceNode[];
};

export const serviceNodeSchema: z.ZodType<ServiceNode> = z.lazy(() =>
  z.object({
    title: z.string().min(1),
    link: z.string().optional(),
    description: z.string().min(1),
    images: z.array(z.string().url()),
    subServices: z.array(serviceNodeSchema).optional(),
  })
);

export const contactPerson = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
});

export const officeLocation = z.object({
  city: z.string().min(1),
  address: z.string().min(1),
});

export const socialLink = z.object({
  name: z.string().min(1),
  url: z.string().url().or(z.string().min(1)),
});

export const servicesCard = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  image: z.string().url(),
  features: z.array(z.string()).min(1),
  process: z.array(z.string()).min(1),
});

export const siteContentSchema = z.object({
  home: z.object({
    heroSlides: z.array(heroSlideSchema).min(1),
    expertise: homeExpertiseSchema,
    aboutTeaser: homeAboutTeaserSchema,
    ctaStrip: homeCtaStripSchema,
  }),
  portfolio: z.object({
    projects: z.array(portfolioProjectSchema).min(1),
  }),
  services: z.array(serviceNodeSchema).min(1),
  about: z.object({
    heroTitle: z.string().min(1),
    heroSubtitle: z.string().min(1),
    journeyTitle: z.string().min(1),
    journeyStory: z.array(z.string().min(1)),
    studioImage: z.string().url(),
    missionStatement: z.string().min(1),
  }),
  contact: z.object({
    people: z.array(contactPerson).min(1),
    email: z.string().email(),
    officeHours: z.string().min(1),
    offices: z.array(officeLocation).min(1),
    socialLinks: z.array(socialLink).min(1),
  }),
  servicesLanding: z.object({
    cards: z.array(servicesCard).min(1),
  }),
  updatedAt: z.any().optional(),
  updatedBy: z.string().optional(),
});

export type HeroSlide = z.infer<typeof heroSlideSchema>;
export type HomeExpertiseCard = z.infer<typeof homeExpertiseCardSchema>;
export type PortfolioProject = z.infer<typeof portfolioProjectSchema>;
export type ContactPerson = z.infer<typeof contactPerson>;
export type OfficeLocation = z.infer<typeof officeLocation>;
export type SocialLink = z.infer<typeof socialLink>;
export type ServicesCard = z.infer<typeof servicesCard>;
export type SiteContent = z.infer<typeof siteContentSchema>;

import { PORTFOLIO_PROJECTS } from "@/lib/constants";
import servicesData from "@/lib/services_data.json";
import type { SiteContent } from "@/lib/site-content-schema";

const defaultHeroSlides = [
  {
    image:
      "https://www.marthastewart.com/thmb/lxfu2-95SWCS0jwciHs1mkbsGUM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/modern-living-rooms-wb-1-bc45b0dc70e541f0ba40364ae6bd8421.jpg",
    headline: "Modern Living Spaces",
    subheadline: "Contemporary family homes that balance form and comfort.",
    ctaText: "Explore Our Work",
    ctaLink: "/portfolio",
  },
  {
    image: "https://images.pexels.com/photos/33512935/pexels-photo-33512935.jpeg",
    headline: "Luxury Bedrooms",
    subheadline: "Elegant, restful master bedrooms with premium finishes.",
    ctaText: "Explore Our Work",
    ctaLink: "/portfolio",
  },
  {
    image:
      "https://www.pakitchen.com/wp-content/uploads/2023/11/Elegant-Modern-Grey-Kitchen-Tour-Luxe-Design-and-Smart-Storage-Solutions-1-1500x1125.jpg",
    headline: "Contemporary Kitchens",
    subheadline: "Open-concept kitchens designed for cooking and entertaining.",
    ctaText: "Explore Our Work",
    ctaLink: "/portfolio",
  },
  {
    image: "https://furniturepalacekenya.com/wp-content/uploads/2024/01/0O2A3656.jpg",
    headline: "Productive Workspaces",
    subheadline: "Commercial interiors that inspire teams and clients.",
    ctaText: "Explore Our Work",
    ctaLink: "/portfolio",
  },
  {
    image:
      "https://media.houseandgarden.co.uk/photos/61894412d9ae96d083cd0fa2/16:9/w_2560%2Cc_limit/cms.jpg",
    headline: "Premium Retail & Hospitality",
    subheadline: "Memorable guest and shopper experiences shaped by design.",
    ctaText: "Explore Our Work",
    ctaLink: "/portfolio",
  },
];

const defaultAbout = {
  heroTitle: "About Artful Structures Limited",
  heroSubtitle:
    "Founded on the belief that exceptional design has the power to transform lives",
  journeyTitle: "Our Journey",
  journeyStory: [
    "Artful Structures Limited was born from a passion for creating spaces that inspire and elevate. Founded in 2010, we started as a small team of dedicated designers with a shared vision: to make exceptional design accessible to everyone.",
    "Over the years, we've grown into a full-service design firm, but our core philosophy remains unchanged. We believe that every space, whether residential or commercial, should reflect the personality and needs of those who inhabit it.",
  ],
  studioImage:
    "https://shiftersmovers.com/wp-content/uploads/2020/08/interior-5_032a01fa0_4062.jpg",
  missionStatement:
    "We're driven by core values that guide every project and client relationship",
};

const defaultContact = {
  people: [
    { name: "LANDO W. TITUS", phone: "+254 719 118 500" },
    { name: "TUMU MWAMINDI", phone: "+254 727 166 425" },
  ],
  email: "info.craftarchitectures@gmail.com",
  officeHours: "Mon - Fri, 8:00 AM - 6:00 PM",
  offices: [
    { city: "Nairobi Office", address: "Ruiru Bypass, Nairobi" },
    { city: "Mombasa Office", address: "Ukunda / Diani, Kwale" },
  ],
  socialLinks: [
    { name: "Facebook", url: "#" },
    {
      name: "Instagram",
      url: "https://www.instagram.com/artfulstructures_.ltd?igsh=a3NxNDJ5NTR6NmJ0",
    },
    { name: "Twitter", url: "https://x.com/ARTFULSTRUCTURE" },
    { name: "TikTok", url: "https://www.tiktok.com/@artfulstructuresltd" },
  ],
};

const defaultServicesLanding = {
  cards: [
    {
      id: "home-interior",
      title: "Home Interior Design",
      subtitle: "Crafting Luxurious Living Experiences",
      description:
        "Transform your home into a sophisticated sanctuary that reflects your personality and lifestyle. Our comprehensive home interior design service combines elegant aesthetics with functional living solutions, creating spaces that are both beautiful and practical for modern family life.",
      icon: "home",
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
      icon: "building",
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
      icon: "lightbulb",
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
      icon: "check-circle",
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
      icon: "palette",
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
      icon: "building",
      image:
        "https://www.officeworkdesign.com/wp-content/uploads/2023/02/modular-office-partitions-11.jpg",
      features: [
        "Frameless glass partitioning",
        "Aluminium and glass systems",
        "Gypsum partitions and divisions",
        "Acoustic enhancement solutions",
        "Customizable configurations",
        "Professional installation",
      ],
      process: [
        "Space analysis and planning",
        "Customized design solutions",
        "Material and finish selection",
        "Seamless installation and finishing",
      ],
    },
  ],
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  home: {
    heroSlides: defaultHeroSlides,
  },
  portfolio: {
    projects: PORTFOLIO_PROJECTS,
  },
  services: servicesData,
  about: defaultAbout,
  contact: defaultContact,
  servicesLanding: defaultServicesLanding,
};

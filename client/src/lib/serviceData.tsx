export interface ServiceItem {
  title: string;
  description: string;
  images: string[];
  subServices?: ServiceItem[];
}

export const SERVICES: ServiceItem[] = [
  // 1️⃣ Commercial Interior Design
  {
    title: "Commercial Interior Design",
    description:
      "Create impressive commercial environments that enhance productivity, reflect your brand identity, and leave lasting impressions on clients.",
    images: [
      "https://images.unsplash.com/photo-1598300050882-5c44c9a4c45f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    ],
    subServices: [
      {
        title: "Clubs",
        description: "Design vibrant and luxurious clubs.",
        images: [
          "https://images.unsplash.com/photo-1611599534356-16c6d31f8df1?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Boutiques",
        description: "Stylish and functional boutique spaces.",
        images: [
          "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Schools",
        description: "Inspiring educational spaces.",
        images: [
          "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Hospitals",
        description: "Efficient and calming hospital interiors.",
        images: [
          "https://images.unsplash.com/photo-1588776814546-5cdb5ed0e6c0?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Salons & Spas",
        description: "Elegant and relaxing interiors.",
        images: [
          "https://images.unsplash.com/photo-1616628185565-6d89b99f1142?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Showrooms",
        description: "Showcases that highlight your products.",
        images: [
          "https://images.unsplash.com/photo-1616628185156-6d89b99f1143?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Hotels & Restaurants",
        description: "Luxurious and functional hospitality spaces.",
        images: [
          "https://images.unsplash.com/photo-1601925269134-d157a9b2b1c7?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Malls",
        description: "Commercial mall interior solutions.",
        images: [
          "https://images.unsplash.com/photo-1613145996805-45c1f0a2675f?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Apartments",
        description: "Stylish and functional apartment designs.",
        images: [
          "https://images.unsplash.com/photo-1600585154211-0a3a1b1d3c7f?auto=format&fit=crop&w=800&q=80",
        ],
      },
    ],
  },

  // 2️⃣ Residential Interior Design
  {
    title: "Residential Interior Design",
    description:
      "Transform homes into sophisticated living spaces that balance aesthetics, comfort, and functionality.",
    images: [
      "https://images.unsplash.com/photo-1600585154211-0a3a1b1d3c7f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598300042030-7a45f1a3b6b7?auto=format&fit=crop&w=800&q=80",
    ],
    subServices: [
      {
        title: "Living Rooms",
        description: "Elegant and cozy living rooms.",
        images: [
          "https://images.unsplash.com/photo-1580584126609-8e78b1d4f9d7?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Bedrooms",
        description: "Serene and stylish bedrooms.",
        images: [
          "https://images.unsplash.com/photo-1598300042030-8c45f1a3b6c2?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Kitchens",
        description: "Functional and luxurious kitchens.",
        images: [
          "https://images.unsplash.com/photo-1600585154211-1a3a1b1d3c8f?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Washrooms",
        description: "Modern and clean washroom designs.",
        images: [
          "https://images.unsplash.com/photo-1600585154211-washroom?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Dining Rooms",
        description: "Elegant dining spaces for family and guests.",
        images: [
          "https://images.unsplash.com/photo-1600585154211-dining?auto=format&fit=crop&w=800&q=80",
        ],
      },
    ],
  },

  // 3️⃣ Gypsum Ceilings
  {
    title: "Gypsum Ceilings",
    description:
      "Elevate your spaces with beautifully crafted gypsum ceiling designs and installations.",
    images: [
      "https://images.unsplash.com/photo-1588776814000-5cdb5ed0e6d1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613145996805-45c1f0a2675g?auto=format&fit=crop&w=800&q=80",
    ],
  },

  // 4️⃣ Wallpaper
  {
    title: "Wallpaper",
    description:
      "Stylish and modern wallpaper designs that transform walls into elegant features.",
    images: [
      "https://images.unsplash.com/photo-1590490351001-abc12345def?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601925269135-123abc456?auto=format&fit=crop&w=800&q=80",
    ],
  },

  // 5️⃣ Window Blinds & Curtains
  {
    title: "Window Blinds & Curtains",
    description:
      "Custom window treatments to complement your interior style and provide light control.",
    images: [
      "https://images.unsplash.com/photo-1590490351200-abc6789?auto=format&fit=crop&w=800&q=80",
    ],
    subServices: [
      {
        title: "Window Blinds",
        description: "High-quality, functional, and stylish blinds.",
        images: [
          "https://images.unsplash.com/photo-1590490351201-blinds1?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Curtains",
        description: "Elegant and versatile curtain designs.",
        images: [
          "https://images.unsplash.com/photo-1590490351202-curtains1?auto=format&fit=crop&w=800&q=80",
        ],
      },
    ],
  },

  // 6️⃣ Flooring Services
  {
    title: "Flooring Services",
    description:
      "Premium flooring solutions including hardwood, tiles, carpets, and luxury finishes.",
    images: [
      "https://images.unsplash.com/photo-1601925269100-floor1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601925269101-floor2?auto=format&fit=crop&w=800&q=80",
    ],
    subServices: [
      {
        title: "Wall to Wall Carpet",
        description: "Soft, durable wall-to-wall carpets.",
        images: [
          "https://images.unsplash.com/photo-1601925269102-wallcarpet?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Artificial Green Carpet",
        description: "Eco-friendly artificial green carpets.",
        images: [
          "https://images.unsplash.com/photo-1601925269103-artcarpet?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Mkeka wa Mbao",
        description: "Traditional wooden mat flooring.",
        images: [
          "https://images.unsplash.com/photo-1601925269104-mkeka?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Tile Work",
        description: "Stylish and durable tile installations.",
        images: [
          "https://images.unsplash.com/photo-1601925269105-tiles?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Wooden Floors",
        description: "Elegant hardwood flooring solutions.",
        images: [
          "https://images.unsplash.com/photo-1601925269106-wood?auto=format&fit=crop&w=800&q=80",
        ],
      },
    ],
  },

  // 7️⃣ Painting in Kenya
  {
    title: "Painting in Kenya",
    description:
      "Professional painting services delivering flawless finishes for interior and exterior spaces.",
    images: [
      "https://images.unsplash.com/photo-1600585154311-paint1?auto=format&fit=crop&w=800&q=80",
    ],
    subServices: [
      {
        title: "General Painting",
        description: "Interior and exterior painting.",
        images: [
          "https://images.unsplash.com/photo-1600585154312-generalpaint?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        title: "Special Paint Effect",
        description: "Decorative and effect painting.",
        images: [
          "https://images.unsplash.com/photo-1600585154313-specialpaint?auto=format&fit=crop&w=800&q=80",
        ],
      },
    ],
  },
];

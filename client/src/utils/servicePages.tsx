// src/utils/servicePages.tsx
import { lazy } from "react";

// Lazy-load all service pages statically
export const SERVICE_PAGES: Record<string, React.LazyExoticComponent<any>> = {
  "/services/commercial": lazy(
    () => import("@/pages/services/commercial-interior-design")
  ),
  "/services/commercial/clubs": lazy(
    () => import("@/pages/services/commercial-interior-design/clubs")
  ),
  "/services/commercial/boutiques": lazy(
    () => import("@/pages/services/commercial-interior-design/boutiques")
  ),
  "/services/commercial/schools": lazy(
    () => import("@/pages/services/commercial-interior-design/schools")
  ),
  "/services/commercial/hospitals": lazy(
    () => import("@/pages/services/commercial-interior-design/hospitals")
  ),
  "/services/commercial/salons": lazy(
    () => import("@/pages/services/commercial-interior-design/salons-&-spas")
  ),
  "/services/commercial/showrooms": lazy(
    () => import("@/pages/services/commercial-interior-design/showrooms")
  ),
  "/services/commercial/hotels": lazy(
    () =>
      import("@/pages/services/commercial-interior-design/hotels-&-restaurants")
  ),
  "/services/commercial/malls": lazy(
    () => import("@/pages/services/commercial-interior-design/malls")
  ),
  "/services/commercial/apartments": lazy(
    () => import("@/pages/services/commercial-interior-design/apartments")
  ),

  "/services/residential": lazy(
    () => import("@/pages/services/residential-interior-design")
  ),
  "/services/residential/living": lazy(
    () => import("@/pages/services/residential-interior-design/living-rooms")
  ),
  "/services/residential/bedrooms": lazy(
    () => import("@/pages/services/residential-interior-design/bedrooms")
  ),
  "/services/residential/kitchens": lazy(
    () => import("@/pages/services/residential-interior-design/kitchens")
  ),
  "/services/residential/washrooms": lazy(
    () => import("@/pages/services/residential-interior-design/washrooms")
  ),
  "/services/residential/dining": lazy(
    () => import("@/pages/services/residential-interior-design/dining-rooms")
  ),

  "/services/gypsum": lazy(() => import("@/pages/services/gypsum-ceilings")),
  "/services/wallpaper": lazy(() => import("@/pages/services/wallpaper")),
  "/services/window-blinds": lazy(
    () => import("@/pages/services/window-blinds-&-curtains")
  ),
  "/services/window-blinds/blinds": lazy(
    () => import("@/pages/services/window-blinds-&-curtains/window-blinds")
  ),
  "/services/window-blinds/curtains": lazy(
    () => import("@/pages/services/window-blinds-&-curtains/curtains")
  ),

  "/services/flooring": lazy(
    () => import("@/pages/services/flooring-services")
  ),
  "/services/flooring/carpet": lazy(
    () => import("@/pages/services/flooring-services/artificial-green-carpet")
  ),
  "/services/flooring/mkeka": lazy(
    () => import("@/pages/services/flooring-services/mkeka-wa-mbao")
  ),
  "/services/flooring/tiles": lazy(
    () => import("@/pages/services/flooring-services/tile-work")
  ),
  "/services/flooring/wood": lazy(
    () => import("@/pages/services/flooring-services/wooden-floors")
  ),

  "/services/painting": lazy(
    () => import("@/pages/services/painting-in-kenya")
  ),
  "/services/painting/general": lazy(
    () => import("@/pages/services/painting-in-kenya/general-painting")
  ),
  "/services/painting/effect": lazy(
    () => import("@/pages/services/painting-in-kenya/special-paint-effect")
  ),

  "/services/cabinets": lazy(
    () => import("@/pages/services/kitchen-cabinets-&-wardrobes")
  ),
  "/services/partitioning": lazy(
    () => import("@/pages/services/office-partitioning-services")
  ),
  "/services/partitioning/frameless": lazy(
    () =>
      import("@/pages/services/office-partitioning-services/frameless-glass")
  ),
  "/services/partitioning/aluminium": lazy(
    () =>
      import("@/pages/services/office-partitioning-services/aluminium-&-glass")
  ),
  "/services/partitioning/gypsum": lazy(
    () =>
      import(
        "@/pages/services/office-partitioning-services/gypsum-partitioning"
      )
  ),
  "/services/partitioning/other": lazy(
    () =>
      import(
        "@/pages/services/office-partitioning-services/other-partitionings"
      )
  ),

  "/services/renovation": lazy(
    () => import("@/pages/services/home-&-office-renovation")
  ),
  "/services/signage": lazy(
    () => import("@/pages/services/3d-logos-&-signage")
  ),
  "/services/belka": lazy(() => import("@/pages/services/belka-cotton-paint")),
  "/services/exterior": lazy(
    () => import("@/pages/services/exterior-products-&-services")
  ),
  "/services/consultant": lazy(
    () => import("@/pages/services/interior-design-consultant")
  ),
  "/services/canvas": lazy(
    () => import("@/pages/services/canvas-painting-kenya")
  ),
  "/services/tv-units": lazy(() => import("@/pages/services/modern-tv-units")),
  "/services/wall-carpet": lazy(
    () => import("@/pages/services/wall-to-wall-carpets")
  ),
  "/services/wall-mural": lazy(() => import("@/pages/services/wall-mural")),
  "/services/wall-arts": lazy(
    () => import("@/pages/services/canvas-wall-arts")
  ),
  "/services/landscaping": lazy(() => import("@/pages/services/landscaping")),
  "/services/3d-renders": lazy(
    () => import("@/pages/services/floor-plans-&-3d-renders")
  ),
  "/services/furnishings": lazy(
    () => import("@/pages/services/home-&-office-furnishings")
  ),
  "/services/airbnb": lazy(() => import("@/pages/services/airbnbs")),
};

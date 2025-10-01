import ServicePage from "@/components/ServicePage";
import servicesData from "@/lib/services_data.json";

// Lookup service or subservice dynamically
let service = servicesData.find(s => s.title === "Flooring Services");
service = service.subServices?.find(ss => ss.title === 'Artificial Green Carpet')
export default function Page() {
  if (!service) return <div>Service not found</div>;
  return <ServicePage
    title={service.title}
    description={service.description}
    images={service.images}
  />;
}

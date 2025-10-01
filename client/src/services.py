import json
import os

# Paths
NAV_JSON_PATH = "./lib/nav_links.json"
SERVICES_DIR = "./pages/services"

# Template for each service page
PAGE_TEMPLATE = '''import ServicePage from "@/components/ServicePage";
import servicesData from "@/lib/services_data.json";

// Lookup service or subservice dynamically
let service = servicesData.find(s => s.title === "{title}");
{lookup_subservice}
export default function Page() {{
  if (!service) return <div>Service not found</div>;
  return <ServicePage
    title={{service.title}}
    description={{service.description}}
    images={{service.images}}
  />;
}}
'''


def create_page_file(folder_path, title, subservice_title=None):
    os.makedirs(folder_path, exist_ok=True)

    if subservice_title:
        # If a subservice, look it up under its parent service
        lookup_subservice = f"service = service.subServices?.find(ss => ss.title === '{subservice_title}')"
    else:
        lookup_subservice = ""

    page_code = PAGE_TEMPLATE.format(
        title=title,
        lookup_subservice=lookup_subservice
    )

    index_file = os.path.join(folder_path, "index.tsx")
    with open(index_file, "w", encoding="utf-8") as f:
        f.write(page_code)


def generate_pages(services):
    for service in services:
        service_folder = os.path.join(SERVICES_DIR, service["title"].lower().replace(" ", "-"))
        create_page_file(service_folder, service["title"])

        # Handle subServices if they exist
        for sub in service.get("subServices", []):
            sub_folder = os.path.join(service_folder, sub["title"].lower().replace(" ", "-"))
            create_page_file(sub_folder, service["title"], sub["title"])

# Load nav_links.json (optional)
with open(NAV_JSON_PATH, "r", encoding="utf-8") as f:
    nav_links = json.load(f)

# Load services data
with open("./lib/services_data.json", "r", encoding="utf-8") as f:
    services = json.load(f)

generate_pages(services)
print("All service pages generated successfully!")

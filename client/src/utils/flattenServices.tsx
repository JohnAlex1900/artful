import navLinks from "@/lib/nav_links.json";

export interface NavItem {
  title: string;
  link?: string;
  children?: NavItem[];
}

// Recursively flatten all service links
export function flattenServices(
  links: NavItem[]
): { title: string; link: string }[] {
  let result: { title: string; link: string }[] = [];

  links.forEach((link) => {
    if (link.link && link.link.startsWith("/services")) {
      result.push({ title: link.title, link: link.link });
    }
    if (link.children) {
      result = result.concat(flattenServices(link.children));
    }
  });

  return result;
}

export const FLATTENED_SERVICES = flattenServices(navLinks);

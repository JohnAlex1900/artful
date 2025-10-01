import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavbarTheme } from "@/hooks/use-navbar-theme";
import { NAV_LINKS } from "@/lib/constants";
import { NavLink } from "@/types/navigation";

export default function Navigation() {
  const [location] = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [hoveredSubMenu, setHoveredSubMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const isDarkBackground = useNavbarTheme();

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/" && location === "/") return true;
    return path !== "/" && location.startsWith(path);
  };

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navBarClasses = isDarkBackground
    ? "fixed top-0 left-0 right-0 z-50 bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-700"
    : "fixed top-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-cream-300";

  const logoClasses = "text-xl md:text-2xl font-serif font-bold leading-tight";
  const logoMainTextClasses = isDarkBackground
    ? "text-white"
    : "text-charcoal-800";
  const logoSubTextClasses = isDarkBackground
    ? "text-cream-200"
    : "text-charcoal-600";

  const renderNavLinks = (links: NavLink[], isMobileMenu = false) => (
    <ul
      className={`${
        isMobileMenu ? "flex flex-col space-y-2" : "flex space-x-6 items-center"
      }`}
    >
      {links.map((link) => {
        const hasChildren = !!link.children?.length;
        const key = link.title;

        return (
          <li
            key={key}
            className="relative"
            onMouseEnter={() => !isMobileMenu && setHoveredMenu(key)}
            onMouseLeave={() => !isMobileMenu && setHoveredMenu(null)}
          >
            <div
              className={`flex items-center justify-between ${
                isMobileMenu ? "w-full" : ""
              }`}
            >
              <Link
                href={link.link || "#"}
                onClick={() => {
                  if (isMobileMenu && hasChildren) toggleSubmenu(key);
                  if (isMobileMenu && !hasChildren) setMobileMenuOpen(false);
                }}
              >
                <span
                  className={`font-medium cursor-pointer flex items-center gap-1 ${
                    isActive(link.link)
                      ? "text-gold-500"
                      : isDarkBackground
                      ? "text-cream-100 hover:text-gold-500"
                      : "text-charcoal-700 hover:text-gold-500"
                  }`}
                >
                  {link.title}
                  {hasChildren && (
                    <ChevronDown
                      className={`w-4 h-4 mt-0.5 transition-transform duration-200 ${
                        isMobileMenu
                          ? openSubmenus[key]
                            ? "rotate-180"
                            : ""
                          : hoveredMenu === key
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  )}
                </span>
              </Link>

              {isMobileMenu && hasChildren && (
                <button
                  onClick={() => toggleSubmenu(key)}
                  className="ml-2 focus:outline-none"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openSubmenus[key] ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Submenu */}
            {hasChildren && (
              <ul
                className={`${
                  isMobileMenu
                    ? `pl-4 mt-2 space-y-2 ${
                        openSubmenus[key] ? "block" : "hidden"
                      }`
                    : `absolute top-full left-0 w-48 bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 rounded-md shadow-lg z-50 transition-all duration-200 ${
                        hoveredMenu === key
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`
                }`}
              >
                {link.children!.map((child) => {
                  const childHasChildren = !!child.children?.length;
                  const childKey = `${key}-${child.title}`;

                  return (
                    <li
                      key={childKey}
                      className="relative"
                      onMouseEnter={() =>
                        !isMobileMenu && setHoveredSubMenu(childKey)
                      }
                      onMouseLeave={() =>
                        !isMobileMenu && setHoveredSubMenu(null)
                      }
                    >
                      <Link
                        href={child.link || "#"}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-charcoal-800 flex justify-between items-center"
                        onClick={() => {
                          if (isMobileMenu && childHasChildren)
                            toggleSubmenu(childKey);
                        }}
                      >
                        {child.title}
                        {childHasChildren && (
                          <ChevronDown
                            className={`w-4 h-4 mt-0.5 transition-transform duration-200 ${
                              isMobileMenu
                                ? openSubmenus[childKey]
                                  ? "rotate-180"
                                  : "rotate-90"
                                : hoveredSubMenu === childKey
                                ? "rotate-180"
                                : "rotate-90"
                            }`}
                          />
                        )}
                      </Link>

                      {/* Sub-submenu */}
                      {childHasChildren && (
                        <ul
                          className={`${
                            isMobileMenu
                              ? `pl-4 mt-2 space-y-2 ${
                                  openSubmenus[childKey] ? "block" : "hidden"
                                }`
                              : `absolute top-0 left-full mt-0 w-48 bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 rounded-md shadow-lg z-50 transition-all duration-200 ${
                                  hoveredSubMenu === childKey
                                    ? "opacity-100 visible"
                                    : "opacity-0 invisible"
                                }`
                          }`}
                        >
                          {child.children!.map((subChild) => (
                            <li key={subChild.title}>
                              <Link
                                href={subChild.link || "#"}
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-charcoal-800"
                                onClick={() =>
                                  isMobileMenu && setMobileMenuOpen(false)
                                }
                              >
                                {subChild.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav className={navBarClasses}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className={logoClasses}>
              <span className={logoMainTextClasses}>ARTFUL</span>
              <span className="text-gold-500"> STRUCTURES</span>
              <div
                className={`text-xs md:text-sm font-medium ${logoSubTextClasses} -mt-1`}
              >
                LIMITED
              </div>
            </div>
          </Link>

          {!isMobile && renderNavLinks(NAV_LINKS ?? [])}

          {!isMobile && (
            <Link href="/contact" data-testid="button-consultation">
              <Button className="bg-gold-500 text-white hover:bg-gold-600">
                Get Consultation
              </Button>
            </Link>
          )}

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              className={
                isDarkBackground ? "text-cream-100 hover:text-gold-500" : ""
              }
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>

        {isMobile && mobileMenuOpen && (
          <div
            className={`py-4 border-t ${
              isDarkBackground ? "border-charcoal-700" : "border-cream-300"
            }`}
            data-testid="mobile-menu"
          >
            {renderNavLinks(NAV_LINKS ?? [], true)}
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="bg-gold-500 text-white hover:bg-gold-600 w-full mt-4">
                Get Consultation
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

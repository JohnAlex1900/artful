import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavbarTheme } from "@/hooks/use-navbar-theme";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const isDarkBackground = useNavbarTheme();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/design-process", label: "Design Process" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  // Dynamic styles based on background
  const navBarClasses = isDarkBackground 
    ? "fixed top-0 left-0 right-0 z-50 bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-700"
    : "fixed top-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-cream-300";
    
  const logoClasses = isDarkBackground
    ? "text-xl md:text-2xl font-serif font-bold leading-tight"
    : "text-xl md:text-2xl font-serif font-bold leading-tight";
    
  const logoMainTextClasses = isDarkBackground 
    ? "text-white" 
    : "text-charcoal-800";
    
  const logoSubTextClasses = isDarkBackground 
    ? "text-cream-200" 
    : "text-charcoal-600";

  return (
    <nav className={navBarClasses}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className={logoClasses}>
              <span className={logoMainTextClasses}>ARTFUL</span><span className="text-gold-500"> STRUCTURES</span>
              <div className={`text-xs md:text-sm font-medium ${logoSubTextClasses} -mt-1`}>LIMITED</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <span className={`font-medium transition-colors duration-200 ${
                    isActive(item.path) 
                      ? "text-gold-500" 
                      : isDarkBackground 
                        ? "text-cream-100 hover:text-gold-500" 
                        : "text-charcoal-700 hover:text-gold-500"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
          
          {/* CTA Button */}
          {!isMobile && (
            <Link href="/contact" data-testid="button-consultation">
              <Button className="bg-gold-500 text-white hover:bg-gold-600">
                Get Consultation
              </Button>
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              className={isDarkBackground ? "text-cream-100 hover:text-gold-500" : ""}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
        </div>
        
        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className={`py-4 border-t ${isDarkBackground ? 'border-charcoal-700' : 'border-cream-300'}`} data-testid="mobile-menu">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <span className={`font-medium ${
                    isActive(item.path) 
                      ? "text-gold-500" 
                      : isDarkBackground 
                        ? "text-cream-100 hover:text-gold-500" 
                        : "text-charcoal-700 hover:text-gold-500"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="bg-gold-500 text-white hover:bg-gold-600 w-full mt-4">
                  Get Consultation
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-charcoal-800 text-cream-100 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="text-2xl md:text-3xl font-serif font-bold leading-tight">
                <span className="text-cream-100">ARTFUL</span>
                <span className="text-gold-500"> STRUCTURES</span>
              </div>
              <div className="text-sm font-medium text-cream-300 -mt-1">
                LIMITED
              </div>
            </div>
            <p className="text-cream-200 mb-6 max-w-md">
              Transforming spaces with artful design. We create sophisticated
              interiors and exteriors that reflect your unique style and enhance
              your lifestyle.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-cream-700 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors"
                data-testid="link-social-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/artfulstructures_.ltd?igsh=a3NxNDJ5NTR6NmJ0"
                className="w-10 h-10 bg-cream-700 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors"
                data-testid="link-social-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/ARTFULSTRUCTURE"
                className="w-10 h-10 bg-cream-700 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors"
                data-testid="link-social-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="www.tiktok.com/@artfulstructuresltd"
                className="w-10 h-10 bg-cream-700 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors"
                data-testid="link-social-tiktok"
              >
                <SiTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" data-testid="link-footer-about">
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services" data-testid="link-footer-services">
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Services
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/design-process" data-testid="link-footer-process">
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Our Process
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" data-testid="link-footer-portfolio">
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Portfolio
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="link-footer-contact">
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Contact
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services#home-interior"
                  data-testid="link-footer-residential"
                >
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Home Interior Design
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services#commercial-interior"
                  data-testid="link-footer-commercial"
                >
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Commercial Design
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services#gypsum-ceilings"
                  data-testid="link-footer-gypsum"
                >
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Gypsum Ceilings
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services#flooring-services"
                  data-testid="link-footer-flooring"
                >
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Flooring Services
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services#painting-services"
                  data-testid="link-footer-painting"
                >
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Painting Services
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services#office-partitioning"
                  data-testid="link-footer-office"
                >
                  <span className="text-cream-200 hover:text-gold-500 transition-colors">
                    Office Partitioning
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cream-200 text-sm mb-4 md:mb-0">
              © 2025 Artful Structures Limited. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-cream-200 hover:text-gold-500 transition-colors"
                data-testid="link-privacy"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-cream-200 hover:text-gold-500 transition-colors"
                data-testid="link-terms"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { footerLinks } from '@/config-footer';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and Description */}

          {/* Footer Links */}
          {footerLinks.map(section => (
            <div key={section.title}>
              <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.target || '_self'}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-border mt-12 border-t pt-8">
          <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p>
              © {new Date().getFullYear()} NextDentist. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-primary">
                Privacy
              </Link>
              <Link href="/terms-of-services" className="hover:text-primary">
                Terms
              </Link>
              <Link href="/accessibility" className="hover:text-primary">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

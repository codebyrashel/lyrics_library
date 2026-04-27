'use client';

import { getColors } from '@/store/colorStore';

const footerSections = [
  {
    title: 'Product',
    links: ['Features', 'How it Works', 'Pricing', 'Reviews']
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact']
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Cookies']
  },
  {
    title: 'Resources',
    links: ['Help Center', 'Community', 'Status', 'API Docs']
  }
];

export const FooterLinks = () => {
  const colors = getColors();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {footerSections.map((section) => (
        <div key={section.title}>
          <h3 
            className="font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: colors.text.secondary }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
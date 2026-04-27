'use client';

import { getColors } from '@/store/colorStore';
import { FooterBrand } from '@/components/layout/footer/FooterBrand';
import { FooterColumn } from '@/components/layout/footer/FooterColumn';
import { FooterBottom } from '@/components/layout/footer/FooterBottom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const colors = getColors();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '/faq' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer 
      className="pt-12 pb-6 mt-20"
      style={{ 
        backgroundColor: colors.surface,
        borderTop: `1px solid ${colors.surface}`
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <FooterBrand />
          <FooterColumn title="Product" links={footerLinks.product} />
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Legal" links={footerLinks.legal} />
        </div>
        
        {/* Bottom Bar */}
        <FooterBottom currentYear={currentYear} />
      </div>
    </footer>
  );
};
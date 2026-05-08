'use client';

import { Sparkles, Info, DollarSign, Star } from 'lucide-react';
import { getColors } from '@/store/colorStore';

const navLinks = [
  { name: 'Features', icon: Sparkles, href: '/#features' },
  { name: 'How it Works', icon: Info, href: '/#how-it-works' },
  { name: 'Pricing', icon: DollarSign, href: '/#pricing' },
  { name: 'Reviews', icon: Star, href: '/#reviews' },
];

interface NavbarLinksProps {
  isMobile?: boolean;
  onClick?: () => void;
}

export const NavbarLinks = ({ isMobile = false, onClick }: NavbarLinksProps) => {
  const colors = getColors();
  
  return (
    <div className={isMobile ? 'flex flex-col' : 'hidden md:flex items-center gap-1'}>
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            onClick={onClick}
            className={`
              flex items-center gap-2 rounded-lg transition-colors duration-200
              ${isMobile ? 'px-4 py-3' : 'px-3 py-2'}
            `}
            style={{ 
              color: colors.text.secondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.text.muted}10`;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <Icon size={isMobile ? 20 : 18} />
            <span className={isMobile ? 'text-base' : 'text-sm'}>{link.name}</span>
          </a>
        );
      })}
    </div>
  );
};
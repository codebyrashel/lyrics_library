'use client';

import { useState } from 'react';
import { getColors } from '@/store/colorStore';
import { NavbarLogo } from '@/components/layout/navbar/NavbarLogo';
import { NavbarLinks } from '@/components/layout/navbar/NavbarLinks';
import { NavbarAuth } from '@/components/layout/navbar/NavbarAuth';
import { MobileMenuButton } from '@/components/layout/navbar/MobileMenuButton';
import { MobileMenu } from '@/components/layout/navbar/MobileMenu';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const colors = getColors();
  const pathname = usePathname();

  // Don't show navbar on room, guest-room, or dashboard pages
  if (pathname?.startsWith('/room') || pathname?.startsWith('/guest-room') || pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav 
      className="sticky top-0 z-50 shadow-sm"
      style={{ 
        backgroundColor: colors.background, 
        borderBottom: `1px solid ${colors.surface}` 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavbarLogo />
          
          {/* Desktop Navigation */}
          <NavbarLinks />
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <NavbarAuth />
          </div>
          
          {/* Mobile Menu Button */}
          <MobileMenuButton 
            isOpen={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
        </div>
        
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      </div>
    </nav>
  );
};
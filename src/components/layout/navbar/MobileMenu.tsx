'use client';

import { getColors } from '@/store/colorStore';
import { NavbarLinks } from './NavbarLinks';
import { NavbarAuth } from './NavbarAuth'; 

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const colors = getColors();
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="md:hidden py-4 border-t mt-2"
      style={{ borderColor: colors.surface }}
    >
      <NavbarLinks isMobile onClick={onClose} />
      <div className="h-px my-2" style={{ backgroundColor: `${colors.text.muted}20` }} />
      <NavbarAuth isMobile onClick={onClose} />
    </div>
  );
};
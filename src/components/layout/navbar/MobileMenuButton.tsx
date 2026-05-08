'use client';

import { Menu, X } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  const colors = getColors();
  
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 rounded-lg transition-colors"
      style={{ color: colors.text.primary }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${colors.text.muted}10`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};
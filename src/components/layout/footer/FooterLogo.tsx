'use client';

import { Music2 } from 'lucide-react';
import { getColors } from '@/store/colorStore';

export const FooterLogo = () => {
  const colors = getColors();
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <Music2 size={24} style={{ color: colors.primary }} />
      <span 
        className="font-bold text-xl"
        style={{ color: colors.text.primary }}
      >
        Lyrics Library
      </span>
    </div>
  );
};
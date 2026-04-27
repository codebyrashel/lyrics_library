'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface FooterBottomProps {
  currentYear: number;
}

export const FooterBottom = ({ currentYear }: FooterBottomProps) => {
  const colors = getColors();
  
  return (
    <div 
      className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
      style={{ 
        borderTop: `1px solid ${colors.surface}`,
        color: colors.text.muted
      }}
    >
      <p className="text-xs">
        © {currentYear} Lyrics Library. All rights reserved.
      </p>
      <div className="flex items-center gap-2 text-xs">
        <span>Made with</span>
        <Heart size={12} style={{ color: colors.status.error }} />
        <span>for music lovers worldwide</span>
      </div>
      <div className="flex items-center gap-4">
        <Link 
          href="/accessibility" 
          className="text-xs transition hover:underline"
          style={{ color: colors.text.muted }}
        >
          Accessibility
        </Link>
        <Link 
          href="/sitemap" 
          className="text-xs transition hover:underline"
          style={{ color: colors.text.muted }}
        >
          Sitemap
        </Link>
      </div>
    </div>
  );
};
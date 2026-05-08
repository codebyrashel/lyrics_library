'use client';

import { Music2 } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import Link from 'next/link';

export const NavbarLogo = () => {
  const colors = getColors();
  
  return (
    <Link href="/" className="flex items-center gap-2">
      <Music2 size={28} style={{ color: colors.primary }} />
      <span 
        className="font-bold text-xl"
        style={{ color: colors.text.primary }}
      >
        Lyrics Library
      </span>
    </Link>
  );
};
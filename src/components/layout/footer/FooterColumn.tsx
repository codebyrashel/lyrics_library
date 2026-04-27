'use client';

import Link from 'next/link';
import { getColors } from '@/store/colorStore';

interface FooterColumnProps {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export const FooterColumn = ({ title, links }: FooterColumnProps) => {
  const colors = getColors();
  
  return (
    <div>
      <h3 
        className="font-semibold mb-4"
        style={{ color: colors.text.primary }}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith('#') ? (
              <a
                href={link.href}
                className="text-sm transition-colors duration-200 hover:underline"
                style={{ color: colors.text.secondary }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm transition-colors duration-200 hover:underline"
                style={{ color: colors.text.secondary }}
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
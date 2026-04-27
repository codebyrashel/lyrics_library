'use client';

import { Globe, MessageCircle, Video, Camera } from 'lucide-react';
import { getColors } from '@/store/colorStore';

const socialIcons = [
  { icon: Globe, href: '#' },
  { icon: MessageCircle, href: '#' },
  { icon: Video, href: '#' },
  { icon: Camera, href: '#' },
];

export const FooterSocial = () => {
  const colors = getColors();
  
  return (
    <div className="flex gap-4">
      {socialIcons.map((social, index) => {
        const Icon = social.icon;
        return (
          <a
            key={index}
            href={social.href}
            className="transition-all duration-200 hover:scale-110"
            style={{ color: colors.text.secondary }}
          >
            <Icon size={20} />
          </a>
        );
      })}
    </div>
  );
};
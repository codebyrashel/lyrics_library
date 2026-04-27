'use client';

import { Music2 } from 'lucide-react';
import { FaYoutube, FaDiscord, FaLinkedin } from 'react-icons/fa';
import { getColors } from '@/store/colorStore';

const socialLinks = [
  { icon: FaLinkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: '#0A66C2' },
  { icon: FaDiscord, label: 'Discord', href: 'https://discord.com', color: '#5865F2' },
  { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com', color: '#FF0000' },
];

export const FooterBrand = () => {
  const colors = getColors();
  
  return (
    <div className="lg:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Music2 size={18} className="text-white" />
        </div>
        <span 
          className="text-lg font-bold"
          style={{ color: colors.text.primary }}
        >
          Lyrics Library
        </span>
      </div>

      <p 
        className="text-sm mb-4 max-w-md"
        style={{ color: colors.text.secondary }}
      >
        Watch videos and listen to music with friends in perfect sync. 
        Create private rooms, chat in real-time, and never lose track of what you watched.
      </p>

      <div className="flex gap-4 mt-6 mb-2">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-200 hover:scale-110"
              aria-label={social.label}
            >
              <Icon size={24} color={social.color} />
            </a>
          );
        })}
      </div>
    </div>
  );
};
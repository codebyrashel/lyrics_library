'use client';

import { IconType } from 'react-icons';
import { getColors } from '@/store/colorStore';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
  iconColor?: string;
}

export const FeatureCard = ({ icon: Icon, title, description, iconColor }: FeatureCardProps) => {
  const colors = getColors();
  
  return (
    <div 
      className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div 
        className="inline-flex p-3 rounded-lg mb-4"
        style={{ backgroundColor: iconColor ? `${iconColor}10` : `${colors.primary}10` }}
      >
        <Icon size={24} style={{ color: iconColor || colors.primary }} />
      </div>
      <h3 
        className="text-xl font-semibold mb-2"
        style={{ color: colors.text.primary }}
      >
        {title}
      </h3>
      <p style={{ color: colors.text.secondary }}>
        {description}
      </p>
    </div>
  );
};
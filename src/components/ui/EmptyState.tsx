'use client';

import { Heart } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  const colors = getColors();
  
  return (
    <div 
      className="rounded-xl p-12 text-center"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div 
        className="inline-flex p-4 rounded-full mb-4"
        style={{ backgroundColor: `${colors.primary}10` }}
      >
        <Heart size={32} style={{ color: colors.primary }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
        {title}
      </h3>
      <p style={{ color: colors.text.muted }}>
        {description}
      </p>
    </div>
  );
};
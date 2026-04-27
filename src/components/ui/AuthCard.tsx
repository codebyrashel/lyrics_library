'use client';

import { ReactNode } from 'react';
import { getColors } from '@/store/colorStore';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
  const colors = getColors();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div 
        className="max-w-md w-full p-8 rounded-lg shadow-lg"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.surface}`
        }}
      >
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            {title}
          </h1>
          <p style={{ color: colors.text.secondary }}>
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
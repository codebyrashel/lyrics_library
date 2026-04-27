'use client';

import { ReactNode } from 'react';
import { getColors } from '@/store/colorStore';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  className?: string;
}

export const Button = ({ children, variant = 'primary', onClick, className = '' }: ButtonProps) => {
  const colors = getColors();
  
  const getVariantStyles = () => {
    switch(variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: 'white',
          border: 'none'
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: 'white',
          border: 'none'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `2px solid ${colors.primary}`
        };
    }
  };
  
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 ${className}`}
      style={getVariantStyles()}
    >
      {children}
    </button>
  );
};
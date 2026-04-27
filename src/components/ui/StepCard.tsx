'use client';

import { getColors } from '@/store/colorStore';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

export const StepCard = ({ number, title, description, isLast = false }: StepCardProps) => {
  const colors = getColors();
  
  return (
    <div className="relative flex-1">
      <div className="text-center">
        {/* Step Number Circle */}
        <div 
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 text-2xl font-bold relative z-10"
          style={{ 
            backgroundColor: colors.primary,
            color: 'white'
          }}
        >
          {number}
        </div>
        
        {/* Step Content */}
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
      
      {/* Connector Line */}
      {!isLast && (
        <div 
          className="hidden md:block absolute top-8 left-1/2 w-full h-0.5"
          style={{ 
            backgroundColor: `${colors.primary}30`,
            transform: 'translateY(-50%)'
          }}
        />
      )}
    </div>
  );
};